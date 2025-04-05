/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_TASK_SHARING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
