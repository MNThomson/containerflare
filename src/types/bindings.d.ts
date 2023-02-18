import type { KVNamespace, R2Bucket } from "@cloudflare/workers-types";

export interface Env {
  ENVIRONMENT: "production" | "preview" | "development";

  containerFlareKV: KVNamespace;
  containerFlareR2: R2Bucket;
}

export type RequestParams = "name" | "reference";
