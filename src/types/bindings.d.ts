import type { KVNamespace, R2Bucket } from "@cloudflare/workers-types";

interface Env {
  ENVIRONMENT: "production" | "preview" | "development";

  containerFlareKV: KVNamespace;
  containerFlareR2: R2Bucket;
}

type RequestParams = "name" | "reference";
