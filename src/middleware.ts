import { createKV, createR2 } from "./lib/server/miniflare";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  if (import.meta.env.DEV) {
    context.locals.runtime = {
      env: {
        kv: await createKV({ type: "file", path: ".mf/kv" }),
        r2: await createR2({ type: "file", path: ".mf/r2" }),
      },
    };
  }

  return next();
});
