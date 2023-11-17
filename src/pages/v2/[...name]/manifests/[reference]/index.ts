import { errorNoData } from "@utils/response";
import { parseParams } from "@utils/url";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const { name, reference } = parseParams(context.params);

  // DB Query
  let dbKey: string;
  if (reference.includes("sha256")) {
    dbKey = reference;
  } else {
    dbKey = name + "/" + reference;
  }

  // Potential for readable stream and no waiting
  const data = await context.locals?.runtime?.env.kv.get(dbKey);
  if (!data) {
    return errorNoData();
  }

  // Set body of response
  let body = "";
  if (context.request.method !== "HEAD") {
    body = data;
  }

  const resp = new Response(body);

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
}
