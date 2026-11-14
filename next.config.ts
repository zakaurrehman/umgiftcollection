import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The original store's URLs all end in "/" (e.g. /product/<slug>/). Keeping
  // trailing slashes preserves every indexed URL exactly.
  trailingSlash: true,
  images: {
    // Product photography is served from the store's own ImageKit CDN, which
    // resizes and re-encodes on the fly (see src/lib/image-loader.ts).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Fewer breakpoints = shorter srcset strings on product-heavy pages.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  async redirects() {
    // Legacy WooCommerce-style paths still listed in the original robots.txt.
    return [
      { source: "/checkout", destination: "/cart/", permanent: true },
      { source: "/my-account", destination: "/track-order/", permanent: true },
      { source: "/product-category/:slug", destination: "/category/:slug/", permanent: true },
      { source: "/search", destination: "/shop/", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
