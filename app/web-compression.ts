import { applyPalette, GIFEncoder, quantize } from "gifenc";

export type CompressionOutput = {
  blob: Blob;
  width: number;
  height: number;
  reachedTarget: boolean;
};

type GifFrame = { image: CanvasImageSource & { close: () => void; duration?: number | null } };

type GifDecoder = {
  tracks: { ready: Promise<void>; selectedTrack?: { frameCount?: number } | null };
  decode: (options: { frameIndex: number }) => Promise<GifFrame>;
  close: () => void;
};

type GifDecoderConstructor = new (options: { data: ArrayBuffer; type: string }) => GifDecoder;

async function imageDimensions(file: File) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("This browser could not encode the image.")), type, quality);
  });
}

async function encodeStatic(file: File, width: number, height: number, quality: number) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("This browser could not create an image canvas.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  if (file.type === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const supportedType = ["image/jpeg", "image/png", "image/webp"].includes(file.type) ? file.type : "image/png";
  return canvasToBlob(canvas, supportedType, quality / 100);
}

async function encodeGif(file: File, width: number, height: number, quality: number) {
  const Decoder = (window as typeof window & { ImageDecoder?: GifDecoderConstructor }).ImageDecoder;
  if (!Decoder) throw new Error("Animated GIF compression requires a recent version of Chrome or Edge.");
  const decoder = new Decoder({ data: await file.arrayBuffer(), type: "image/gif" });
  await decoder.tracks.ready;
  const frameCount = decoder.tracks.selectedTrack?.frameCount || 1;
  const encoder = GIFEncoder();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
  if (!context) throw new Error("This browser could not create a GIF canvas.");
  const colors = Math.max(2, Math.min(256, Math.round(16 + 240 * (quality / 100) ** 1.6)));

  try {
    for (let index = 0; index < frameCount; index += 1) {
      const { image } = await decoder.decode({ frameIndex: index });
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      const rgba = context.getImageData(0, 0, width, height).data;
      const palette = quantize(rgba, colors, { format: "rgba4444", oneBitAlpha: true });
      const indexed = applyPalette(rgba, palette, "rgba4444");
      const transparentIndex = palette.findIndex((color) => color[3] === 0);
      encoder.writeFrame(indexed, width, height, {
        palette,
        delay: Math.max(20, Math.round((((image as unknown as { duration?: number }).duration || 100_000) / 1000))),
        repeat: 0,
        transparent: transparentIndex >= 0,
        transparentIndex: Math.max(0, transparentIndex),
      });
      image.close();
    }
    encoder.finish();
    return new Blob([new Uint8Array(encoder.bytes())], { type: "image/gif" });
  } finally {
    decoder.close();
  }
}

export async function compressToLimit(file: File, targetKb: number): Promise<CompressionOutput> {
  const targetBytes = Math.max(1_000, Math.floor(targetKb * 1_000 * 0.98));
  const original = await imageDimensions(file);
  if (file.size <= targetBytes) {
    return { blob: file, ...original, reachedTarget: true };
  }

  let quality = 86;
  let scale = 1;
  let smallest: { blob: Blob; width: number; height: number } | null = null;

  for (let pass = 0; pass < 12; pass += 1) {
    const width = Math.max(1, Math.round(original.width * scale));
    const height = Math.max(1, Math.round(original.height * scale));
    const blob = file.type === "image/gif"
      ? await encodeGif(file, width, height, quality)
      : await encodeStatic(file, width, height, quality);
    if (!smallest || blob.size < smallest.blob.size) smallest = { blob, width, height };
    if (blob.size <= targetBytes) return { blob, width, height, reachedTarget: true };

    const ratio = targetBytes / Math.max(1, blob.size);
    if (pass < 4 && quality > 34 && file.type !== "image/png") {
      quality = Math.max(34, Math.floor(quality * Math.max(0.55, Math.min(0.84, ratio * 1.12))));
    } else if (pass < 3 && file.type === "image/png") {
      scale *= Math.max(0.5, Math.min(0.85, Math.sqrt(ratio) * 0.95));
    } else {
      scale *= Math.max(0.4, Math.min(0.84, Math.sqrt(ratio) * 0.94));
      quality = Math.min(68, Math.max(42, quality + 8));
    }
  }

  if (!smallest) throw new Error("No compressed result was generated.");
  return { ...smallest, reachedTarget: smallest.blob.size <= targetBytes };
}

export async function resizeImage(file: File, width: number, height: number): Promise<CompressionOutput> {
  const blob = file.type === "image/gif" ? await encodeGif(file, width, height, 90) : await encodeStatic(file, width, height, 90);
  return { blob, width, height, reachedTarget: true };
}

export function formatBytes(bytes: number) {
  if (bytes < 1_000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(bytes >= 100_000 ? 0 : 1)} KB`;
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}
