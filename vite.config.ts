import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { buildSitemapXml } from "./scripts/sitemap-routes";
import { htmlPriceTokens } from "./src/config/pricing";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";

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

// Підставляє ціни з src/config/pricing.ts у токени {{PRICE_...}} в index.html
// (структуровані дані для Google), щоб ціна жила в одному місці.
function pricingPlugin() {
  return {
    name: "inject-pricing",
    transformIndexHtml(html: string) {
      const tokens = htmlPriceTokens();
      return html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key: string) =>
        key in tokens ? tokens[key] : match
      );
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
    pricingPlugin(),
    mcpPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
