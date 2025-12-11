import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요한 경로들
const protectedPaths = [
  '/mypage',
  '/points',
  '/workout',
  '/inbody',
];

// 인증된 사용자가 접근하면 안 되는 경로들 (로그인/회원가입 페이지)
const authPaths = [
  '/login',
  '/register',
];

// 공개 경로 (인증 불필요)
const publicPaths = [
  '/',
  '/about',
  '/notices',
  '/ranking',
  '/select-center',
  '/welcome',
  '/store',
  '/qna',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 경로는 미들웨어 제외
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 정적 파일 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // 파일 확장자가 있는 경우
  ) {
    return NextResponse.next();
  }

  // Note: 클라이언트 사이드 인증은 AuthGuard 컴포넌트에서 처리
  // 서버 사이드에서는 쿠키/세션 기반 인증 체크가 필요한 경우 여기서 처리

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
