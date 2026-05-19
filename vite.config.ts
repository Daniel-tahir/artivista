import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { syncArtworkManifests } from "./scripts/sync-artwork-manifests.mjs";

const artworkRoot = path.resolve(__dirname, "./public/assets/artwork");

const artworkManifestPlugin = () => ({
  name: "artwork-manifest-sync",
  async buildStart() {
    await syncArtworkManifests();
  },
  configureServer(server) {
    const shouldHandle = (file: string) => {
      const normalized = file.replaceAll("\\", "/");

      if (!normalized.includes("/public/assets/artwork/")) {
        return false;
      }

      if (normalized.endsWith("/categories.json")) {
        return true;
      }

      if (normalized.endsWith("/manifest.json")) {
        return false;
      }

      const extension = path.extname(normalized).toLowerCase();
      return [".webp", ".png", ".jpg", ".jpeg", ".avif"].includes(extension);
    };

    const syncAndReload = async () => {
      await syncArtworkManifests();
      server.ws.send({ type: "full-reload" });
    };

    const queueSync = (file: string) => {
      if (!shouldHandle(file)) {
        return;
      }

      syncAndReload().catch((error) => {
        console.error("Failed to sync artwork manifests:", error);
      });
    };

    server.watcher.add(artworkRoot);
    server.watcher.on("add", queueSync);
    server.watcher.on("unlink", queueSync);
    server.watcher.on("change", queueSync);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [artworkManifestPlugin(), react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
