import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export function FlipCard({ front, back, className }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={cn("relative w-full h-full perspective-1000", className)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Face avant */}
        <div className="absolute inset-0 backface-hidden">
          {front}
        </div>
        
        {/* Face arrière */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {back}
        </div>
      </div>
    </div>
  );
}
