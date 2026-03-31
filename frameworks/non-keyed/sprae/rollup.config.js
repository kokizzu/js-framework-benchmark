import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

export default {
  input: "src/main.js",
  output: { file: "dist/main.js", format: "iife" },
  plugins: [resolve(), isProduction && terser()],
};
