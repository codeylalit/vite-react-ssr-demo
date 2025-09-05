import { useState, useEffect, useMemo, useCallback } from 'react';

export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  scrollingDelay?: number;
}

export interface VirtualScrollItem<T> {
  index: number;
  data: T;
  style: {
    position: 'absolute';
    top: number;
    left: number;
    right: number;
    height: number;
  };
}

export interface VirtualScrollResult<T> {
  items: VirtualScrollItem<T>[];
  totalHeight: number;
  scrollElementProps: {
    onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
  wrapperProps: {
    style: React.CSSProperties;
  };
  isScrolling: boolean;
}

export function useVirtualScroll<T>(
  data: T[],
  options: VirtualScrollOptions
): VirtualScrollResult<T> {
  const { itemHeight, containerHeight, overscan = 5, scrollingDelay = 150 } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Calculate visible range
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(data.length - 1, start + visibleItemsCount + overscan * 2);

    const items: VirtualScrollItem<T>[] = [];
    for (let index = start; index <= end; index++) {
      if (data[index] !== undefined) {
        items.push({
          index,
          data: data[index],
          style: {
            position: 'absolute',
            top: index * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          },
        });
      }
    }

    return {
      startIndex: start,
      endIndex: end,
      visibleItems: items,
    };
  }, [data, scrollTop, itemHeight, containerHeight, overscan]);

  // Handle scroll with debouncing for isScrolling state
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      setScrollTop(scrollTop);
      setIsScrolling(true);

      // Debounce scrolling state
      const timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, scrollingDelay);

      return () => clearTimeout(timeoutId);
    },
    [scrollingDelay]
  );

  // Stop scrolling when component unmounts
  useEffect(() => {
    return () => {
      setIsScrolling(false);
    };
  }, []);

  const totalHeight = data.length * itemHeight;

  return {
    items: visibleItems,
    totalHeight,
    scrollElementProps: {
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative' as const,
      },
    },
    wrapperProps: {
      style: {
        height: totalHeight,
        position: 'relative' as const,
      },
    },
    isScrolling,
  };
}

// Enhanced hook with dynamic item heights
export interface DynamicVirtualScrollOptions {
  estimatedItemHeight: number;
  containerHeight: number;
  overscan?: number;
  getItemHeight?: (index: number) => number;
}

export function useDynamicVirtualScroll<T>(
  data: T[],
  options: DynamicVirtualScrollOptions
): VirtualScrollResult<T> {
  const { estimatedItemHeight, containerHeight, overscan = 5, getItemHeight } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [measuredHeights, setMeasuredHeights] = useState<Map<number, number>>(new Map());

  // Calculate item positions
  const itemPositions = useMemo(() => {
    const positions = new Array(data.length);
    let totalHeight = 0;

    for (let i = 0; i < data.length; i++) {
      const height = getItemHeight
        ? getItemHeight(i)
        : measuredHeights.get(i) || estimatedItemHeight;

      positions[i] = {
        top: totalHeight,
        height,
      };
      totalHeight += height;
    }

    return { positions, totalHeight };
  }, [data.length, estimatedItemHeight, getItemHeight, measuredHeights]);

  // Find visible range using binary search
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const { positions } = itemPositions;

    // Binary search for start index
    let start = 0;
    let end = positions.length - 1;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const position = positions[mid];

      if (position.top + position.height < scrollTop) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    const startIdx = Math.max(0, start - overscan);

    // Find end index
    let endIdx = startIdx;
    let accumulatedHeight = 0;

    while (endIdx < positions.length && accumulatedHeight < containerHeight + scrollTop) {
      accumulatedHeight = positions[endIdx].top + positions[endIdx].height;
      endIdx++;
    }

    endIdx = Math.min(data.length - 1, endIdx + overscan);

    const items: VirtualScrollItem<T>[] = [];
    for (let index = startIdx; index <= endIdx; index++) {
      if (data[index] !== undefined && positions[index]) {
        items.push({
          index,
          data: data[index],
          style: {
            position: 'absolute',
            top: positions[index].top,
            left: 0,
            right: 0,
            height: positions[index].height,
          },
        });
      }
    }

    return {
      startIndex: startIdx,
      endIndex: endIdx,
      visibleItems: items,
    };
  }, [data, scrollTop, containerHeight, overscan, itemPositions]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    setIsScrolling(true);

    const timeoutId = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, []);

  // Method to update measured height for an item
  const updateItemHeight = useCallback((index: number, height: number) => {
    setMeasuredHeights(prev => {
      const newMap = new Map(prev);
      newMap.set(index, height);
      return newMap;
    });
  }, []);

  return {
    items: visibleItems,
    totalHeight: itemPositions.totalHeight,
    scrollElementProps: {
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
        position: 'relative' as const,
      },
    },
    wrapperProps: {
      style: {
        height: itemPositions.totalHeight,
        position: 'relative' as const,
      },
    },
    isScrolling,
  };
}
