/// <reference types="astro/client" />
import type { KVNamespace, R2Bucket } from "@cloudflare/workers-types";
import type { DirectoryRuntime } from "@astrojs/cloudflare";

type ENV = {
  kv: KVNamespace;
  r2: R2Bucket;
};

declare namespace App {
  interface Locals extends DirectoryRuntime {
    runtime: DirectoryRuntime & { env: { 
      kv: KVNamespace;
      r2: R2Bucket;
     } };
  }
}
