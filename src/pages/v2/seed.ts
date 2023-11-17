// import type { Env} from "../../../env.d.ts"

let authHeader: string;

async function getAuth() {
  const resp = await fetch(
    "https://auth.docker.io/token?scope=repository%3Alibrary%2Fhello-world%3Apull&service=registry.docker.io",
  );
  return "Bearer " + ((await resp.json()) as Record<string, string>).token;
}

async function seedTag(env: Env, tag: string) {
  // Get hello-world:latest
  const label_req = await fetch(
    "https://registry-1.docker.io/v2/library/hello-world/manifests/latest",
    {
      method: "HEAD",
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.docker.distribution.manifest.list.v2+json",
      },
    },
  );

  if (label_req.status != 200) {
    console.error("Tag does not exist", label_req.statusText);
    return;
  }

  console.log(await label_req.text());

  const sha_hash = await label_req.headers.get("docker-content-digest")!;
  await env.kv.put(tag, sha_hash);
  console.log(sha_hash);
  seedOS(env, sha_hash);
}

async function seedOS(env: Env, hash: string) {
  // Get sha256:
  const label_req = await fetch(
    `https://registry-1.docker.io/v2/library/hello-world/manifests/${hash}`,
    {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.docker.distribution.manifest.list.v2+json",
      },
    },
  );

  if (label_req.status != 200) {
    console.error("OS list does not exist", label_req.statusText);
    return;
  }

  const os_list = await label_req.text();
  await env.kv.put(hash, os_list);
  const os_json = JSON.parse(os_list) as Record<any, any>;

  for (var key in os_json.manifests) {
    seedImage(env, os_json.manifests[key].digest);
  }
}

async function seedImage(env: Env, hash: string) {
  // Get sha256:
  const label_req = await fetch(
    `https://registry-1.docker.io/v2/library/hello-world/manifests/${hash}`,
    {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.docker.distribution.manifest.v2+json",
      },
    },
  );

  if (label_req.status != 200) {
    console.error("OS list does not exist", label_req.statusText);
    return;
  }

  const os_list = await label_req.text();
  await env.kv.put(hash, os_list);
  const image_json = JSON.parse(os_list) as Record<any, any>;

  seedBlob(env, image_json.config.digest);
  for (var key in image_json.layers) {
    seedBlob(env, image_json.layers[key].digest);
  }
}

async function seedBlob(env: Env, hash: string) {
  const req = await fetch(
    `https://registry-1.docker.io/v2/library/hello-world/blobs/${hash}`,
    {
      headers: {
        Authorization: authHeader,
      },
    },
  );

  if (req.status != 200) {
    console.error("Seed not 200", req.statusText);
  }

  await env.r2.put(hash, await req.arrayBuffer());
}

export const GET: APIRoute = async (context) => {
  // if (!import.meta.env.DEV) {
  //   return new Response("", { status: 404 });
  // }

  console.log("Seeding...");
  authHeader = await getAuth();
  await seedTag(context.locals?.runtime?.env, "hello-world:latest");
  console.log("DONE Seeding");

  return new Response("DONE");
};
