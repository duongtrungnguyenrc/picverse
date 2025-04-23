"use client";

import { useState, useEffect, useCallback } from "react";

export function useElementSize(elementRef: React.RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const updateSize = useCallback(() => {
    const node = elementRef.current;
    if (node) {
      setSize({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }
  }, [elementRef]);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  return size;
}
