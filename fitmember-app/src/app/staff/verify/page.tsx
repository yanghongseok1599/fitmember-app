'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Coins,
  User,
  Clock,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { pointStore, PointUsageRequest } from '@/lib/point-store';

function VerifyContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code');

  const [verificationCode, setVerificationCode] = useState(codeFromUrl || '');
  const [request, setRequest] = useState<PointUsageRequest | null>(null);
  const [status, setStatus] = useState<'idle' | 'found' | 'confirmed' | 'error' | 'expired'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const staffId = 'staff-1'; // In real app, this would come from staff authentication

  useEffect(() => {
    if (codeFromUrl) {
      handleSearch();
    }
  }, [codeFromUrl]);

  // Timer for request expiration
  useEffect(() => {
    if (!request || status !== 'found') return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(request.expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        setStatus('expired');
        setRequest(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [request, status]);

  const handleSearch = () => {
    const code = verificationCode.trim().toUpperCase();

    if (!code) {
      setErrorMessage('인증 코드를 입력해주세요');
      setStatus('error');
      return;
    }

    const foundRequest = pointStore.getPendingRequest(code);

    if (!foundRequest) {
      setErrorMessage('유효하지 않거나 만료된 인증 코드입니다');
      setStatus('error');
      setRequest(null);
      return;
    }

    setRequest(foundRequest);
    setStatus('found');
    setErrorMessage('');

    // Calculate initial time left
    const now = new Date().getTime();
    const expires = new Date(foundRequest.expiresAt).getTime();
    setTimeLeft(Math.max(0, Math.floor((expires - now) / 1000)));
  };

  const handleConfirm = () => {
    if (!request) return;

    const success = pointStore.confirmUsage(request.verificationCode, staffId);

    if (success) {
      setStatus('confirmed');
    } else {
      setErrorMessage('포인트 차감에 실패했습니다. 다시 시도해주세요.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setVerificationCode('');
    setRequest(null);
    setStatus('idle');
    setErrorMessage('');
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-medium">포인트 사용 확인</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">직원 전용 페이지</p>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* Search Section */}
        {status === 'idle' || status === 'error' ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium mb-4">인증 코드 확인</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">인증 코드 입력</label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  placeholder="6자리 코드"
                  className="text-center text-xl font-mono tracking-widest h-14"
                  maxLength={6}
                />
              </div>

              {status === 'error' && errorMessage && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {errorMessage}
                </div>
              )}

              <Button
                onClick={handleSearch}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                확인
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>사용 방법:</strong>
              </p>
              <ol className="text-sm text-gray-500 mt-2 space-y-1 list-decimal list-inside">
                <li>회원이 보여주는 QR 코드를 스캔하세요</li>
                <li>또는 6자리 인증 코드를 직접 입력하세요</li>
                <li>회원 정보와 사용 포인트를 확인 후 승인하세요</li>
              </ol>
            </div>
          </div>
        ) : status === 'found' && request ? (
          /* Request Found - Show Details */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-primary/10 p-4 text-center border-b border-gray-200">
              <Coins className="h-10 w-10 mx-auto text-primary mb-2" />
              <p className="text-sm text-gray-600">사용 포인트</p>
              <p className="text-4xl font-light text-primary">
                {request.amount.toLocaleString()}
                <span className="text-lg">P</span>
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">회원명</p>
                  <p className="font-medium text-gray-900">{request.userName}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  남은 시간:{' '}
                  <span className={cn(
                    "font-mono",
                    timeLeft <= 60 && "text-red-500"
                  )}>
                    {formatTime(timeLeft)}
                  </span>
                </span>
              </div>

              {/* Verification Code Display */}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">인증 코드</p>
                <p className="text-xl font-mono font-bold tracking-widest">
                  {request.verificationCode}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleConfirm}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  포인트 사용 승인
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        ) : status === 'confirmed' ? (
          /* Confirmation Success */
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              포인트 사용 완료
            </h2>
            <p className="text-gray-500 mb-6">
              {request?.amount.toLocaleString()}P가 차감되었습니다
            </p>
            <Button
              onClick={handleReset}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              새로운 확인
            </Button>
          </div>
        ) : status === 'expired' ? (
          /* Request Expired */
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              요청이 만료되었습니다
            </h2>
            <p className="text-gray-500 mb-6">
              회원에게 새로운 QR 코드를 요청해주세요
            </p>
            <Button
              onClick={handleReset}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              다시 확인
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function StaffVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
