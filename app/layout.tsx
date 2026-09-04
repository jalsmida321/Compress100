import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://compress100.com"),
  title: { default: "Compress100 - Private Image Compression", template: "%s | Compress100" },
  description: "Compress images to a target file size in your browser. Private, free and no upload required.",
  applicationName: "Compress100",
  openGraph: { title: "Compress100 - Private Image Compression", description: "Compress images locally in your browser. No upload required.", type: "website", images: [{ url: "/og.png", width: 1731, height: 909, alt: "Compress100 private image compression" }] },
  twitter: { card: "summary_large_image", title: "Compress100 - Private Image Compression", description: "Compress images locally in your browser. No upload required.", images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
