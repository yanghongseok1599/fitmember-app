'use client';

import { ChevronRight } from 'lucide-react';
import { Notice } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NoticesProps {
  notices: Notice[];
  onViewAll?: () => void;
  onNoticeClick?: (notice: Notice) => void;
}

export function Notices({ notices, onViewAll, onNoticeClick }: NoticesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="watermark-text mb-2">Notice</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-light">공지사항</h2>
            <span className="text-xs text-muted-foreground">(꼭 확인해주세요)</span>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          전체보기
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {notices.slice(0, 3).map((notice) => (
          <button
            key={notice.id}
            onClick={() => onNoticeClick?.(notice)}
            className="w-full flex items-center justify-between p-4 border border-border transition-all text-left hover:bg-muted/50"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{notice.title}</span>
                {notice.isNew && (
                  <span className="text-xs text-primary">NEW</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notice.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
