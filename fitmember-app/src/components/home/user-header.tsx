'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Menu, X, User as UserIcon, Settings, HelpCircle, LogOut, FileText, Trophy } from 'lucide-react';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface UserHeaderProps {
  user: User;
  hasNotifications?: boolean;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function UserHeader({
  user,
  hasNotifications = false,
  onNotificationClick,
  onProfileClick
}: UserHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: UserIcon, label: '내 정보', href: '/mypage/profile' },
    { icon: Trophy, label: '명예의 전당', href: '/ranking' },
    { icon: FileText, label: '공지사항', href: '/notices' },
    { icon: Settings, label: '설정', href: '/mypage/settings' },
    { icon: HelpCircle, label: '고객센터', href: '/mypage/help' },
  ];

  return (
    <>
      <div className="flex items-center justify-between py-6 border-b border-border">
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-light tracking-wide">ITN FITNESS</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={onNotificationClick}
            className={cn(
              "relative p-1 transition-colors",
              "hover:opacity-60"
            )}
          >
            <Bell className="h-5 w-5 stroke-[1.5]" />
            {hasNotifications && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-1 hover:opacity-60 transition-opacity"
          >
            <Menu className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <item.icon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={() => {
              // 로그아웃 처리
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </>
  );
}
