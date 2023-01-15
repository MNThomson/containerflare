import type {
  EventContext,
  PagesFunction,
  Response,
} from "@cloudflare/workers-types";

import type { Env, RequestParams } from "@types/bindings";

import { parseParams } from "@utils/url";

export const onRequest: PagesFunction<Env> = async (
  context: EventContext<Env, RequestParams, {}>
) => {
  const { reference, error } = parseParams(context.params);
  if (error) {
    return error;
  }

  let response: Response;

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
