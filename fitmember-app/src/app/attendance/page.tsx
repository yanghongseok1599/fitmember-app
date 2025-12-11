'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout';
import { QRScanner } from '@/components/attendance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  MapPin,
  QrCode,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  Navigation,
  Shield,
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  GYM_CONFIG,
  isWithinGymRange,
  validateQRCode,
  calculateDistance,
} from '@/lib/gym-config';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type AttendanceStep = 'location' | 'qr' | 'success' | 'error';

export default function AttendancePage() {
  const [step, setStep] = useState<AttendanceStep>('location');
  const [locationVerified, setLocationVerified] = useState(false);
  const [qrVerified, setQrVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [distance, setDistance] = useState<number | null>(null);

  const {
    latitude,
    longitude,
    accuracy,
    error: geoError,
    loading: geoLoading,
    getCurrentPosition,
  } = useGeolocation();

  // 위치 확인
  useEffect(() => {
    if (latitude && longitude) {
      const dist = calculateDistance(
        latitude,
        longitude,
        GYM_CONFIG.latitude,
        GYM_CONFIG.longitude
      );
      setDistance(Math.round(dist));

      if (isWithinGymRange(latitude, longitude)) {
        setLocationVerified(true);
      } else {
        setLocationVerified(false);
        setErrorMessage(
          `현재 위치가 헬스장에서 ${Math.round(dist)}m 떨어져 있습니다. 헬스장 근처(${GYM_CONFIG.allowedRadius}m 이내)에서 다시 시도해주세요.`
        );
      }
    }
  }, [latitude, longitude]);

  // QR 스캔 결과 처리
  const handleQRScan = (result: string) => {
    if (validateQRCode(result)) {
      setQrVerified(true);
      setStep('success');
      // TODO: 서버에 출석 기록 전송
    } else {
      setErrorMessage('유효하지 않은 QR 코드입니다. 헬스장 내 QR 코드를 스캔해주세요.');
      setStep('error');
    }
  };

  // 다음 단계로
  const handleNextStep = () => {
    if (step === 'location' && locationVerified) {
      setStep('qr');
    }
  };

  // 다시 시도
  const handleRetry = () => {
    setErrorMessage('');
    setLocationVerified(false);
    setQrVerified(false);
    setStep('location');
    getCurrentPosition();
  };

  const renderLocationStep = () => (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            위치 확인
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            {geoLoading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                <p className="text-muted-foreground">위치를 확인하고 있습니다...</p>
              </div>
            ) : geoError ? (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 mx-auto text-destructive" />
                <p className="text-destructive">{geoError}</p>
                <Button onClick={getCurrentPosition} variant="outline">
                  다시 시도
                </Button>
              </div>
            ) : locationVerified ? (
              <div className="space-y-4">
                <div className="relative">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-primary" />
                  <div className="absolute -bottom-1 -right-1 left-0 right-0 flex justify-center">
                    <Badge className="bg-primary">확인됨</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-lg">위치 확인 완료!</p>
                  <p className="text-muted-foreground text-sm">
                    {GYM_CONFIG.name} 근처에 있습니다
                  </p>
                  {distance !== null && (
                    <p className="text-xs text-muted-foreground">
                      현재 거리: {distance}m (허용 범위: {GYM_CONFIG.allowedRadius}m)
                    </p>
                  )}
                </div>
              </div>
            ) : distance !== null ? (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 mx-auto text-destructive" />
                <div className="space-y-1">
                  <p className="text-destructive font-medium">헬스장 범위를 벗어났습니다</p>
                  <p className="text-sm text-muted-foreground">
                    현재 거리: {distance}m
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {GYM_CONFIG.allowedRadius}m 이내로 이동해주세요
                  </p>
                </div>
                <Button onClick={getCurrentPosition} variant="outline">
                  <Navigation className="h-4 w-4 mr-2" />
                  위치 다시 확인
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">위치 확인이 필요합니다</p>
                <Button onClick={getCurrentPosition} className="btn-primary">
                  <MapPin className="h-4 w-4 mr-2" />
                  위치 확인하기
                </Button>
              </div>
            )}
          </div>

          {accuracy && (
            <div className="text-xs text-center text-muted-foreground">
              GPS 정확도: ±{Math.round(accuracy)}m
            </div>
          )}
        </CardContent>
      </Card>

      {locationVerified && (
        <Button onClick={handleNextStep} className="w-full btn-primary">
          <QrCode className="h-4 w-4 mr-2" />
          QR 코드 스캔하기
        </Button>
      )}
    </div>
  );

  const renderQRStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="border-primary text-primary">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          위치 확인됨
        </Badge>
      </div>

      <QRScanner
        onScan={handleQRScan}
        onError={(error) => {
          setErrorMessage(error);
        }}
        enabled={step === 'qr'}
      />

      <Button onClick={() => setStep('location')} variant="outline" className="w-full">
        <ChevronLeft className="h-4 w-4 mr-2" />
        이전 단계로
      </Button>
    </div>
  );

  const renderSuccessStep = () => (
    <Card className="border-0 shadow-sm">
      <CardContent className="py-12 text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mx-auto animate-pulse-coral">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">출석 완료!</h2>
          <p className="text-muted-foreground">
            오늘도 화이팅하세요!
          </p>
        </div>

        <div className="bg-accent rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">획득 포인트</span>
            <span className="font-bold text-primary">+10P</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">출석 시간</span>
            <span className="font-medium">
              {new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>GPS + QR 이중 인증 완료</span>
        </div>

        <Link href="/">
          <Button className="w-full btn-primary">
            홈으로 돌아가기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const renderErrorStep = () => (
    <Card className="border-0 shadow-sm">
      <CardContent className="py-12 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-destructive">출석 실패</h2>
          <p className="text-muted-foreground">{errorMessage}</p>
        </div>

        <Button onClick={handleRetry} className="w-full btn-primary">
          다시 시도하기
        </Button>

        <Link href="/">
          <Button variant="ghost" className="w-full">
            홈으로 돌아가기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  // 진행률 계산
  const getProgress = () => {
    switch (step) {
      case 'location':
        return locationVerified ? 50 : 25;
      case 'qr':
        return 75;
      case 'success':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <AppLayout hideNavigation>
      <div className="py-4 space-y-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">출석체크</h1>
            <p className="text-sm text-muted-foreground">GPS + QR 이중 인증</p>
          </div>
        </div>

        {/* 진행률 */}
        {step !== 'success' && step !== 'error' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">진행률</span>
              <span className="font-medium">{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={cn(locationVerified && 'text-primary font-medium')}>
                1. 위치 확인
              </span>
              <span className={cn(step === 'qr' && 'text-primary font-medium')}>
                2. QR 스캔
              </span>
              <span>3. 완료</span>
            </div>
          </div>
        )}

        {/* 단계별 컨텐츠 */}
        {step === 'location' && renderLocationStep()}
        {step === 'qr' && renderQRStep()}
        {step === 'success' && renderSuccessStep()}
        {step === 'error' && renderErrorStep()}
      </div>
    </AppLayout>
  );
}
