'use client';

import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNavigation?: boolean;
}

// 전역 하단 네비게이션이 AppProvider에서 렌더링되므로
// AppLayout에서는 padding만 적용
export function AppLayout({ children, className, hideNavigation = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-muted">
      <main className={cn(
        "max-w-7xl mx-auto px-4 safe-top",
        !hideNavigation && "pb-24",
        className
      )}>
        {children}
      </main>
    </div>
  );
}
