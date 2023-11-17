import cloudflare from "@astrojs/cloudflare";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  publicDir: "./src/public",
  site: `https://cfcr.dev`,
  output: "server",
  adapter: cloudflare({
    mode: "directory",
    runtime: { mode: 'local', persistTo: '.wrangler/state/v3' }
  }),
});
