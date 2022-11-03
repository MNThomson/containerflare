import { CFRequest } from "./index";

async function blobs(req: CFRequest) {
  console.log("Blob", req.path);
  return new Response();
}

export default blobs;
