"use client";

type CompressImageOptions = {
  maxSize: number;
  quality?: number;
};

function getCompressedFileName(fileName: string) {
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "image"}.webp`;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Cannot read selected image."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Cannot compress selected image."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

export async function compressImageFile(file: File, options: CompressImageOptions) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selected file is not an image.");
  }

  const image = await loadImage(file);
  const scale = Math.min(1, options.maxSize / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Browser cannot prepare image compression.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, options.quality ?? 0.82);

  return new File([blob], getCompressedFileName(file.name), {
    lastModified: Date.now(),
    type: "image/webp",
  });
}
