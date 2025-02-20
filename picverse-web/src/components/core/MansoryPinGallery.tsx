"use client";

import { type FC, useEffect, useMemo, useRef, useState } from "react";

import { cn, getResourceUrl, skeletonPlaceholder } from "@app/lib/utils";
import PinDrawer from "./PinDrawer";
import Image from "next/image";

type MansoryPinGalleryProps = {
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

const distributePins = (pins: Pin[], columns: number): Pin[][] => {
  const distributed: Pin[][] = Array.from({ length: columns }, () => []);

  pins.forEach((pin, index) => {
    distributed[index % columns].push(pin);
  });

  return distributed;
};

const MansoryPinGallery: FC<MansoryPinGalleryProps> = ({ pins, loadMore, isFetching }) => {
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

  const distributed = useMemo(() => distributePins(pins, currentColumn), [pins, currentColumn]);

  return (
    <section className="flex justify-center w-full overflow-hidden relative">
      {distributed.map((innerArray, rowIndex) => (
        <div key={rowIndex} style={{ width: `${columnWidth}%` }}>
          {innerArray.map((_, columnIndex) => {
            const pin: Pin = innerArray[columnIndex];
            if (typeof pin.resource === "string") return <></>;

            return (
              <PinDrawer key={`pin:dtl:${pin._id}`} pinId={pin._id}>
                <div className="relative cursor-pointer p-1.5">
                  <Image
                    className="w-full rounded-2xl overflow-hidden"
                    src={getResourceUrl(pin.resource._id)}
                    alt={`Image ${rowIndex}-${columnIndex}`}
                    loading="lazy"
                    layout="responsive"
                    placeholder="blur"
                    blurDataURL={skeletonPlaceholder}
                    width={pin.resource.width}
                    height={pin.resource.height}
                  />
                </div>
              </PinDrawer>
            );
          })}

          {isFetching &&
            Array.from({ length: Math.ceil(10 / currentColumn) }).map((_, i) => (
              <SkeletonPin width="100%" key={`skeleton:pin:${rowIndex}-${i}`} />
            ))}
        </div>
      ))}

      {loadMore && <div ref={observerRef} className="h-10 absolute bottom-[30%]" />}
    </section>
  );
};

const SkeletonPin: FC<{ width: string }> = ({ width }) => {
  const randomMansoryHeight = [150, 250, 350, 400, 550];
  const height = randomMansoryHeight[Math.floor(Math.random() * randomMansoryHeight.length)];

  return (
    <div className="w-full overflow-hidden p-1.5">
      <div
        suppressHydrationWarning
        className={cn("bg-gray-200 rounded-3xl animate-pulse", `h-[${height}px] w-[${width}px]`)}
      />
    </div>
  );
};

export default MansoryPinGallery;
