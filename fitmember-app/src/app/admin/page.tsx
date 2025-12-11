'use client';

import { AdminGuard, useAdmin } from '@/components/auth/admin-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Coins,
  UserPlus,
  Activity,
  Target,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

// 대시보드 지표 인터페이스
interface DashboardMetric {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function AdminDashboardContent() {
  const { handleLogout } = useAdmin();

  // 대시보드 통계 데이터
  const stats = {
    totalMembers: 156,
    todayNewMembers: 3,
    monthlyAttendance: 487,
    totalPoints: 125000,
    todayAttendance: 23,
    activeMembers: 89,
  };

  // 지표 카드 데이터
  const metrics: DashboardMetric[] = [
    {
      title: '총 회원 수',
      value: stats.totalMembers,
      change: 5.2,
      icon: Users,
      color: 'blue',
    },
    {
      title: '오늘 신규 가입',
      value: stats.todayNewMembers,
      change: 12,
      icon: UserPlus,
      color: 'green',
    },
    {
      title: '이번 달 출석',
      value: stats.monthlyAttendance,
      change: 8.3,
      icon: Calendar,
      color: 'purple',
    },
    {
      title: '발급 포인트',
      value: stats.totalPoints.toLocaleString(),
      change: -2.1,
      icon: Coins,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  // 월별 출석 데이터 (차트 대신 간단한 바 차트)
  const monthlyData = [
    { month: '7월', value: 320 },
    { month: '8월', value: 380 },
    { month: '9월', value: 420 },
    { month: '10월', value: 450 },
    { month: '11월', value: 410 },
    { month: '12월', value: 487 },
  ];
  const maxValue = Math.max(...monthlyData.map((d) => d.value));

  // 인기 챌린지 데이터
  const popularChallenges = [
    { name: '출석왕 챌린지', participants: 45, color: 'bg-blue-500' },
    { name: '바디프로필 챌린지', participants: 32, color: 'bg-purple-500' },
    { name: '다이어트 챌린지', participants: 28, color: 'bg-green-500' },
    { name: '근력 챌린지', participants: 21, color: 'bg-orange-500' },
  ];
  const maxParticipants = Math.max(...popularChallenges.map((c) => c.participants));

  // 관리 메뉴 항목
  const menuItems = [
    {
      icon: QrCode,
      label: 'QR 코드 관리',
      description: '출석용 QR 코드 생성 및 인쇄',
      href: '/admin/qr-code',
      badge: null,
    },
    {
      icon: Users,
      label: '회원 관리',
      description: '회원 목록 조회 및 관리',
      href: '/admin/users',
      badge: `${stats.totalMembers}명`,
    },
    {
      icon: Calendar,
      label: '출석 현황',
      description: '일별/월별 출석 통계',
      href: '/admin/attendance',
      badge: null,
    },
    {
      icon: FileText,
      label: '페이지 콘텐츠',
      description: '앱 페이지 텍스트 및 정보 수정',
      href: '/admin/pages',
      badge: null,
    },
    {
      icon: Settings,
      label: '시스템 설정',
      description: '헬스장 정보 및 앱 설정',
      href: '/admin/settings',
      badge: null,
    },
  ];

  // 최근 가입자 데이터
  const recentMembers = [
    { name: '박지민', date: '2024-01-15', grade: 'bronze' },
    { name: '김서연', date: '2024-01-14', grade: 'bronze' },
    { name: '이준호', date: '2024-01-14', grade: 'bronze' },
    { name: '최유나', date: '2024-01-13', grade: 'silver' },
    { name: '정민재', date: '2024-01-12', grade: 'gold' },
  ];

  // 최근 출석 데이터
  const recentAttendance = [
    { name: '김철수', time: '10:32', type: 'GPS+QR' },
    { name: '이영희', time: '09:45', type: 'GPS+QR' },
    { name: '박민수', time: '09:12', type: 'GPS+QR' },
    { name: '최지우', time: '08:55', type: 'GPS+QR' },
    { name: '정하나', time: '08:30', type: 'GPS+QR' },
  ];

  const gradeColors: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-700',
    silver: 'bg-gray-200 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">관리자 대시보드</h1>
              <p className="text-sm text-gray-500">ITN FITNESS</p>
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
        {/* 주요 지표 카드들 (4개 가로 배치) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[metric.color]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {metric.change !== undefined && (
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {metric.change >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(metric.change)}%
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 차트 섹션 (2열 배치) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 월별 출석 추이 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                월별 출석 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-10">{data.month}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(data.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">
                      {data.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 인기 챌린지 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                인기 챌린지
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularChallenges.map((challenge) => (
                  <div key={challenge.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-700 flex-1 truncate">
                      {challenge.name}
                    </span>
                    <div className="w-32 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${challenge.color} rounded-full transition-all`}
                        style={{
                          width: `${(challenge.participants / maxParticipants) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">
                      {challenge.participants}명
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 최근 활동 테이블 (2열) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 최근 가입자 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">최근 가입자</CardTitle>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="text-primary text-xs">
                    전체보기
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.date}</div>
                      </div>
                    </div>
                    <Badge className={`text-xs ${gradeColors[member.grade]}`}>
                      {member.grade}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 최근 출석 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">최근 출석</CardTitle>
                <Link href="/admin/attendance">
                  <Button variant="ghost" size="sm" className="text-primary text-xs">
                    전체보기
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttendance.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {record.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{record.name}</div>
                        <div className="text-xs text-gray-500">{record.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 빠른 액션 버튼들 */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-1">
            관리 메뉴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
