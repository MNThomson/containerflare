import { errorNoData } from "@utils/response";
import { parseParams } from "@utils/url";

import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const { reference, error } = parseParams(context.params);
  if (error != null) {
    return error;
  }

  let response: typeof Response;

  // DB Query
  const data = await context.locals?.runtime?.env.r2.get(reference);
  if (data == null) {
    response = errorNoData();
  } else {
    response = new Response(data.body);
  }

  return response;
}
