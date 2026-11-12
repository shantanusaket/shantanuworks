import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "ShantanuWorks", short_name: "ShantanuWorks", description: "Ideas. Engineered for Impact.", start_url: "/", display: "standalone", background_color: "#0F172A", theme_color: "#0F172A",
    icons: [{ src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] };
}
