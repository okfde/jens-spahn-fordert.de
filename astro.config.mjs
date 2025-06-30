import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  env: {
    schema: {
      NOCODB_URL: envField.string({ context: "server", access: "secret" }),
      NOCODB_TOKEN: envField.string({ context: "server", access: "secret" }),
    },
  },
});
