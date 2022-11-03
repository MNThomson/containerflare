import { Env } from "./index";

async function seedDB(env: Env) {
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

export default seedDB;
