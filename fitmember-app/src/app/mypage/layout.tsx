'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { AuthGuard } from '@/components/auth/auth-guard';
import {
  User,
  Coins,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLink {
  href: string;
  icon: React.ElementType;
  label: string;
}

const sidebarLinks: SidebarLink[] = [
  { href: '/mypage/profile', icon: User, label: '내 정보 관리' },
  { href: '/points', icon: Coins, label: '포인트 내역' },
  { href: '/mypage/settings', icon: Settings, label: '설정' },
  { href: '/mypage/help', icon: HelpCircle, label: '고객센터' },
];

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthGuard redirectTo="/login">
      <AppLayout>
      {/* Mobile Tab Navigation */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-b border-border bg-white -mx-4 px-4">
        <div className="flex gap-1 py-2">
          {sidebarLinks.slice(0, 5).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-xs whitespace-nowrap rounded-full transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex gap-8 lg:gap-16 py-6">
        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* Desktop Sidebar - Right Side */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <nav className="bg-white border border-border rounded-lg overflow-hidden">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 text-sm border-b border-border last:border-b-0 transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </AppLayout>
    </AuthGuard>
  );
}
