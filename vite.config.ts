import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Para mostrar la demo por un túnel temporal de Cloudflare (trycloudflare.com).
  preview: { allowedHosts: [".trycloudflare.com"] },
});
