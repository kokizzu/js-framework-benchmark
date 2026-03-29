import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  build: {
    assetsDir: "",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("chart.js") || id.includes("@sgratzl/chartjs-chart-boxplot")) {
            return "chartjs";
          }
        },
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
});
