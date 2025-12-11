'use client';

import { StoreBanner } from '@/types';
import { BannerCard } from './banner-card';
import { cn } from '@/lib/utils';

interface BannerGridProps {
  banners: StoreBanner[];
  columns?: 1 | 2;
  className?: string;
}

export function BannerGrid({ banners, columns = 2, className }: BannerGridProps) {
  if (banners.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">등록된 배너가 없습니다</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2',
        className
      )}
    >
      {banners.map((banner, index) => (
        <BannerCard
          key={banner.id}
          banner={banner}
          size={columns === 1 || index === 0 ? 'large' : 'medium'}
        />
      ))}
    </div>
  );
}
