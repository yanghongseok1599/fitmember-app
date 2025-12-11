'use client';

import { useState } from 'react';
import { ChevronLeft, Bell, Calendar, Megaphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Notice } from '@/types';
import { notices } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const noticeTypeConfig = {
  general: { label: '일반', icon: Bell, color: 'bg-gray-500' },
  event: { label: '이벤트', icon: Megaphone, color: 'bg-blue-500' },
  holiday: { label: '휴관', icon: Calendar, color: 'bg-red-500' },
};

export default function NoticesPage() {
  const router = useRouter();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  if (selectedNotice) {
    const config = noticeTypeConfig[selectedNotice.type];
    const Icon = config.icon;

    return (
      <div className="min-h-screen bg-muted pb-24">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-medium">공지사항</h1>
            </div>
          </div>
        </header>

        {/* Notice Detail */}
        <main className="max-w-lg mx-auto px-4 py-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className={cn('px-2 py-1 text-xs text-white rounded', config.color)}>
                  {config.label}
                </span>
                {selectedNotice.isNew && (
                  <span className="text-xs text-primary font-medium">NEW</span>
                )}
              </div>
              <h2 className="text-xl font-medium">{selectedNotice.title}</h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(selectedNotice.createdAt), 'yyyy년 M월 d일 HH:mm', { locale: ko })}
              </p>
            </div>
            <div className="border-t border-border p-6">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {selectedNotice.content}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="watermark-text">Notice</p>
              <h1 className="text-xl font-light">공지사항</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Notice List */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        {notices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          notices.map((notice) => {
            const config = noticeTypeConfig[notice.type];
            const Icon = config.icon;

            return (
              <button
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="w-full bg-card border border-border rounded-lg p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.color)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{notice.title}</span>
                      {notice.isNew && (
                        <span className="text-xs text-primary font-medium flex-shrink-0">NEW</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notice.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notice.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </main>
    </div>
  );
}
