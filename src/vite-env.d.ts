/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "true" answers /api requests in the browser with MSW instead of json-server. */
  readonly VITE_MOCK_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
