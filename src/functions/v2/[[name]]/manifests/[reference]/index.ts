import {
  EventContext,
  PagesFunction,
  Response,
} from "@cloudflare/workers-types";

import type { Env, RequestParams } from "@types/bindings";

import { errorNoData } from "@utils/response";
import { parseParams } from "@utils/url";

export const onRequest: PagesFunction<Env> = async (
  context: EventContext<Env, RequestParams, {}>
) => {
  const { name, reference, error } = parseParams(context.params);
  if (error) {
    return error;
  }

  // DB Query
  let dbKey: string;
  if (reference.includes("sha256")) {
    dbKey = reference.replace("sha256:", "");
  } else {
    dbKey = name + "/" + reference;
  }

  // Potential for readable stream and no waiting
  let data = await context.env.containerFlareKV.get(dbKey);
  if (!data) {
    return errorNoData();
  }

  // Set body of response
  let body = "";
  if (context.request.method !== "HEAD") {
    body = data;
  }

  let resp = new Response(body);

  // Set docker-content-digest header
  let shaTag = reference;
  if (!reference.includes("sha256")) {
    shaTag = data;
  }
  resp.headers.set("docker-content-digest", shaTag);

  // Set Content-Type header
  let contentType = "";
  if (data.startsWith("{")) {
    contentType = JSON.parse(data)?.mediaType;
  }
  if (!contentType) {
    contentType = "application/vnd.docker.distribution.manifest.list.v2+json";
  }
  resp.headers.set("Content-Type", contentType);
  resp.headers.set("Content-Length", data.length.toString());

  return resp;
};
