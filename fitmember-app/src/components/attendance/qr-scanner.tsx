'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
}

export function QRScanner({ onScan, onError, enabled = true }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    if (!containerRef.current || !enabled) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {
          // QR 코드가 감지되지 않음 - 무시
        }
      );

      setIsScanning(true);
      setHasCamera(true);
    } catch (err) {
      console.error('QR Scanner error:', err);
      setHasCamera(false);
      onError?.('카메라를 시작할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  useEffect(() => {
    if (enabled && !isScanning) {
      startScanning();
    } else if (!enabled && isScanning) {
      stopScanning();
    }
  }, [enabled]);

  if (!hasCamera) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 text-center">
          <CameraOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            카메라를 사용할 수 없습니다.
          </p>
          <Button onClick={() => { setHasCamera(true); startScanning(); }} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div
            id="qr-reader"
            ref={containerRef}
            className="w-full aspect-square bg-black"
          />
          {!isScanning && enabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Button onClick={startScanning} className="btn-primary">
                <Camera className="h-4 w-4 mr-2" />
                카메라 시작
              </Button>
            </div>
          )}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 text-center text-sm text-muted-foreground">
          헬스장 내 QR 코드를 스캔해주세요
        </div>
      </CardContent>
    </Card>
  );
}
