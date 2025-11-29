// vite.config.js
import { defineConfig } from "file:///D:/projects/hirepath-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/projects/hirepath-frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import fs from "fs/promises";
import svgr from "file:///D:/projects/hirepath-frontend/node_modules/@svgr/rollup/dist/index.js";
var __vite_injected_original_dirname = "D:\\projects\\hirepath-frontend";
var vite_config_default = defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      src: resolve(__vite_injected_original_dirname, "src")
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad(
              { filter: /src\\.*\.js$/ },
              async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8")
              })
            );
          }
        }
      ]
    }
  },
  plugins: [svgr(), react()],
  base: "/hirepath"
});
export {

};

