export const SITE_URL = "https://compress100.com";

export type ProductPage = {
  slug: "" | "gif-compressor" | "compress-to-50kb" | "compress-to-200kb";
  keyword: string;
  title: string;
  description: string;
  heading: string;
  lead: string;
  targetKb: number;
  gifOnly?: boolean;
  faq: Array<{ question: string; answer: string }>;
};

const sharedFaq = [
  {
    question: "Are my images uploaded to a server?",
    answer: "No. Compression runs in your browser. Your image data never leaves your device.",
  },
  {
    question: "Which image formats are supported?",
    answer: "Compress100 supports JPG, PNG, WebP and animated GIF files in compatible browsers.",
  },
];

export const productPages: Record<ProductPage["slug"], ProductPage> = {
  "": {
    slug: "",
    keyword: "compress image to 100kb",
    title: "Compress Image to 100KB Online - Private, No Upload",
    description: "Compress JPG, PNG, WebP or GIF images to 100KB or less in your browser. Free, private and no upload required.",
    heading: "Compress an image to 100KB",
    lead: "Meet a 100KB file limit without sending your image to a server.",
    targetKb: 100,
    faq: [
      ...sharedFaq,
      {
        question: "Will the result be exactly 100KB?",
        answer: "Compress100 aims for 100KB or less. Image encoders produce discrete file sizes, so the final result may be smaller than 100KB.",
      },
      {
        question: "How does Compress100 reduce an image below 100KB?",
        answer: "It first lowers encoding quality, then reduces pixel dimensions only when needed. Every attempt is measured using the actual encoded file.",
      },
    ],
  },
  "gif-compressor": {
    slug: "gif-compressor",
    keyword: "gif compressor",
    title: "GIF Compressor - Compress Animated GIFs Privately",
    description: "Compress animated GIFs locally in your browser. Reduce GIF file size without uploading, signing up or losing animation.",
    heading: "Compress animated GIFs locally",
    lead: "Shrink an animated GIF while keeping every frame on your device.",
    targetKb: 100,
    gifOnly: true,
    faq: [
      ...sharedFaq,
      {
        question: "Will my GIF stay animated?",
        answer: "Yes. Compatible browsers decode and re-encode the animation frame by frame instead of turning it into a still image.",
      },
      {
        question: "Why does GIF compression take longer?",
        answer: "Each frame must be decoded, resized and assigned a new color palette locally. Long or high-resolution GIFs require more processing.",
      },
    ],
  },
  "compress-to-50kb": {
    slug: "compress-to-50kb",
    keyword: "compress image to 50kb",
    title: "Compress Image to 50KB Online - Private and Free",
    description: "Compress an image to 50KB or less locally in your browser. No upload, no signup, and support for JPG, PNG, WebP and GIF.",
    heading: "Compress an image to 50KB",
    lead: "Create a smaller image for strict forms and upload limits, entirely on your device.",
    targetKb: 50,
    faq: [
      ...sharedFaq,
      {
        question: "Can every image be compressed below 50KB?",
        answer: "Most images can, but detailed or animated files may need much smaller dimensions. Compress100 clearly reports when it cannot reach the limit.",
      },
      {
        question: "Does reducing an image to 50KB change its dimensions?",
        answer: "Only when quality reduction is not enough. Compress100 preserves dimensions first and scales down as a second step.",
      },
    ],
  },
  "compress-to-200kb": {
    slug: "compress-to-200kb",
    keyword: "compress image to 200kb",
    title: "Compress Image to 200KB Online - No Upload",
    description: "Compress JPG, PNG, WebP or GIF images to 200KB or less. Processing stays private in your browser and requires no signup.",
    heading: "Compress an image to 200KB",
    lead: "Reduce file size for applications, profiles and forms without uploading the original.",
    targetKb: 200,
    faq: [
      ...sharedFaq,
      {
        question: "What happens when my image is already below 200KB?",
        answer: "Compress100 keeps the original file unchanged so it does not lose quality unnecessarily.",
      },
      {
        question: "Can I compress several images to 200KB?",
        answer: "Yes. Add multiple images and Compress100 will process each one locally against the same 200KB limit.",
      },
    ],
  },
};

export function pagePath(page: ProductPage) {
  return page.slug ? `/${page.slug}` : "/";
}
