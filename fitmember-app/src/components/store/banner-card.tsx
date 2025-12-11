'use client';

import { ExternalLink } from 'lucide-react';
import { StoreBanner } from '@/types';
import { cn } from '@/lib/utils';

interface BannerCardProps {
  banner: StoreBanner;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const categoryColors: Record<StoreBanner['category'], string> = {
  special: 'bg-red-500',
  correction: 'bg-purple-500',
  exercise: 'bg-blue-500',
  health: 'bg-green-500',
  food: 'bg-orange-500',
};

const categoryLabels: Record<StoreBanner['category'], string> = {
  special: '특가',
  correction: '교정용품',
  exercise: '운동용품',
  health: '건강용품',
  food: '건강식품',
};

export function BannerCard({ banner, size = 'medium', className }: BannerCardProps) {
  const handleClick = () => {
    window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    small: 'h-32',
    medium: 'h-48',
    large: 'h-64',
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative w-full overflow-hidden rounded-lg group cursor-pointer',
        'border border-border hover:border-primary/50 transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-primary/50',
        sizeClasses[size],
        className
      )}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        {banner.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url(${banner.imageUrl})`,
            }}
          />
        ) : (
          <div className={cn('absolute inset-0', categoryColors[banner.category])} />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3">
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium text-white rounded-full',
            categoryColors[banner.category]
          )}
        >
          {categoryLabels[banner.category]}
        </span>
      </div>

      {/* External Link Icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ExternalLink className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
          {banner.title}
        </h3>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
