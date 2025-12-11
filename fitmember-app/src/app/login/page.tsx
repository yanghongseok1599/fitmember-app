'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'kakao' | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = authStore.loginWithEmail(email, password);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || '로그인에 실패했습니다.');
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    setError('');

    try {
      // NextAuth를 통한 구글 로그인
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      setError('구글 로그인에 실패했습니다.');
      setSocialLoading(null);
    }
  };

  const handleKakaoLogin = async () => {
    setSocialLoading('kakao');
    setError('');

    const result = await authStore.loginWithKakao();

    if (result.success) {
      if (result.needsRegistration) {
        router.push('/register/complete');
      } else {
        router.push('/');
      }
    } else {
      setError(result.error || '카카오 로그인에 실패했습니다.');
    }

    setSocialLoading(null);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link href="/" className="text-lg font-semibold text-primary">
          FitMember
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">로그인</h1>
            <p className="text-sm text-gray-500">
              FitMember에 오신 것을 환영합니다
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={socialLoading !== null || isLoading}
              className="w-full h-12 relative bg-white hover:bg-gray-50"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google로 계속하기
                </>
              )}
            </Button>

            {/* Kakao Login */}
            <Button
              type="button"
              onClick={handleKakaoLogin}
              disabled={socialLoading !== null || isLoading}
              className="w-full h-12 relative bg-[#FEE500] hover:bg-[#FDD800] text-[#191919]"
            >
              {socialLoading === 'kakao' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#191919"
                      d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.15.53-.54 1.9-.62 2.2-.1.37.14.37.29.27.12-.08 1.88-1.28 2.64-1.8.63.09 1.29.14 1.98.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z"
                    />
                  </svg>
                  카카오로 계속하기
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-muted text-gray-500">또는</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="pl-10 h-12"
                  disabled={isLoading || socialLoading !== null}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="pl-10 pr-10 h-12"
                  disabled={isLoading || socialLoading !== null}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || socialLoading !== null}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                '로그인'
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              비밀번호를 잊으셨나요?
            </Link>

            <div className="text-sm text-gray-500">
              아직 회원이 아니신가요?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                회원가입
              </Link>
            </div>
          </div>

          {/* Demo Account Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-500 text-center mb-2">테스트 계정</p>
            <p className="text-xs text-gray-600 text-center">
              이메일: minsu@example.com
              <br />
              비밀번호: password123
            </p>
          </div>

          {/* Admin Button */}
          <div className="mt-4">
            <Link href="/admin">
              <Button
                variant="ghost"
                className="w-full h-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Shield className="h-4 w-4 mr-2" />
                관리자 페이지
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
