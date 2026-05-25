import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.funko.com" },
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "**.imgur.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "cconnect.s3.amazonaws.com" },
      // Unsplash (imágenes de productos)
      { protocol: "https", hostname: "images.unsplash.com" },
      // Placehold / utilidades
      { protocol: "https", hostname: "placehold.co" },
      // Fandom / Wikia CDN
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
      // Funko Pops en distintos retailers
      { protocol: "https", hostname: "**.media-amazon.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
