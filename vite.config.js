import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  base: "/<REPO>/",
  plugins: [svelte()],
  build: {
    // Optimize build output
    cssCodeSplit: true,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          vendor: ["svelte"],
        },
        // Optimize chunk size
        compact: true,
      },
    },
    // Minification (esbuild is faster than terser)
    minify: "esbuild",
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["svelte"],
  },
  // Performance optimizations
  server: {
    // Enable HTTP/2 server push
    http2: false, // Set to true if using HTTPS
  },
});
