import { CFRequest, Env } from "./index";

async function manifests(req: CFRequest, env: Env) {
  let dbKey = "";
  let body = "";

  if (req.tag.includes("sha256")) {
    dbKey = req.tag.replace("sha256:", "");
  } else {
    dbKey = req.image + "/" + req.tag;
  }
  console.log("DBKey: ", dbKey);

  let data = await env.containerFlareKV.get(dbKey);
  console.log("DATA: ", !!data);
  if (!data) {
    return new Response("{}", { status: 404 });
  }

  if (req.method !== "HEAD") {
    body = data;
  }

  let resp = new Response(body);

  let shaTag = req.tag;
  if (!req.tag.includes("sha256")) {
    shaTag = data;
  }
  console.log("SHATag: ", shaTag);
  resp.headers.set("docker-content-digest", shaTag);

  let contentType = "";
  if (data.startsWith("{")) {
    contentType = JSON.parse(data)?.mediaType;
  }
  if (!contentType) {
    contentType = "application/vnd.docker.distribution.manifest.list.v2+json";
  }
  console.log("ContentType: ", contentType);
  resp.headers.set("Content-Type", contentType);

  return resp;
}

export default manifests;
