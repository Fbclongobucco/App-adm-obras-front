import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // So nos CSS do projeto: aplicado aos CSS internos do Next (fontes do next/font/google),
        // o loader reescrevia as URLs das fontes e o build no Vercel falhava
        // ("next/font/google queries have exactly one entry").
        condition: { not: "foreign" },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
