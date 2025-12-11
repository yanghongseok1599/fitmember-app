'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Bell,
  Moon,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Smartphone,
  Mail,
  MessageSquare,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authStore } from '@/lib/auth-store';

interface SettingToggle {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<SettingToggle[]>([
    {
      id: 'push',
      label: '푸시 알림',
      description: '앱 푸시 알림을 받습니다',
      enabled: true,
    },
    {
      id: 'email',
      label: '이메일 알림',
      description: '이메일로 소식을 받습니다',
      enabled: false,
    },
    {
      id: 'sms',
      label: 'SMS 알림',
      description: '문자로 중요 알림을 받습니다',
      enabled: true,
    },
    {
      id: 'marketing',
      label: '마케팅 수신 동의',
      description: '이벤트, 프로모션 정보를 받습니다',
      enabled: false,
    },
  ]);

  const [darkMode, setDarkMode] = useState(false);

  const handleToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      // Logout from both NextAuth and local authStore
      authStore.logout();
      await signOut({ callbackUrl: '/' });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        '정말 탈퇴하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.'
      )
    ) {
      // In real app, this would call API
      authStore.logout();
      await signOut({ callbackUrl: '/' });
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div>
        <p className="watermark-text mb-1">Settings</p>
        <h1 className="text-xl font-light">설정</h1>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-900">알림 설정</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between px-4 py-4"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.label}
                </p>
                {notification.description && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {notification.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleToggle(notification.id)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative',
                  notification.enabled ? 'bg-primary' : 'bg-gray-200'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                    notification.enabled ? 'left-5' : 'left-0.5'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-900">화면 설정</h2>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">다크 모드</p>
            <p className="text-xs text-gray-500 mt-0.5">
              어두운 테마를 사용합니다
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              'w-11 h-6 rounded-full transition-colors relative',
              darkMode ? 'bg-primary' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                darkMode ? 'left-5' : 'left-0.5'
              )}
            />
          </button>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-900">개인정보 및 보안</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <span className="text-sm text-gray-700">비밀번호 변경</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <span className="text-sm text-gray-700">로그인 기록</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <span className="text-sm text-gray-700">개인정보 처리방침</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-900">앱 정보</h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-4">
            <span className="text-sm text-gray-700">앱 버전</span>
            <span className="text-sm text-gray-500">1.0.0</span>
          </div>
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <span className="text-sm text-gray-700">이용약관</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <span className="text-sm text-gray-700">오픈소스 라이선스</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleDeleteAccount}
        >
          회원탈퇴
        </Button>
      </div>
    </div>
  );
}
