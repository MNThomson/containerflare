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
    return new Response(
      `{"errors": [{
          "code": "123",
          "message": "Bad Params",
          "detail": "Bad Params"
          }]}`,
      { status: 404 }
    );
  }

  let cache = await caches.open("blob:cache");
  let cacheKey = new Request(context.request.url, context.request);
  let response = await cache.match(cacheKey);
  console.log("CAHCE HIT:", !!response);
  if (!response) {
    // DB Query
    let data = await context.env.containerFlareR2.get(reference);
    console.log("DATA:", !!data);
    if (!data) {
      response = new Response(
        `{"errors": [{
          "code": "123",
          "message": "No Data",
          "detail": "No Data"
        }]}`,
        {
          status: 404,
          headers: {
            "Cache-Control": "s-maxage=86400",
          },
        }
      );
    } else {
      // let resp = new Response(data.body);
      response = new Response(data.body, {
        headers: {
          "Cache-Control": "s-maxage=86400",
        },
      });
    }

    context.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
};
