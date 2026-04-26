import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { buildSitemapXml } from "./scripts/sitemap-routes.mjs";

function sitemapPlugin() {
  const writeSitemap = () => {
    const xml = buildSitemapXml();
    const target = path.resolve(__dirname, "public", "sitemap.xml");
    fs.writeFileSync(target, xml, "utf-8");
  };
  return {
    name: "generate-sitemap",
    buildStart() {
      writeSitemap();
    },
    configureServer() {
      writeSitemap();
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    sitemapPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
