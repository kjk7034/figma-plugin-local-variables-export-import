import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: "./src/plugin/index.ts",
      output: {
        entryFileNames: "plugin.js",
      },
    },
  },
});
