import { CFRequest, Env } from "./index";

async function blobs(req: CFRequest, env: Env) {
  // DB Query
  let data = await env.containerFlareR2.get(req.tag);
  console.log("DATA:", !!data);
  if (!data) {
    return new Response("{}", { status: 404 });
  }

  // let resp = new Response(data.body);
  let resp = new Response(await data.arrayBuffer());

  return resp;
}

export default blobs;
