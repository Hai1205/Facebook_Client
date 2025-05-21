/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string
    readonly VITE_SOCKET_URL: string
    readonly VITE_CLIENT_URL: string
    readonly VITE_CLIENT_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Thêm định nghĩa cho biến global
interface Window {
    global: Window;
}

declare const global: Window; 