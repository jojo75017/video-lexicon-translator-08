import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LifetimeBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSparkles?: boolean;
}

const LifetimeBadge: React.FC<LifetimeBadgeProps> = ({ 
  className, 
  size = 'md',
  showSparkles = true 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center font-semibold rounded-full',
        'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400',
        'bg-[length:200%_100%] animate-gradient-x',
        'text-amber-900 shadow-lg',
        'border border-amber-300/50',
        sizeClasses[size],
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/40 via-yellow-300/40 to-amber-400/40 blur-md -z-10" />
      
      {/* Crown icon with bounce animation */}
      <Crown className={cn(iconSizes[size], 'animate-crown-bounce text-amber-700')} />
      
      <span className="relative">
        Accès à vie
      </span>
      
      {/* Sparkle decorations */}
      {showSparkles && (
        <>
          <Sparkles className={cn(iconSizes[size], 'animate-sparkle text-amber-600')} />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-sparkle opacity-80" />
          <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-sparkle delay-300" />
        </>
      )}
    </div>
  );
};

export default LifetimeBadge;
