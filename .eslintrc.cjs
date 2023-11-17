module.exports = {
  extends: [
    "standard-with-typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "prettier",
    "plugin:astro/recommended",
    "plugin:astro/jsx-a11y-strict",
    "plugin:tailwindcss/recommended",
    "plugin:regexp/recommended",
    "plugin:mocha/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.base.json", "./src/tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "prettier", "sonarjs", "regexp", "mocha"],
  overrides: [
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        extraFileExtensions: [".astro"],
      },
    },
    {
      files: ["src/functions/**/*.ts"],
      parserOptions: {
        project: ["./tsconfig.base.json", "./src/functions/tsconfig.json"],
      },
    },
  ],
};
