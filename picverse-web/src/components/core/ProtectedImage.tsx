"use client";

import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";

import { useElementSize } from "@app/lib/hooks";

interface ProtectedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ProtectedImage({ src, alt, width, height, className = "" }: ProtectedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useElementSize(containerRef);

  useEffect(() => {
    if (imageLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const img = new Image();

        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
          canvas.width = containerWidth || width;
          canvas.height = (containerWidth || width) * (height / width);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  }, [imageLoaded, src, width, height, containerWidth]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: imageLoaded ? "block" : "none" }} />
      <div className="absolute inset-0" style={{ display: imageLoaded ? "none" : "block" }}>
        <NextImage
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          onLoadingComplete={() => setImageLoaded(true)}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
