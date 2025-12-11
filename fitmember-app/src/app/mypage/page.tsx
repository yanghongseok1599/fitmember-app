'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  User,
  Coins,
  Bell,
  Crown,
  Calendar,
  Activity,
  Target,
  Shield,
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { authStore } from '@/lib/auth-store';
import { pointStore, PointUsageRequest } from '@/lib/point-store';
import { UserProfile } from '@/types';

const gradeColors: Record<string, string> = {
  bronze: 'text-amber-700 bg-amber-100',
  silver: 'text-gray-600 bg-gray-200',
  gold: 'text-yellow-700 bg-yellow-100',
  platinum: 'text-purple-700 bg-purple-100',
};

const gradeNames: Record<string, string> = {
  bronze: '브론즈',
  silver: '실버',
  gold: '골드',
  platinum: '플래티넘',
};

export default function MypagePage() {
  const { data: session } = useSession();
  const [localUser, setLocalUser] = useState<UserProfile | null>(null);
  const [points, setPoints] = useState(0);

  // Staff QR Scanner states
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; request?: PointUsageRequest } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const currentUser = authStore.getUser();
    setLocalUser(currentUser);

    if (currentUser) {
      setPoints(pointStore.getPoints(currentUser.id));
    }

    const unsubscribeAuth = authStore.subscribe(() => {
      const updated = authStore.getUser();
      setLocalUser(updated);
      if (updated) {
        setPoints(pointStore.getPoints(updated.id));
      }
    });

    const unsubscribePoint = pointStore.subscribe(() => {
      const currentUser = authStore.getUser();
      if (currentUser) {
        setPoints(pointStore.getPoints(currentUser.id));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribePoint();
    };
  }, []);

  // Combine NextAuth session user and local user
  const user = session?.user ? {
    id: (session.user as any).id || 'google-user',
    name: session.user.name || '사용자',
    email: session.user.email || '',
    profileImage: session.user.image || null,
    membershipGrade: 'bronze' as const,
    joinDate: new Date().toISOString(),
    role: 'user' as const,
  } : localUser;

  // Check if user is staff or admin
  const isStaff = localUser?.role === 'staff' || localUser?.role === 'admin';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Start camera for QR scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setScanResult({ success: false, message: '카메라 접근에 실패했습니다.' });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  // Handle manual code input for point usage
  const handleCodeSubmit = async () => {
    if (!manualCode.trim() || !localUser) return;

    setIsProcessing(true);
    setScanResult(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const request = pointStore.getPendingRequest(manualCode.toUpperCase());

    if (!request) {
      setScanResult({ success: false, message: '유효하지 않거나 만료된 코드입니다.' });
      setIsProcessing(false);
      return;
    }

    setScanResult({
      success: true,
      message: `${request.userName}님의 ${request.amount}P 사용 요청`,
      request
    });
    setIsProcessing(false);
  };

  // Confirm point usage
  const confirmPointUsage = async () => {
    if (!scanResult?.request || !localUser) return;

    setIsProcessing(true);

    const success = pointStore.confirmUsage(scanResult.request.verificationCode, localUser.id);

    if (success) {
      setScanResult({
        success: true,
        message: `${scanResult.request.userName}님의 ${scanResult.request.amount}P가 차감되었습니다.`
      });
      setManualCode('');
    } else {
      setScanResult({ success: false, message: '포인트 차감에 실패했습니다.' });
    }

    setIsProcessing(false);
  };

  // Close scanner
  const closeScanner = () => {
    stopCamera();
    setShowQrScanner(false);
    setScanResult(null);
    setManualCode('');
  };

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">로그인이 필요합니다</p>
        <Link href="/login">
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-white">
            로그인하기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div>
        <p className="watermark-text mb-1">My Page</p>
        <h1 className="text-xl font-light">마이페이지</h1>
      </div>

      {/* User Info Card */}
      <div className="bg-white border border-border rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            {user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">{user.name}</h2>
              {/* 일반 회원만 등급 배지 표시 (직원/관리자 제외) */}
              {!isStaff && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-[10px] sm:text-xs rounded-full flex items-center gap-1',
                    gradeColors[user.membershipGrade]
                  )}
                >
                  <Crown className="h-3 w-3" />
                  {gradeNames[user.membershipGrade]}
                </span>
              )}
              {isStaff && (
                <span className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full flex items-center gap-1 bg-blue-100 text-blue-700">
                  <Shield className="h-3 w-3" />
                  {localUser?.role === 'admin' ? '관리자' : '직원'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span>가입일: {formatDate(user.joinDate)}</span>
            </div>
          </div>
          <Link href="/mypage/profile" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
              프로필 수정
            </Button>
          </Link>
        </div>
      </div>

      {/* Staff/Admin Section */}
      {isStaff && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-medium text-blue-900">
                {localUser?.role === 'admin' ? '관리자 메뉴' : '직원 메뉴'}
              </h3>
            </div>
          </div>

          <div className={localUser?.role === 'admin' ? 'grid grid-cols-2 gap-3' : ''}>
            <Button
              onClick={() => setShowQrScanner(true)}
              className={cn(
                "bg-blue-600 hover:bg-blue-700 text-white h-auto py-4 flex flex-col items-center gap-2",
                localUser?.role !== 'admin' && "w-full"
              )}
            >
              <QrCode className="h-6 w-6" />
              <span className="text-sm">포인트 차감</span>
              <span className="text-xs opacity-80">QR 스캔</span>
            </Button>
            {localUser?.role === 'admin' && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">관리자 페이지</span>
                  <span className="text-xs opacity-60">대시보드</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQrScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium text-lg">포인트 차감</h3>
              <Button variant="ghost" size="icon" onClick={closeScanner}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {/* Camera View */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-square">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                {!isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Camera className="h-12 w-12 mb-3 opacity-50" />
                    <Button
                      onClick={startCamera}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      카메라 시작
                    </Button>
                  </div>
                )}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-white/50 rounded-lg"></div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs text-gray-400">또는 코드 입력</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Manual Code Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="인증 코드 입력"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="uppercase text-center tracking-widest font-mono"
                  maxLength={6}
                />
                <Button
                  onClick={handleCodeSubmit}
                  disabled={!manualCode.trim() || isProcessing}
                  className="bg-primary"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : '확인'}
                </Button>
              </div>

              {/* Result */}
              {scanResult && (
                <div className={cn(
                  'p-4 rounded-lg',
                  scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {scanResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={cn(
                      'font-medium',
                      scanResult.success ? 'text-green-800' : 'text-red-800'
                    )}>
                      {scanResult.message}
                    </span>
                  </div>
                  {scanResult.request && (
                    <div className="mt-3 space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">회원:</span> {scanResult.request.userName}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">차감 포인트:</span> {scanResult.request.amount.toLocaleString()}P
                      </div>
                      <Button
                        onClick={confirmPointUsage}
                        disabled={isProcessing}
                        className="w-full bg-green-600 hover:bg-green-700 mt-2"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        포인트 차감 승인
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Points Widget */}
        <Link
          href="/points"
          className="bg-white border border-border rounded-lg p-3 sm:p-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 mb-2">
            <Coins className="h-4 w-4 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs">보유 포인트</span>
          </div>
          <p className="text-xl sm:text-2xl font-light text-primary">
            {points.toLocaleString()}
            <span className="text-xs sm:text-sm text-gray-500 ml-1">P</span>
          </p>
        </Link>

        {/* InBody Widget */}
        <Link
          href="/inbody"
          className="bg-white border border-border rounded-lg p-3 sm:p-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 mb-2">
            <Activity className="h-4 w-4 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs">인바디 기록</span>
          </div>
          <p className="text-xl sm:text-2xl font-light text-gray-900">
            <span className="text-[10px] sm:text-sm text-gray-500">최근 측정 확인</span>
          </p>
        </Link>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium text-gray-900">알림</h3>
          <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </div>
        <div className="divide-y divide-border">
          <div className="px-4 py-3">
            <div className="flex items-start gap-3">
              <Bell className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">포인트 적립 안내</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  출석 체크로 10P가 적립되었습니다
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-start gap-3">
              <Target className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">챌린지 달성</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  출석왕 챌린지 20일 달성! 50P 적립
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
