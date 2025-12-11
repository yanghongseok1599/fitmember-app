'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ChevronRight, Sparkles, Target, Flame, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authStore } from '@/lib/auth-store';
import { inbodyStore } from '@/lib/inbody-store';

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [hasInbodyData, setHasInbodyData] = useState(false);

  useEffect(() => {
    const user = authStore.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserName(user.name);

    // Check if user already has InBody data
    const latestInbody = inbodyStore.getLatest();
    setHasInbodyData(!!latestInbody);
  }, [router]);

  const handleGoToInbody = () => {
    // Mark welcome as seen
    localStorage.setItem('welcomeSeen', 'true');
    router.push('/inbody');
  };

  const handleSkip = () => {
    // Mark welcome as seen
    localStorage.setItem('welcomeSeen', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-muted flex flex-col">
      {/* Header */}
      <div className="p-4">
        <span className="text-lg font-semibold text-primary">FitMember</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Welcome Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-lg">✓</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            환영합니다, {userName}님!
          </h1>
          <p className="text-gray-500">
            FitMember 가입이 완료되었습니다
          </p>
        </div>

        {/* InBody Recommendation Card */}
        <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">인바디 측정하기</h2>
              <p className="text-xs text-gray-500">첫 측정을 권장드려요!</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            인바디 측정을 통해 <strong className="text-primary">정확한 칼로리 소비량</strong>을
            계산하고 맞춤형 운동 관리를 받아보세요.
          </p>

          {/* Benefits List */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
              </div>
              <span>체중 기반 정확한 칼로리 소비량 계산</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Scale className="h-3.5 w-3.5 text-blue-500" />
              </div>
              <span>체성분 변화 추적 및 분석</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Target className="h-3.5 w-3.5 text-green-500" />
              </div>
              <span>개인 맞춤 목표 설정</span>
            </div>
          </div>

          <Button
            onClick={handleGoToInbody}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
          >
            인바디 측정하러 가기
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          나중에 할게요
        </button>

        {/* Info Text */}
        <p className="text-xs text-gray-400 mt-6 text-center max-w-xs">
          인바디 측정은 센터 방문 시 직원에게 요청하시거나,<br />
          측정 결과를 직접 입력하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
