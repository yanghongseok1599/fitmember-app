'use client';

import { usePathname } from 'next/navigation';
import { BottomNavigation } from './bottom-navigation';

// 하단 네비게이션을 숨길 페이지 경로들
const HIDDEN_PATHS = [
  '/login',
  '/register',
  '/welcome',
  '/select-center',
  '/admin',
  '/staff',
  '/qna', // 채팅 인터페이스 - 하단 입력창과 겹침 방지
];

export function GlobalBottomNavigation() {
  const pathname = usePathname();

  // 숨길 경로인지 확인
  const shouldHide = HIDDEN_PATHS.some(path => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <BottomNavigation />;
}
