// // import path from "path";
// // import { fileURLToPath } from "url";
// // import tailwindcss from "@tailwindcss/vite";
// // import react from "@vitejs/plugin-react";
// // import { defineConfig } from "vite";
// // import { viteSingleFile } from "vite-plugin-singlefile";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // https://vite.dev/config/
// // export default defineConfig({
// //   plugins: [react(), tailwindcss(), viteSingleFile()],
// //   resolve: {
// //     alias: {
// //       "@": path.resolve(__dirname, "src"),
// //     },
// //   },
// // });





// import path from "path";
// import { fileURLToPath } from "url";
// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";
// import { viteSingleFile } from "vite-plugin-singlefile";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig({
//   plugins: [react(), tailwindcss(), viteSingleFile()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/uploads": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });



// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});