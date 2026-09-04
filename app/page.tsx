import type { Metadata } from "next";
import { ProductToolPage } from "./product-page";
import { productPages, SITE_URL } from "./product-config";

export const metadata: Metadata = {
  title: productPages[""].title,
  description: productPages[""].description,
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  return <ProductToolPage page={productPages[""]} />;
}
