import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Compress100", short_name: "Compress100", description: "Private image compression in your browser.", start_url: "/", display: "standalone", background_color: "#f5f5f5", theme_color: "#f5f5f5", icons: [{ src: "/piclite-cat-head-light.png", sizes: "512x512", type: "image/png" }] };
}
