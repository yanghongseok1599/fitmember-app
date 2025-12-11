'use client';

import { useState } from 'react';
import { ChevronLeft, Bell, Calendar, Gift, Dumbbell, Trophy, MessageCircle, Check, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'event' | 'workout' | 'challenge' | 'message' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const notificationTypeConfig = {
  event: { icon: Gift, color: 'bg-purple-500' },
  workout: { icon: Dumbbell, color: 'bg-blue-500' },
  challenge: { icon: Trophy, color: 'bg-yellow-500' },
  message: { icon: MessageCircle, color: 'bg-green-500' },
  system: { icon: Bell, color: 'bg-gray-500' },
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'event',
    title: '12월 특가 이벤트 시작!',
    content: '운동용품 최대 50% 할인 이벤트가 시작되었습니다.',
    isRead: false,
    createdAt: new Date().toISOString(),
    link: '/store',
  },
  {
    id: 'notif-2',
    type: 'challenge',
    title: '출석왕 챌린지 순위 업데이트',
    content: '현재 12위입니다. 조금만 더 힘내세요!',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'workout',
    title: '오늘의 운동 기록을 남겨보세요',
    content: '꾸준한 기록이 성장의 비결입니다.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: '/workout',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: '새로운 공지사항이 등록되었습니다',
    content: '12월 휴관일 안내를 확인해주세요.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    link: '/notices',
  },
  {
    id: 'notif-5',
    type: 'message',
    title: '트레이너님이 답변을 남겼습니다',
    content: '질문하신 내용에 대한 답변이 등록되었습니다.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="watermark-text">Notifications</p>
                <h1 className="text-xl font-light">알림</h1>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Check className="h-4 w-4" />
                모두 읽음
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notification List */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>알림이 없습니다.</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = notificationTypeConfig[notification.type];
            const Icon = config.icon;

            return (
              <div
                key={notification.id}
                className={cn(
                  'bg-card border border-border rounded-lg overflow-hidden transition-colors',
                  !notification.isRead && 'border-l-4 border-l-primary'
                )}
              >
                <button
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.color)}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('font-medium truncate', !notification.isRead && 'text-foreground')}>
                          {notification.title}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {notification.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </p>
                    </div>
                  </div>
                </button>
                <div className="border-t border-border px-4 py-2 flex justify-end">
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    삭제
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Info Section */}
        <div className="bg-white rounded-lg border border-border p-4 mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">알림 설정</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 이벤트, 챌린지, 운동 기록 등의 알림을 받습니다.</li>
            <li>• 알림 설정은 마이페이지 &gt; 설정에서 변경할 수 있습니다.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
