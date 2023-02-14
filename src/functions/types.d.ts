import type { Response as WorkerResponse } from "@cloudflare/workers-types";

// `@cloudflare/workers-types` conflicts with `@types/node`, so we can't include
// it in the `tsconfig.json` `types` array
declare global {
  const Response: typeof WorkerResponse;
}
