import React, { forwardRef, useMemo } from 'react';
import { useVirtualScroll, VirtualScrollOptions } from '@/hooks/useVirtualScroll';
import { cn } from '@/lib/utils';

// Table column definition
export interface TableColumn<T> {
  key: string;
  header: string;
  width?: number | string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

// Virtual table props
export interface VirtualTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  height: number;
  itemHeight?: number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  onRowClick?: (item: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  overscan?: number;
}

// Loading skeleton row
const SkeletonRow: React.FC<{ columns: TableColumn<unknown>[]; height: number }> = ({
  columns,
  height,
}) => (
  <div className="flex border-b animate-pulse" style={{ height }}>
    {columns.map((column, index) => (
      <div
        key={index}
        className="flex-1 px-4 py-2 flex items-center"
        style={{ width: column.width }}
      >
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    ))}
  </div>
);

// Table row component
interface TableRowProps<T> {
  item: T;
  index: number;
  columns: TableColumn<T>[];
  style: React.CSSProperties;
  className?: string;
  onClick?: (item: T, index: number) => void;
}

const TableRow = <T,>({ item, index, columns, style, className, onClick }: TableRowProps<T>) => (
  <div
    className={cn(
      'flex border-b hover:bg-muted/50 transition-colors',
      onClick && 'cursor-pointer',
      className
    )}
    style={style}
    onClick={() => onClick?.(item, index)}
  >
    {columns.map(column => (
      <div
        key={column.key}
        className={cn(
          'flex-1 px-4 py-2 flex items-center text-sm',
          column.align === 'center' && 'justify-center',
          column.align === 'right' && 'justify-end'
        )}
        style={{ width: column.width }}
      >
        {column.render ? column.render(item, index) : String((item as Record<string, unknown>)[column.key] || '')}
      </div>
    ))}
  </div>
);

// Main VirtualTable component
export const VirtualTable = <T,>({
  data,
  columns,
  height,
  itemHeight = 52,
  className,
  headerClassName,
  rowClassName,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  overscan = 5,
  ...props
}: VirtualTableProps<T>) => {
  const virtualScrollOptions: VirtualScrollOptions = useMemo(
    () => ({
      itemHeight,
      containerHeight: height - 60, // Account for header height
      overscan,
    }),
    [itemHeight, height, overscan]
  );

  const { items, totalHeight, scrollElementProps, wrapperProps, isScrolling } = useVirtualScroll(
    data,
    virtualScrollOptions
  );

  // Calculate column widths
  const totalFixedWidth = columns.reduce((sum, col) => {
    return sum + (typeof col.width === 'number' ? col.width : 0);
  }, 0);

  if (loading) {
    return (
      <div className={cn('border rounded-lg overflow-hidden', className)}>
        {/* Header */}
        <div className={cn('flex bg-muted/50 border-b font-medium', headerClassName)}>
          {columns.map(column => (
            <div
              key={column.key}
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right'
              )}
              style={{ width: column.width }}
            >
              {column.header}
            </div>
          ))}
        </div>

        {/* Loading skeleton */}
        <div style={{ height: height - 60, overflow: 'hidden' }}>
          {Array.from({ length: Math.ceil((height - 60) / itemHeight) }).map((_, index) => (
            <SkeletonRow key={index} columns={columns} height={itemHeight} />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('border rounded-lg overflow-hidden', className)}>
        {/* Header */}
        <div className={cn('flex bg-muted/50 border-b font-medium', headerClassName)}>
          {columns.map(column => (
            <div
              key={column.key}
              className={cn(
                'flex-1 px-4 py-3 text-sm font-medium',
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right'
              )}
              style={{ width: column.width }}
            >
              {column.header}
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div
          className="flex items-center justify-center text-muted-foreground"
          style={{ height: height - 60 }}
        >
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)} {...props}>
      {/* Header */}
      <div
        className={cn('flex bg-muted/50 border-b font-medium sticky top-0 z-10', headerClassName)}
      >
        {columns.map(column => (
          <div
            key={column.key}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right'
            )}
            style={{ width: column.width }}
          >
            {column.header}
          </div>
        ))}
      </div>

      {/* Virtual scrolling container */}
      <div {...scrollElementProps}>
        <div {...wrapperProps}>
          {items.map(({ index, data: item, style }) => (
            <TableRow
              key={index}
              item={item}
              index={index}
              columns={columns}
              style={style}
              className={
                typeof rowClassName === 'function' ? rowClassName(item, index) : rowClassName
              }
              onClick={onRowClick}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      {isScrolling && (
        <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
          Scrolling...
        </div>
      )}
    </div>
  );
};

// Export individual components for custom use
export { TableRow, SkeletonRow };
