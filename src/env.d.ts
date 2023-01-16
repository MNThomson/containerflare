/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GIT_SHA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
