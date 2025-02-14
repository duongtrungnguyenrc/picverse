"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { chunk } from "@app/lib/utils";

type MansoryPinListingProps = {
  pins: Array<Pin>;
  loadMore?: () => void;
  isFetching: boolean;
};

const column = {
  xs: 2,
  sm: 2,
  md: 4,
  lg: 5,
  xl: 7,
  xxl: 8,
};

const randomMansoryHeight = [150, 250, 350, 400, 550];

const MansoryPinListing: FC<MansoryPinListingProps> = ({ pins, loadMore, isFetching }) => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [currentColumn, setCurrentColumn] = useState<number>(4);
  const [columnWidth, setColumnWidth] = useState<number>(0);

  useEffect(() => {
    if (!loadMore || !observerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          loadMore();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loadMore, isFetching]);

  const handleColumns = () => {
    const windowWidth = window.innerWidth;
    let currentBreakpointColumns: number;
    let currentBreakpointColumnWidth: number;

    switch (true) {
      case windowWidth < 640:
        currentBreakpointColumns = column.xs;
        currentBreakpointColumnWidth = 50;
        break;
      case windowWidth < 768:
        currentBreakpointColumns = column.sm;
        currentBreakpointColumnWidth = 50;
        break;
      case windowWidth < 1024:
        currentBreakpointColumns = column.md;
        currentBreakpointColumnWidth = 40;
        break;
      case windowWidth < 1280:
        currentBreakpointColumns = column.lg;
        currentBreakpointColumnWidth = 30;
        break;
      case windowWidth < 1536:
        currentBreakpointColumns = column.xl;
        currentBreakpointColumnWidth = 25;
        break;
      case windowWidth > 1536:
        currentBreakpointColumns = column.xxl;
        currentBreakpointColumnWidth = 25;
        break;
      default:
        currentBreakpointColumns = column.md;
        currentBreakpointColumnWidth = 40;
        break;
    }

    setCurrentColumn(currentBreakpointColumns);
    setColumnWidth(currentBreakpointColumnWidth);
  };

  useEffect(() => {
    handleColumns();

    window.addEventListener("resize", handleColumns);

    return () => window.removeEventListener("resize", handleColumns);
  }, []);

  const data = pins.map((pin) => ({
    src: `${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api/cloud/file/${pin.resource}`,
  }));

  const chunkSize = Math.ceil(data.length / currentColumn);
  const distributed = chunk(data, chunkSize);

  return (
    <div className="flex justify-center w-full overflow-hidden relative">
      {distributed.map((innerArray, rowIndex) => (
        <div key={rowIndex} style={{ width: `${columnWidth}%` }}>
          {innerArray.map((imageObj, columnIndex) => (
            <div key={columnIndex} className="relative">
              <img
                className="w-full p-1.5 rounded-3xl overflow-hidden"
                src={imageObj?.src || "/placeholder.svg"}
                alt={`Image ${rowIndex}-${columnIndex}`}
                loading="lazy"
              />
            </div>
          ))}

          {isFetching &&
            Array.from({ length: Math.ceil(10 / currentColumn) }).map((_, i) => (
              <SkeletonPin width="100%" key={`skeleton:pin:${rowIndex}-${i}`} />
            ))}
        </div>
      ))}

      {loadMore && <div ref={observerRef} className="h-10 absolute bottom-[30%]" />}
    </div>
  );
};

const SkeletonPin: FC<{ width: string }> = ({ width }) => {
  const height = randomMansoryHeight[Math.floor(Math.random() * randomMansoryHeight.length)];

  return (
    <div
      className="w-full p-1.5 rounded-3xl overflow-hidden bg-gray-200 animate-pulse"
      style={{ height: `${height}px`, width }}
    />
  );
};

export default MansoryPinListing;
