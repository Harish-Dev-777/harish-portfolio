import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Enable Fast Refresh for better DX
      fastRefresh: true,
      // Babel optimizations
      babel: {
        plugins: [],
      },
    }),
  ],

  // Build optimizations
  build: {
    // Target modern browsers for smaller bundles
    target: "es2015",
    
    // Enable minification
    minify: "esbuild",
    esbuild: {
      drop: ["console", "debugger"],
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "animation-vendor": ["gsap", "framer-motion"],
          "ui-vendor": ["lucide-react", "react-icons"],
        },
        // Optimize chunk file names
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Source maps for production debugging (optional, disable for smaller builds)
    sourcemap: false,

    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },

  // Server optimizations
  server: {
    // Enable CORS
    cors: true,
    // Faster HMR
    hmr: {
      overlay: true,
    },
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "gsap",
      "framer-motion",
    ],
    exclude: ["locomotive-scroll"],
  },

  // Performance hints
  preview: {
    port: 4173,
    strictPort: true,
  },
});
