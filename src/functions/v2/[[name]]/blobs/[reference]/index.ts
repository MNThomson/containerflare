import {
  type EventContext,
  type PagesFunction,
  Response,
} from "@cloudflare/workers-types";

import type { Env, RequestParams } from "@types/bindings";

import { errorNoData } from "@utils/response";
import { parseParams } from "@utils/url";

export const onRequest: PagesFunction<Env> = async (
  context: EventContext<Env, RequestParams, Record<string, unknown>>
) => {
  const { reference, error } = parseParams(context.params);
  if (error != null) {
    return error;
  }

  let response: typeof Response;

  // DB Query
  const data = await context.env.containerFlareR2.get(reference);
  if (data == null) {
    response = errorNoData();
  } else {
    response = new Response(data.body);
  }

  return response;
};
