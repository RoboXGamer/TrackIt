/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  // Add other env variables here
}

// Remove the global namespace wrapper
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
