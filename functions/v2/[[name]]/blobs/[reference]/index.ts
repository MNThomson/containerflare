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
  let data = await context.env.containerFlareR2.get(reference);
  console.log("DATA:", !!data);
  if (!data) {
    return new Response("{}", { status: 404 });
  }

  // let resp = new Response(data.body);
  let resp = new Response(data.body);

  return resp;
};
