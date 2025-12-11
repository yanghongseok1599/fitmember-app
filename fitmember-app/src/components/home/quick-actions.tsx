'use client';

import { useRouter } from 'next/navigation';
import { QrCode, Dumbbell, Camera, Activity, MessageCircle } from 'lucide-react';

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  href?: string;
  active?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: 'attendance',
    icon: QrCode,
    label: '출석체크',
    href: '/attendance',
  },
  {
    id: 'workout',
    icon: Dumbbell,
    label: '운동기록',
    href: '/workout',
  },
  {
    id: 'post',
    icon: Camera,
    label: '인증하기',
    href: '/community',
  },
  {
    id: 'inbody',
    icon: Activity,
    label: '인바디기록',
    href: '/inbody',
  },
  {
    id: 'qna',
    icon: MessageCircle,
    label: 'Q&A',
    href: '/qna',
  },
];

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const router = useRouter();

  const handleClick = (action: QuickAction) => {
    if (action.href) {
      router.push(action.href);
    }
    onActionClick?.(action.id);
  };

  return (
    <div className="py-4">
      <div className="flex justify-between">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleClick(action)}
              className="flex flex-col items-center gap-2 transition-all hover:opacity-70 flex-1"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors border-2 ${
                action.active
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent border-[#D4C4B0] text-[#8B7355]'
              }`}>
                <Icon className="h-6 w-6 stroke-[1.5]" />
              </div>
              <span className="text-xs text-muted-foreground">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
