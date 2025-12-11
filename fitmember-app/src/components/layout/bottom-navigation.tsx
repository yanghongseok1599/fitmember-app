'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Building2, Dumbbell, Users, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/about', icon: Building2, label: '회사소개' },
  { href: '/workout', icon: Dumbbell, label: '운동' },
  { href: '/community', icon: Users, label: '커뮤니티' },
  { href: '/store', icon: ShoppingBag, label: '스토어' },
  { href: '/mypage', icon: User, label: '마이' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-bottom">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2 sm:py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 transition-opacity hover:opacity-60 min-w-0"
              >
                <Icon className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 stroke-[1.5] flex-shrink-0",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "nav-label truncate",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
