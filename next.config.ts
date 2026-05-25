import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Todas las imágenes de productos son locales (/public/funkos/).
    // Solo necesitamos dominios externos para Supabase Storage.
    remotePatterns: [
      // Supabase Storage (avatars, uploads de usuarios)
      { protocol: "https", hostname: "**.supabase.co" },
      // cconnect — backup por si algún producto aún tiene URL absoluta
      { protocol: "https", hostname: "cconnect.s3.amazonaws.com" },
    ],
  },
};

export default nextConfig;
