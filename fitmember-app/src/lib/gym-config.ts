// 헬스장 위치 설정
// 주소: 강원도 동해시 효자남길 33-34 이아빌딩 (ITN FITNESS) - 북삼동
export const GYM_CONFIG = {
  name: 'ITN FITNESS',
  address: '강원도 동해시 효자남길 33-34 이아빌딩',
  // 동해시 북삼동 좌표
  // ⚠️ 정확한 좌표 확인 방법: Google Maps에서 주소 검색 → 우클릭 → 좌표 복사
  latitude: 37.5234,
  longitude: 129.1136,
  // 출석 인정 반경 (미터)
  allowedRadius: 100,
  // QR 코드 유효 시간 (분)
  qrValidMinutes: 5,
  // 운영 시간
  operatingHours: {
    weekday: { open: 6, close: 23 },
    weekend: { open: 9, close: 21 },
  },
};

// 두 지점 간 거리 계산 (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위
}

// 현재 위치가 헬스장 범위 내인지 확인
export function isWithinGymRange(latitude: number, longitude: number): boolean {
  const distance = calculateDistance(
    latitude,
    longitude,
    GYM_CONFIG.latitude,
    GYM_CONFIG.longitude
  );
  return distance <= GYM_CONFIG.allowedRadius;
}

// 현재 운영 시간인지 확인
export function isOperatingHours(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  const isWeekend = day === 0 || day === 6;
  const hours = isWeekend
    ? GYM_CONFIG.operatingHours.weekend
    : GYM_CONFIG.operatingHours.weekday;

  return hour >= hours.open && hour < hours.close;
}

// 고정 QR 코드 값
export const FIXED_QR_CODE = 'ITNFIT-ATTENDANCE-2024';

// QR 코드 검증 (고정 코드 사용)
export function validateQRCode(scannedCode: string): boolean {
  return scannedCode === FIXED_QR_CODE;
}
