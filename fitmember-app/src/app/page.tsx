'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import {
  UserHeader,
  QuickActions,
  DailyMissions,
  HallOfFame,
  Notices,
  ActiveChallenges,
  ActiveEvents,
  BlogLinkBanner,
} from '@/components/home';
import {
  currentUser,
  todayMissions,
  hallOfFameCategories,
  hallOfFameEntries,
  notices,
  activeChallenges,
  activeEvents,
} from '@/lib/mock-data';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 센터 선택 여부 확인
    const centerSelected = localStorage.getItem('centerSelected');
    if (!centerSelected) {
      router.replace('/select-center');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // 로딩 중일 때 스플래시 표시
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F7F4] to-white flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-white">ITN</span>
        </div>
        <h1 className="text-xl font-light text-gray-900 mb-2">FitMember</h1>
        <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
      </div>
    );
  }

  return (
    <AppLayout>
      {/* User Header */}
      <UserHeader
        user={currentUser}
        hasNotifications={true}
        onNotificationClick={() => router.push('/notifications')}
        onProfileClick={() => router.push('/mypage')}
      />

      <div className="space-y-8 py-6">
        {/* Quick Actions */}
        <QuickActions
          onActionClick={(actionId) => console.log('Action:', actionId)}
        />

        {/* Daily Missions */}
        <DailyMissions
          missions={todayMissions}
          onMissionClick={(mission) => console.log('Mission:', mission.id)}
        />

        {/* Challenge & Event - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          <ActiveChallenges
            challenges={activeChallenges}
            onViewAll={() => console.log('View all challenges')}
            onChallengeClick={(challenge) => console.log('Challenge:', challenge.id)}
          />
          <ActiveEvents
            events={activeEvents}
            onViewAll={() => console.log('View all events')}
            onEventClick={(event) => console.log('Event:', event.id)}
          />
        </div>

        {/* Hall of Fame */}
        <HallOfFame
          categories={hallOfFameCategories}
          entries={hallOfFameEntries}
          onViewAll={() => console.log('View all rankings')}
        />

        {/* Blog Link Banner - 네이버 블로그 링크 */}
        <BlogLinkBanner />

        {/* Notices */}
        <Notices
          notices={notices}
          onViewAll={() => router.push('/notices')}
          onNoticeClick={() => router.push('/notices')}
        />
      </div>
    </AppLayout>
  );
}
