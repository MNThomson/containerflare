import type { PagesFunction, Response } from "@cloudflare/workers-types";

import type { Env } from "@types/bindings";

export const onRequest: PagesFunction<Env> = async () => {
  return new Response();
};
