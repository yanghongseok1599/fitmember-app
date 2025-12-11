'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  User,
  Settings,
  Package,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { authStore } from '@/lib/auth-store';
import { UserProfile } from '@/types';

interface NavLink {
  href: string;
  label: string;
}

const publicNavLinks: NavLink[] = [
  { href: '/', label: '홈' },
  { href: '/about', label: '회사소개' },
  { href: '/products', label: '상품' },
];

const loggedInNavLinks: NavLink[] = [
  { href: '/', label: '홈' },
  { href: '/about', label: '회사소개' },
  { href: '/products', label: '상품' },
  { href: '/mypage', label: '마이페이지' },
];

export function HeaderNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setIsLoggedIn(authStore.isLoggedIn());
    setUser(authStore.getUser());

    const unsubscribe = authStore.subscribe(() => {
      setIsLoggedIn(authStore.isLoggedIn());
      setUser(authStore.getUser());
    });

    return () => unsubscribe();
  }, []);

  const navLinks = isLoggedIn ? loggedInNavLinks : publicNavLinks;

  const handleLogout = () => {
    authStore.logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <Link href="/" className="font-semibold text-base sm:text-lg text-primary">
            FitMember
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-primary font-medium'
                    : 'text-gray-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {isLoggedIn && user ? (
              /* Logged In - User Dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {user.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      )}
                    </div>
                    <span className="hidden sm:inline text-xs sm:text-sm font-medium text-gray-700 max-w-[80px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/mypage/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      내 정보
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mypage/orders" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      주문내역
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mypage/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      설정
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Not Logged In - Login/Register Buttons */
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/login')}
                  className="text-gray-600 text-xs sm:text-sm px-2 sm:px-3"
                >
                  로그인
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/register')}
                  className="bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm px-2 sm:px-3"
                >
                  회원가입
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm transition-colors',
                    pathname === link.href
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link
                    href="/mypage/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    내 정보
                  </Link>
                  <Link
                    href="/mypage/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    주문내역
                  </Link>
                  <Link
                    href="/mypage/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    설정
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
