import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // Honor the PORT env var (e.g. set by the preview tooling); fall back to Vite's default.
        port: process.env.PORT ? Number(process.env.PORT) : undefined,
    },
})
