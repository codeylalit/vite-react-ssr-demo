import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useVirtualScroll, VirtualScrollOptions } from '@/hooks/useVirtualScroll';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/shared/components/ui/skeleton';

// Virtual list props
export interface VirtualListProps<T> {
  data: T[];
  height: number;
  itemHeight?: number;
  className?: string;
  itemClassName?: string | ((item: T, index: number) => string);
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  overscan?: number;
  // Infinite scroll props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  loadMoreThreshold?: number;
}

// Loading item component
const LoadingItem: React.FC<{ height: number; className?: string }> = ({ height, className }) => (
  <div className={cn('flex items-center px-4 py-2', className)} style={{ height }}>
    <div className="flex items-center space-x-3 w-full">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

// List item wrapper component
interface ListItemProps<T> {
  item: T;
  index: number;
  style: React.CSSProperties;
  className?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onClick?: (item: T, index: number) => void;
}

const ListItem = <T,>({ item, index, style, className, renderItem, onClick }: ListItemProps<T>) => (
  <div
    className={cn(
      'border-b transition-colors',
      onClick && 'cursor-pointer hover:bg-muted/50',
      className
    )}
    style={style}
    onClick={() => onClick?.(item, index)}
  >
    {renderItem(item, index)}
  </div>
);

// Load more trigger component
const LoadMoreTrigger: React.FC<{
  isVisible: boolean;
  onLoadMore: () => void;
  threshold: number;
}> = ({ isVisible, onLoadMore, threshold }) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin: '100px',
      }
    );

    observer.observe(triggerRef.current);

    return () => observer.disconnect();
  }, [isVisible, onLoadMore, threshold]);

  if (!isVisible) return null;

  return <div ref={triggerRef} className="h-1" />;
};

// Main VirtualList component
export const VirtualList = <T,>({
  data,
  height,
  itemHeight = 60,
  className,
  itemClassName,
  renderItem,
  onItemClick,
  loading = false,
  emptyMessage = 'No items found',
  overscan = 5,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  loadMoreThreshold = 0.8,
  ...props
}: VirtualListProps<T>) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  const virtualScrollOptions: VirtualScrollOptions = useMemo(
    () => ({
      itemHeight,
      containerHeight: height,
      overscan,
    }),
    [itemHeight, height, overscan]
  );

  const { items, totalHeight, scrollElementProps, wrapperProps, isScrolling } = useVirtualScroll(
    data,
    virtualScrollOptions
  );

  // Enhanced scroll handler for infinite scroll
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      scrollElementProps.onScroll(event);

      const target = event.currentTarget;
      const scrollOffset = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      setScrollOffset(scrollOffset);

      // Trigger load more when near bottom
      if (
        hasNextPage &&
        !isFetchingNextPage &&
        onLoadMore &&
        (scrollOffset + clientHeight) / scrollHeight >= loadMoreThreshold
      ) {
        onLoadMore();
      }
    },
    [scrollElementProps.onScroll, hasNextPage, isFetchingNextPage, onLoadMore, loadMoreThreshold]
  );

  // Loading state
  if (loading && data.length === 0) {
    return (
      <div className={cn('border rounded-lg overflow-hidden', className)}>
        <div style={{ height, overflow: 'hidden' }}>
          {Array.from({ length: Math.ceil(height / itemHeight) }).map((_, index) => (
            <LoadingItem
              key={index}
              height={itemHeight}
              className={
                typeof itemClassName === 'function' ? itemClassName({} as T, index) : itemClassName
              }
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={cn('border rounded-lg overflow-hidden', className)}>
        <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden relative', className)} {...props}>
      {/* Virtual scrolling container */}
      <div
        {...scrollElementProps}
        style={{
          ...scrollElementProps.style,
          height,
        }}
        onScroll={handleScroll}
      >
        <div {...wrapperProps}>
          {items.map(({ index, data: item, style }) => (
            <ListItem
              key={index}
              item={item}
              index={index}
              style={style}
              className={
                typeof itemClassName === 'function' ? itemClassName(item, index) : itemClassName
              }
              renderItem={renderItem}
              onClick={onItemClick}
            />
          ))}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="py-4 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Loading more...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Infinite scroll trigger */}
      <LoadMoreTrigger
        isVisible={hasNextPage && !isFetchingNextPage && !!onLoadMore}
        onLoadMore={onLoadMore!}
        threshold={0.1}
      />

      {/* Scroll indicator */}
      {isScrolling && (
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground z-10">
          Scrolling...
        </div>
      )}

      {/* Scroll progress indicator */}
      {data.length > 10 && (
        <div className="absolute right-1 top-0 bottom-0 w-1 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="bg-primary rounded-full transition-all duration-150"
            style={{
              height: `${Math.min(100, (scrollOffset / (totalHeight - height)) * 100)}%`,
              width: '100%',
            }}
          />
        </div>
      )}
    </div>
  );
};

// Export utilities
export { LoadingItem, ListItem, LoadMoreTrigger };
