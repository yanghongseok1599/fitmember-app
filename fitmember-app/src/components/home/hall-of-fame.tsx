'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HallOfFameEntry, HallOfFameCategory } from '@/types';
import { cn } from '@/lib/utils';

interface HallOfFameProps {
  categories: HallOfFameCategory[];
  entries: HallOfFameEntry[];
  onViewAll?: () => void;
}

export function HallOfFame({ categories, entries }: HallOfFameProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id);

  const filteredEntries = entries
    .filter(entry => entry.category === selectedCategory)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3);

  const handleViewAll = () => {
    router.push(`/ranking?category=${selectedCategory}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="watermark-text">Hall of Fame</p>
        <h2 className="text-lg font-light">명예의 전당</h2>
      </div>

      {/* Category tabs - horizontal scroll */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "flex-shrink-0 px-4 py-2 text-sm rounded-full transition-all whitespace-nowrap",
              selectedCategory === category.id
                ? "bg-foreground text-background"
                : "bg-[#F7F5F2] text-muted-foreground hover:bg-[#F0EDE8]"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Rankings */}
      <div className="space-y-2">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 p-3 bg-[#F7F5F2] rounded-lg"
          >
            <span className="text-sm text-muted-foreground w-6 text-center font-medium">
              {String(entry.rank).padStart(2, '0')}
            </span>
            <Avatar className="h-9 w-9">
              <AvatarImage src={entry.userImage} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                {entry.userName.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{entry.userName}</p>
            </div>
            <span className="text-sm text-primary font-medium">
              {entry.value}{entry.unit}
            </span>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        onClick={handleViewAll}
        className="w-full flex items-center justify-center gap-1 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:bg-muted/50"
      >
        전체보기
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
