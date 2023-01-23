const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("autoprefixer"),
    require("cssnano"),
    purgecss({
      content: ["src/**/*.{astro,html,ts,tsx,js,jsx}"],
    }),
  ],
};
