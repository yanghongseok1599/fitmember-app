'use client';

import { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Coins,
  QrCode,
  ArrowUp,
  ArrowDown,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { pointStore, PointTransaction, PointUsageRequest } from '@/lib/point-store';
import QRCode from 'qrcode';

export default function PointsPage() {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [showUseModal, setShowUseModal] = useState(false);
  const [useAmount, setUseAmount] = useState('');
  const [qrRequest, setQrRequest] = useState<PointUsageRequest | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState('');

  const userId = 'user-1';
  const userName = '김민수';

  useEffect(() => {
    setPoints(pointStore.getPoints(userId));
    setTransactions(pointStore.getTransactions(userId));

    const unsubscribe = pointStore.subscribe(() => {
      setPoints(pointStore.getPoints(userId));
      setTransactions(pointStore.getTransactions(userId));
    });

    return () => unsubscribe();
  }, []);

  // Timer for QR expiration
  useEffect(() => {
    if (!qrRequest) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(qrRequest.expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        setQrRequest(null);
        setQrCodeUrl('');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrRequest]);

  const handleCreateQR = async () => {
    const amount = parseInt(useAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('올바른 금액을 입력하세요');
      return;
    }

    if (amount > points) {
      setError('보유 포인트가 부족합니다');
      return;
    }

    const request = pointStore.createUsageRequest(userId, userName, amount);

    if (!request) {
      setError('포인트 사용 요청에 실패했습니다');
      return;
    }

    setQrRequest(request);
    setError('');

    // Generate QR code
    const qrData = JSON.stringify({
      type: 'point_use',
      code: request.verificationCode,
      amount: request.amount,
      userName: request.userName,
      expiresAt: request.expiresAt,
    });

    // Create verification URL
    const verifyUrl = `${window.location.origin}/staff/verify?code=${request.verificationCode}`;

    try {
      const url = await QRCode.toDataURL(verifyUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  const handleCancelQR = () => {
    if (qrRequest) {
      pointStore.cancelRequest(qrRequest.id);
    }
    setQrRequest(null);
    setQrCodeUrl('');
    setUseAmount('');
    setShowUseModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <AppLayout>
      {/* Header */}
      <div className="py-6 border-b border-border">
        <p className="watermark-text mb-2">Points</p>
        <h1 className="text-xl font-light">포인트</h1>
      </div>

      {/* Points Summary */}
      <div className="py-6 border-b border-border">
        <div className="p-6 bg-white border border-primary/30 rounded-sm">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="text-sm text-gray-500">보유 포인트</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-gray-900">{points.toLocaleString()}</span>
            <span className="text-lg text-gray-500">P</span>
          </div>
        </div>

        <Button
          onClick={() => setShowUseModal(true)}
          className="w-full mt-4 btn-secondary flex items-center justify-center gap-2"
        >
          <QrCode className="h-5 w-5" />
          포인트 사용하기
        </Button>
      </div>

      {/* Use Points Modal */}
      {showUseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-sm rounded-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-light">포인트 사용</h2>
              <button onClick={handleCancelQR} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {!qrRequest ? (
                <>
                  {/* Amount Input */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-500 mb-2 block">사용할 포인트</label>
                    <Input
                      type="number"
                      value={useAmount}
                      onChange={(e) => {
                        setUseAmount(e.target.value);
                        setError('');
                      }}
                      placeholder="0"
                      className="text-2xl text-center h-14"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      보유: {points.toLocaleString()}P
                    </p>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setUseAmount(amount.toString())}
                        disabled={amount > points}
                        className={cn(
                          "py-2 text-sm rounded-sm border transition-colors",
                          amount > points
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-border text-gray-700 hover:border-primary"
                        )}
                      >
                        {amount.toLocaleString()}P
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <Button onClick={handleCreateQR} className="w-full btn-primary">
                    QR 코드 생성
                  </Button>
                </>
              ) : (
                <>
                  {/* QR Code Display */}
                  <div className="text-center">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">사용 포인트</p>
                      <p className="text-3xl font-light text-primary">
                        {qrRequest.amount.toLocaleString()}P
                      </p>
                    </div>

                    {qrCodeUrl && (
                      <div className="inline-block p-4 bg-white border border-border rounded-sm mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCodeUrl} alt="QR Code" className="w-56 h-56" />
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        유효시간: <span className={cn(
                          "font-mono",
                          timeLeft <= 60 && "text-red-500"
                        )}>{formatTime(timeLeft)}</span>
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-sm mb-4">
                      <p className="text-xs text-gray-500 mb-1">인증 코드</p>
                      <p className="text-xl font-mono font-bold tracking-widest">
                        {qrRequest.verificationCode}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      직원에게 QR 코드를 보여주세요
                    </p>

                    <Button
                      onClick={handleCancelQR}
                      variant="outline"
                      className="w-full"
                    >
                      취소
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="py-6 pb-24">
        <h2 className="text-sm font-medium mb-4">포인트 내역</h2>

        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <Coins className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">포인트 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white border border-border rounded-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    tx.type === 'earn' ? "bg-green-100" : "bg-red-100"
                  )}>
                    {tx.type === 'earn' ? (
                      <ArrowDown className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-medium",
                  tx.type === 'earn' ? "text-green-600" : "text-red-600"
                )}>
                  {tx.type === 'earn' ? '+' : ''}{tx.amount.toLocaleString()}P
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
