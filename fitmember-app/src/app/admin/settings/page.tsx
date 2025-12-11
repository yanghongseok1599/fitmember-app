'use client';

import { useState } from 'react';
import { AdminGuard, useAdmin } from '@/components/auth/admin-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Bell,
  Shield,
  Server,
  Database,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Save,
  Instagram,
  Youtube,
  LogOut,
  Coins,
  Users,
  Calendar,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

// 운영시간 항목 타입
interface BusinessHoursEntry {
  id: string;
  dayType: string;
  hours: string;
}

// 요일 타입 옵션
const dayTypeOptions = [
  '평일',
  '토요일',
  '일요일',
  '공휴일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '주말',
  '휴무일',
];

function SettingsPageContent() {
  const { handleLogout } = useAdmin();

  // 사이트 설정 상태
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'ITN FITNESS',
    phone: '02-1234-5678',
    email: 'info@itnfitness.com',
    address: '서울시 강남구 역삼동 123-45',
    instagramUrl: 'https://instagram.com/itnfitness',
    youtubeUrl: 'https://youtube.com/@itnfitness',
  });

  // 운영시간 상태 (배열로 관리)
  const [businessHours, setBusinessHours] = useState<BusinessHoursEntry[]>([
    { id: '1', dayType: '평일', hours: '06:00 - 23:00' },
    { id: '2', dayType: '토요일', hours: '08:00 - 20:00' },
    { id: '3', dayType: '일요일/공휴일', hours: '10:00 - 18:00' },
  ]);

  // 운영시간 항목 추가
  const addBusinessHours = () => {
    const newEntry: BusinessHoursEntry = {
      id: Date.now().toString(),
      dayType: '',
      hours: '',
    };
    setBusinessHours([...businessHours, newEntry]);
  };

  // 운영시간 항목 삭제
  const removeBusinessHours = (id: string) => {
    if (businessHours.length > 1) {
      setBusinessHours(businessHours.filter((entry) => entry.id !== id));
    }
  };

  // 운영시간 항목 업데이트
  const updateBusinessHours = (id: string, field: 'dayType' | 'hours', value: string) => {
    setBusinessHours(
      businessHours.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // 알림 설정 상태
  const [notifications, setNotifications] = useState({
    newMember: true,
    dailyReport: true,
    lowAttendance: false,
    systemAlert: true,
  });

  // 포인트 설정 상태
  const [pointSettings, setPointSettings] = useState({
    attendancePoints: 10,
    workoutPostPoints: 20,
    challengeCompletePoints: 50,
    welcomeBonus: 100,
  });

  // 시스템 정보 (더미 데이터)
  const systemInfo = {
    serverStatus: 'online',
    databaseStatus: 'online',
    lastBackup: '2024-01-15 03:00:00',
    storageUsed: '2.4GB / 10GB',
    appVersion: '1.0.0',
  };

  const handleSaveSiteSettings = () => {
    alert('사이트 설정이 저장되었습니다.');
  };

  const handleSavePointSettings = () => {
    alert('포인트 설정이 저장되었습니다.');
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">시스템 설정</h1>
                <p className="text-sm text-gray-500">앱 설정 관리</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-500"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 사이트 설정 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                헬스장 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">헬스장 이름</label>
                <Input
                  value={siteSettings.siteName}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, siteName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">전화번호</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={siteSettings.phone}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, phone: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={siteSettings.email}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">주소</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={siteSettings.address}
                    onChange={(e) =>
                      setSiteSettings({ ...siteSettings, address: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    운영시간
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBusinessHours}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {businessHours.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <Input
                        value={entry.dayType}
                        onChange={(e) => updateBusinessHours(entry.id, 'dayType', e.target.value)}
                        placeholder="요일 (예: 평일, 토요일)"
                        className="w-32 text-sm"
                        list={`dayType-${entry.id}`}
                      />
                      <datalist id={`dayType-${entry.id}`}>
                        {dayTypeOptions.map((option) => (
                          <option key={option} value={option} />
                        ))}
                      </datalist>
                      <Input
                        value={entry.hours}
                        onChange={(e) => updateBusinessHours(entry.id, 'hours', e.target.value)}
                        placeholder="시간 (예: 06:00 - 23:00)"
                        className="flex-1 text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBusinessHours(entry.id)}
                        disabled={businessHours.length <= 1}
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  요일 입력 시 자동완성 목록이 표시됩니다. 직접 입력도 가능합니다.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">인스타그램</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={siteSettings.instagramUrl}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })
                      }
                      className="pl-10"
                      placeholder="URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">유튜브</label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={siteSettings.youtubeUrl}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, youtubeUrl: e.target.value })
                      }
                      className="pl-10"
                      placeholder="URL"
                    />
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-2"
                onClick={handleSaveSiteSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </CardContent>
          </Card>

          {/* 포인트 설정 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                포인트 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">출석 체크 포인트</label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={pointSettings.attendancePoints}
                    onChange={(e) =>
                      setPointSettings({
                        ...pointSettings,
                        attendancePoints: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">P</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">운동 인증 포인트</label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={pointSettings.workoutPostPoints}
                    onChange={(e) =>
                      setPointSettings({
                        ...pointSettings,
                        workoutPostPoints: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">P</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">챌린지 달성 포인트</label>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={pointSettings.challengeCompletePoints}
                    onChange={(e) =>
                      setPointSettings({
                        ...pointSettings,
                        challengeCompletePoints: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">P</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">신규 가입 보너스</label>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={pointSettings.welcomeBonus}
                    onChange={(e) =>
                      setPointSettings({
                        ...pointSettings,
                        welcomeBonus: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">P</span>
                </div>
              </div>
              <Button
                className="w-full mt-2"
                onClick={handleSavePointSettings}
              >
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                관리자 알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'newMember' as const, label: '신규 회원 가입 알림', desc: '새로운 회원이 가입하면 알림' },
                { key: 'dailyReport' as const, label: '일일 리포트', desc: '매일 출석 현황 리포트' },
                { key: 'lowAttendance' as const, label: '출석률 저하 알림', desc: '회원 출석률이 낮으면 알림' },
                { key: 'systemAlert' as const, label: '시스템 알림', desc: '시스템 오류 및 점검 알림' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.key)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      notifications[item.key] ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key] ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 시스템 정보 */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                시스템 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 서버 상태 */}
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <Server className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">서버 상태</span>
                </div>
                <div className="flex items-center gap-2">
                  {systemInfo.serverStatus === 'online' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">정상</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">오류</span>
                    </>
                  )}
                </div>
              </div>

              {/* 데이터베이스 상태 */}
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">데이터베이스</span>
                </div>
                <div className="flex items-center gap-2">
                  {systemInfo.databaseStatus === 'online' ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">정상</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">오류</span>
                    </>
                  )}
                </div>
              </div>

              {/* 스토리지 */}
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">저장공간</span>
                </div>
                <span className="text-sm text-gray-600">{systemInfo.storageUsed}</span>
              </div>

              {/* 최근 백업 */}
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">최근 백업</span>
                </div>
                <span className="text-sm text-gray-600">{systemInfo.lastBackup}</span>
              </div>

              {/* 앱 버전 */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">앱 버전</span>
                </div>
                <span className="text-sm text-gray-600">v{systemInfo.appVersion}</span>
              </div>

              {/* 백업 버튼 */}
              <Button variant="outline" className="w-full mt-2">
                <Database className="h-4 w-4 mr-2" />
                수동 백업 실행
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SettingsPageContent />
    </AdminGuard>
  );
}
