'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, AtSign, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { authStore } from '@/lib/auth-store';

export default function CompleteRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
  });
  const [errors, setErrors] = useState<{ name?: string; nickname?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<'google' | 'kakao' | null>(null);

  useEffect(() => {
    // Check if there's pending social registration
    const pendingData = authStore.getPendingSocialRegistration();
    if (!pendingData) {
      // No pending registration, redirect to login
      router.push('/login');
      return;
    }
    setProvider(pendingData.provider);
  }, [router]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = '실명을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '실명은 2자 이상 입력해주세요.';
    }

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.trim().length < 2) {
      newErrors.nickname = '닉네임은 2자 이상 입력해주세요.';
    } else if (formData.nickname.trim().length > 20) {
      newErrors.nickname = '닉네임은 20자 이하로 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const result = await authStore.completeSocialRegistration(
      formData.name.trim(),
      formData.nickname.trim()
    );

    if (result.success) {
      router.push('/welcome');
    } else {
      setErrors({ general: result.error || '가입에 실패했습니다.' });
    }

    setIsLoading(false);
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <div className="flex justify-center mb-4">
              {provider === 'google' ? (
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#191919"
                      d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.15.53-.54 1.9-.62 2.2-.1.37.14.37.29.27.12-.08 1.88-1.28 2.64-1.8.63.09 1.29.14 1.98.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">추가 정보 입력</h1>
            <p className="text-sm text-gray-500">
              서비스 이용을 위해 아래 정보를 입력해주세요
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (Real name) */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                실명 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="실명을 입력하세요"
                  className={cn('pl-10 h-12', errors.name && 'border-red-500')}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                회원권 확인 등에 사용됩니다
              </p>
            </div>

            {/* Nickname */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleChange('nickname', e.target.value)}
                  placeholder="활동할 닉네임을 입력하세요"
                  className={cn('pl-10 h-12', errors.nickname && 'border-red-500')}
                  disabled={isLoading}
                  maxLength={20}
                />
              </div>
              {errors.nickname && (
                <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                커뮤니티에서 표시되는 이름입니다 (2~20자)
              </p>
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                '가입 완료'
              )}
            </Button>
          </form>

          {/* Cancel */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                authStore.clearPendingSocialRegistration();
                router.push('/login');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              취소하고 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
