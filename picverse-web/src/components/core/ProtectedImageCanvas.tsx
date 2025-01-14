"use client";

import React, { FC, useEffect, useRef, useState } from "react";

type ProtectedImageCanvasProps = {
  src: string;
  alt: string;
  className?: string;
};

const ProtectedImageCanvas: FC<ProtectedImageCanvasProps> = ({ src, alt, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      setAspectRatio(img.width / img.height);
      setIsLoaded(true);
    };
  }, [src]);

  useEffect(() => {
    if (!isLoaded) return;

    const drawImage = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientWidth / aspectRatio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    };

    drawImage();
    window.addEventListener("resize", drawImage);

    return () => {
      window.removeEventListener("resize", drawImage);
    };
  }, [src, aspectRatio, isLoaded]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        onContextMenu={handleContextMenu}
        aria-label={alt}
      />
    </div>
  );
};

export default ProtectedImageCanvas;
