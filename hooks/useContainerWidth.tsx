import { useEffect, useRef, useState } from 'react';

export const useContainerWidth = (enabled: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const element = containerRef.current;
    setWidth(element.offsetWidth);

    const resizeObserver = new ResizeObserver(([entry]) => {
      setWidth(entry?.contentRect.width ?? 0);
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [enabled]);

  return { containerRef, width };
};
