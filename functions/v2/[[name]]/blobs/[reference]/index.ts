import type { PagesFunction, Env } from "@cloudflare/workers-types";

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
    return error;
  }

  let response = new Response();

  // DB Query
  const data = await context.env.containerFlareR2.get(reference);
  if (!data) {
    response = new Response(
      `{"errors": [{
          "code": "123",
          "message": "No Data",
          "detail": "No Data"
        }]}`,
      {
        status: 404,
      }
    );
  } else {
    response = new Response(data.body);
  }

  return response;
};
