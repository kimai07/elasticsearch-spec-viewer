import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rollupReplace from "@rollup/plugin-replace";

export default defineConfig({
  base: "/elasticsearch-spec-viewer/",
  build: {
    chunkSizeWarningLimit: 10000000,
  },
  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
    }),
    react(),
  ],
  resolve: process.env.USE_SOURCE
    ? {
        alias: {
          "react-table": path.resolve(__dirname, "../../../src/index.ts"),
        },
      }
    : {},
});
