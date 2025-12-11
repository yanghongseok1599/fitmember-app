'use client';

import { Check } from 'lucide-react';
import { Mission } from '@/types';
import { cn } from '@/lib/utils';

interface DailyMissionsProps {
  missions: Mission[];
  onMissionClick?: (mission: Mission) => void;
}

export function DailyMissions({ missions, onMissionClick }: DailyMissionsProps) {
  const completedCount = missions.filter(m => m.completed).length;
  const totalPoints = missions.reduce((acc, m) => acc + m.points, 0);
  const earnedPoints = missions.filter(m => m.completed).reduce((acc, m) => acc + m.points, 0);
  const allCompleted = completedCount === missions.length;
  const progress = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  // SVG 원형 프로그레스 계산
  const size = 96;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-4">
      <div>
        <p className="watermark-text">Today's Mission</p>
        <h2 className="text-lg font-light">오늘의 미션</h2>
      </div>

      <div className="flex gap-4 items-center">
        {/* Left: Circular Point Display with Progress Ring */}
        <div className="flex-shrink-0 relative w-24 h-24">
          {/* Progress Ring */}
          <svg
            width={size}
            height={size}
            className="absolute inset-0 transform -rotate-90"
          >
            {/* Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="#F9F7F4"
              stroke="#E8E4DE"
              strokeWidth={strokeWidth}
            />
            {/* Progress Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#C4A574"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-light text-[#8B7355]">{earnedPoints}P</span>
            <span className="text-xs text-[#A08B6A]">
              {allCompleted ? '완료' : '진행중'}
            </span>
          </div>
        </div>

        {/* Right: Mission List */}
        <div className="flex-1 space-y-2">
          {missions.map((mission, index) => (
            <button
              key={mission.id}
              onClick={() => onMissionClick?.(mission)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                "bg-[#F7F5F2] hover:bg-[#F0EDE8]",
                "active:scale-[0.99]"
              )}
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span className="font-medium">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{mission.title}</p>
                <p className="text-xs text-muted-foreground">{mission.description}</p>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                mission.completed
                  ? "bg-primary text-white"
                  : "border border-border"
              )}>
                {mission.completed && <Check className="h-3.5 w-3.5" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
