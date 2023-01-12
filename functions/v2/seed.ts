import type { KVNamespace, R2Bucket } from "@cloudflare/workers-types";

interface Env {
  containerFlareKV: KVNamespace;
  containerFlareR2: R2Bucket;
}

let authHeader: string;

async function getAuth() {
  const resp = await fetch(
    "https://auth.docker.io/token?scope=repository%3Alibrary%2Fhello-world%3Apull&service=registry.docker.io"
  );
  return (
    "Bearer " + ((await resp.json()) as Record<string, string>).access_token
  );
}

async function seedKV(env: Env) {
  await env.containerFlareKV.put(
    "hello-world/latest",
    `sha256:e18f0a777aefabe047a671ab3ec3eed05414477c951ab1a6f352a06974245fe7`
  );

  await env.containerFlareKV.put(
    "e18f0a777aefabe047a671ab3ec3eed05414477c951ab1a6f352a06974245fe7",
    `{
   "manifests": [
      {
         "digest": "sha256:f54a58bc1aac5ea1a25d796ae155dc228b3f0e11d046ae276b39c4bf2f13d8c4",
         "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
         "platform": {
            "architecture": "amd64",
            "os": "linux"
         },
         "size": 525
      }
   ],
   "mediaType": "application/vnd.docker.distribution.manifest.list.v2+json",
   "schemaVersion": 2
}`
  );

  await env.containerFlareKV.put(
    "f54a58bc1aac5ea1a25d796ae155dc228b3f0e11d046ae276b39c4bf2f13d8c4",
    `{
   "schemaVersion": 2,
   "mediaType": "application/vnd.docker.distribution.manifest.v2+json",
   "config": {
      "mediaType": "application/vnd.docker.container.image.v1+json",
      "size": 1469,
      "digest": "sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412"
   },
   "layers": [
      {
         "mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
         "size": 2479,
         "digest": "sha256:2db29710123e3e53a794f2694094b9b4338aa9ee5c40b930cb8063a1be392c54"
      }
   ]
}`
  );
}

async function seedR2(env: Env) {
  const req = await fetch(
    "https://registry-1.docker.io/v2/library/hello-world/blobs/sha256:2db29710123e3e53a794f2694094b9b4338aa9ee5c40b930cb8063a1be392c54",
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  if (req.status != 200) {
    console.error("Seed not 200", req.statusText);
    return new Response();
  }

  await env.containerFlareR2.put(
    "sha256:2db29710123e3e53a794f2694094b9b4338aa9ee5c40b930cb8063a1be392c54",
    await req.arrayBuffer()
  );

  const req2 = await fetch(
    "https://registry-1.docker.io/v2/library/hello-world/blobs/sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412",
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  await env.containerFlareR2.put(
    "sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412",
    await req2.arrayBuffer()
  );

  const output = await env.containerFlareR2.list();
  console.log("DONE", output);
}

export const onRequest: PagesFunction<Env> = async (
  context: EventContext<Env, "image", null>
) => {
  console.log("Seeding...");
  // authHeader = await getAuth();
  // await Promise.all([seedKV(context.env), seedR2(context.env)]);
  return new Response("Seeding done");
};
