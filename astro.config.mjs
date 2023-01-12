import { defineConfig } from "astro/config";
// import preact from "@astrojs/preact";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
// https://github.com/rodneylab/astro-cloudflare
export default defineConfig({
  // integrations: [preact()],
  site: `http://astro.build`,
  output: "server",
  adapter: cloudflare(/*{ mode: "directory" }*/),
});
