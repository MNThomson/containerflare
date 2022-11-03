import manifests from "./manifests";
import blobs from "./blobs";
import seedDB from "./seed";
import parseRequest, { MoreRequestData } from "./url";

export interface Env {
  // R2 Binding: https://developers.cloudflare.com/workers/runtime-apis/r2/
  containerFlareR2: R2Bucket;

  // KV Binding: https://developers.cloudflare.com/workers/runtime-apis/kv/
  containerFlareKV: KVNamespace;
}

export type CFRequest = Request & MoreRequestData;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Seed the dev DB with test data
    await seedDB(env);

    // Add additional data to the request
    const req: CFRequest = Object.assign(request.clone(), {
      ...parseRequest(request.url),
    });

    // Request router
    if (req.type === "manifests") {
      return await manifests(req, env);
    } else if (req.type === "blobs") {
      return await blobs(req);
    } else {
      console.log("Uh oh...");
      return new Response("Uh oh...", { status: 404 });
    }
  },
};
