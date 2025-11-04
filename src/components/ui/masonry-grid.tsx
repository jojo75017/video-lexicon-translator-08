import React from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: string;
  className?: string;
}

export function MasonryGrid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3 },
  gap = "gap-6",
  className 
}: MasonryGridProps) {
  const columnClasses = `
    grid-cols-${columns.sm || 1}
    md:grid-cols-${columns.md || 2}
    lg:grid-cols-${columns.lg || 3}
  `;

  return (
    <div className={cn(
      "grid",
      columnClasses,
      gap,
      className
    )}>
      {children}
    </div>
  );
}
