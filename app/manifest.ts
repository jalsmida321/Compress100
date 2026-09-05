import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Compress100", short_name: "Compress100", description: "Private image compression in your browser.", start_url: "/", display: "standalone", background_color: "#172033", theme_color: "#172033", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }] };
}
