import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://compress100.com"),
  title: { default: "Compress100 - Private Image Compression", template: "%s | Compress100" },
  description: "Compress images to a target file size in your browser. Private, free and no upload required.",
  applicationName: "Compress100",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, title: "Compress100", statusBarStyle: "default" },
  formatDetection: { telephone: false },
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
      <body>
        {children}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-SYKTM2CFX8" />
        <Script id="google-analytics">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-SYKTM2CFX8');`}
        </Script>
      </body>
    </html>
  );
}
