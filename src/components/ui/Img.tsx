"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";

/** next/image with a soft fade-in once loaded (prevents harsh pop-in). */
export function Img({ className, onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      className={cn("transition-[opacity,transform,filter] duration-700 ease-[var(--ease-out-expo)]", loaded ? "opacity-100" : "opacity-0", className)}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
