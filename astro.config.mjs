import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  experimental: {
    prerender: true,
    errorOverlay: true,
  },
  publicDir: "./src/public",
  site: `https://cfcr.dev`,
  output: "server",
  adapter: cloudflare({ mode: "directory" }),
});
