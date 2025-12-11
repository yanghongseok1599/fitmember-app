'use client';

import { useRef } from 'react';
import { AdminGuard } from '@/components/auth/admin-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import {
  ChevronLeft,
  Download,
  Printer,
  QrCode,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { GYM_CONFIG, FIXED_QR_CODE } from '@/lib/gym-config';

function QRCodePageContent() {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'itn-fitness-qr-code.png';
      link.href = url;
      link.click();
    }
  };

  const handlePrint = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>ITN FITNESS QR 코드</title>
              <style>
                body {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .container {
                  text-align: center;
                  padding: 40px;
                  border: 3px solid #FF4D6D;
                  border-radius: 20px;
                }
                h1 {
                  color: #FF4D6D;
                  margin-bottom: 10px;
                }
                .address {
                  color: #666;
                  margin-bottom: 30px;
                }
                img {
                  width: 300px;
                  height: 300px;
                }
                .instruction {
                  margin-top: 30px;
                  color: #333;
                  font-size: 18px;
                }
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>ITN FITNESS</h1>
                <p class="address">${GYM_CONFIG.address}</p>
                <img src="${canvas.toDataURL('image/png')}" alt="QR Code" />
                <p class="instruction">출석체크를 위해 QR 코드를 스캔해주세요</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* 헤더 */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">QR 코드 관리</h1>
              <p className="text-sm text-muted-foreground">출석용 QR 코드</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* QR 코드 표시 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              출석체크 QR 코드
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div
              ref={qrRef}
              className="bg-white p-6 rounded-2xl shadow-inner"
            >
              <QRCodeCanvas
                value={FIXED_QR_CODE}
                size={240}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: '/icon-192x192.png',
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>

            <div className="mt-6 text-center">
              <h3 className="font-bold text-lg">{GYM_CONFIG.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {GYM_CONFIG.address}
              </p>
            </div>

            <div className="flex gap-3 mt-6 w-full">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
              <Button
                onClick={handlePrint}
                className="flex-1 btn-primary"
              >
                <Printer className="h-4 w-4 mr-2" />
                인쇄하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 안내 사항 */}
        <Card className="border-0 shadow-sm bg-accent">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-semibold">QR 코드 설치 안내</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 인쇄 후 헬스장 입구나 카운터에 부착해주세요</li>
                  <li>• 회원들이 쉽게 스캔할 수 있는 위치에 설치하세요</li>
                  <li>• 직사광선이나 습기를 피해 설치해주세요</li>
                  <li>• QR 코드가 손상되면 다시 인쇄해주세요</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 출석 인증 방식 설명 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">출석 인증 방식</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <p className="font-medium">GPS 위치 확인</p>
                <p className="text-sm text-muted-foreground">
                  회원이 헬스장 반경 {GYM_CONFIG.allowedRadius}m 이내에 있는지 확인
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <p className="font-medium">QR 코드 스캔</p>
                <p className="text-sm text-muted-foreground">
                  헬스장 내 QR 코드를 스캔하여 실제 방문 확인
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <p className="font-medium">출석 완료</p>
                <p className="text-sm text-muted-foreground">
                  이중 인증 완료 시 출석 포인트 +10P 지급
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function QRCodePage() {
  return (
    <AdminGuard>
      <QRCodePageContent />
    </AdminGuard>
  );
}
