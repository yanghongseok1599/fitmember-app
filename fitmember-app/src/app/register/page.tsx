'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AtSign,
  Phone,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { authStore } from '@/lib/auth-store';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  phone: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'general', string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'kakao' | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Optional field
    const re = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    return re.test(phone.replace(/-/g, ''));
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormData | 'general', string>> = {};

    // Validation
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

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = authStore.registerWithEmail(
      formData.email,
      formData.password,
      formData.name.trim(),
      formData.nickname.trim(),
      formData.phone
    );

    if (result.success) {
      router.push('/welcome');
    } else {
      setErrors({ general: result.error || '회원가입에 실패했습니다.' });
    }

    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setSocialLoading('google');
    setErrors({});

    const result = await authStore.loginWithGoogle();

    if (result.success) {
      if (result.needsRegistration) {
        router.push('/register/complete');
      } else {
        router.push('/');
      }
    } else {
      setErrors({ general: result.error || '구글 가입에 실패했습니다.' });
    }

    setSocialLoading(null);
  };

  const handleKakaoSignup = async () => {
    setSocialLoading('kakao');
    setErrors({});

    const result = await authStore.loginWithKakao();

    if (result.success) {
      if (result.needsRegistration) {
        router.push('/register/complete');
      } else {
        router.push('/');
      }
    } else {
      setErrors({ general: result.error || '카카오 가입에 실패했습니다.' });
    }

    setSocialLoading(null);
  };

  const handleAgreeAll = () => {
    const allChecked = formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing;
    setFormData((prev) => ({
      ...prev,
      agreeTerms: !allChecked,
      agreePrivacy: !allChecked,
      agreeMarketing: !allChecked,
    }));
  };

  const allAgreed = formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing;

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link href="/" className="text-lg font-semibold text-primary">
          FitMember
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8 pt-4">
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-gray-900 mb-2">회원가입</h1>
            <p className="text-sm text-gray-500">
              FitMember와 함께 건강한 습관을 시작하세요
            </p>
          </div>

          {/* Social Signup Buttons */}
          <div className="space-y-3 mb-6">
            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignup}
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
                  Google로 가입하기
                </>
              )}
            </Button>

            {/* Kakao Signup */}
            <Button
              type="button"
              onClick={handleKakaoSignup}
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
                  카카오로 가입하기
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
              <span className="px-4 bg-muted text-gray-500">또는 이메일로 가입</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={isLoading || socialLoading !== null}
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
                  disabled={isLoading || socialLoading !== null}
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

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className={cn('pl-10 h-12', errors.email && 'border-red-500')}
                  disabled={isLoading || socialLoading !== null}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="8자 이상 입력하세요"
                  className={cn('pl-10 pr-10 h-12', errors.password && 'border-red-500')}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className={cn('pl-10 pr-10 h-12', errors.confirmPassword && 'border-red-500')}
                  disabled={isLoading || socialLoading !== null}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                전화번호 <span className="text-gray-400">(선택)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="010-0000-0000"
                  className={cn('pl-10 h-12', errors.phone && 'border-red-500')}
                  disabled={isLoading || socialLoading !== null}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Agreements */}
            <div className="space-y-3 pt-2">
              {/* Agree All */}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-100 rounded-lg">
                <div
                  className={cn(
                    'w-5 h-5 rounded border flex items-center justify-center transition-colors',
                    allAgreed
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-300'
                  )}
                  onClick={handleAgreeAll}
                >
                  {allAgreed && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  전체 동의하기
                </span>
              </label>

              {/* Individual agreements */}
              <div className="space-y-2 pl-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      formData.agreeTerms
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    )}
                  >
                    {formData.agreeTerms && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="text-red-500">[필수]</span> 이용약관 동의
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={(e) => handleChange('agreePrivacy', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      formData.agreePrivacy
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    )}
                  >
                    {formData.agreePrivacy && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="text-red-500">[필수]</span> 개인정보 처리방침 동의
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeMarketing}
                    onChange={(e) => handleChange('agreeMarketing', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      formData.agreeMarketing
                        ? 'bg-primary border-primary'
                        : 'bg-white border-gray-300'
                    )}
                  >
                    {formData.agreeMarketing && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="text-gray-400">[선택]</span> 마케팅 정보 수신 동의
                  </span>
                </label>
              </div>

              {(errors.agreeTerms || errors.agreePrivacy) && (
                <p className="text-red-500 text-xs">
                  {errors.agreeTerms || errors.agreePrivacy}
                </p>
              )}
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.general}
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
                '가입하기'
              )}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-500">
              이미 회원이신가요?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
