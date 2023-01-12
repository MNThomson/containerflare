import type { PagesFunction, Env, Request } from "@cloudflare/workers-types";

import { parseParams } from "../../../../../src/utils/url";

interface Env {
  containerFlareKV: KVNamespace;
  containerFlareR2: R2Bucket;
}

type requestParams = "name" | "reference";

export const onRequest: PagesFunction<Env> = async (
  context: EventContext<Env, requestParams, null>
) => {
  const { name, reference, error } = parseParams(context.params);
  console.log({ name, reference, error });
  if (error) {
    return new Response("{}", { status: 404 });
  }

  // DB Query
  let dbKey = "";
  if (reference.includes("sha256")) {
    dbKey = reference.replace("sha256:", "");
  } else {
    dbKey = name + "/" + reference;
  }
  console.log("DBKey:", dbKey);

  // Potential for readable stream and no waiting
  let data = await context.env.containerFlareKV.get(dbKey);
  console.log("DATA:", !!data);
  if (!data) {
    return new Response("{}", { status: 404 });
  }

  // Set body of response
  let body = "";
  if (req.method !== "HEAD") {
    body = data;
  }

  let resp = new Response(body);

  // Set docker-content-digest header
  let shaTag = reference;
  if (!reference.includes("sha256")) {
    shaTag = data;
  }
  console.log("SHATag:", shaTag);
  resp.headers.set("docker-content-digest", shaTag);

  // Set Content-Type header
  let contentType = "";
  if (data.startsWith("{")) {
    contentType = JSON.parse(data)?.mediaType;
  }
  if (!contentType) {
    contentType = "application/vnd.docker.distribution.manifest.list.v2+json";
  }
  console.log("ContentType:", contentType);
  resp.headers.set("Content-Type", contentType);
  resp.headers.set("Content-Length", "2");

  return resp;
};
