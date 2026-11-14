"use client";

const IK = "https://ik.imagekit.io/gduf8ygq0/";

/**
 * next/image loader.
 * - ImageKit URLs (the store's product CDN) get on-the-fly resizing; `f-auto`
 *   lets ImageKit pick AVIF/WebP per browser.
 * - Local files in /public are already web-optimised WebP/JPEG and are served
 *   as-is (the width param keeps next/image's srcset contract).
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith(IK)) {
    return `${src}?tr=w-${width},q-${quality || 75},f-auto`;
  }
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
