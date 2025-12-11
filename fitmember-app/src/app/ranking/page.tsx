'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, Trophy, Medal, Award, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  hallOfFameCategories,
  getRankingByCategory,
  getMyRanking,
} from '@/lib/hall-of-fame-store';
import { HallOfFameEntry } from '@/types';

const CURRENT_USER_ID = 'user-1'; // 현재 사용자 ID (실제로는 auth에서 가져옴)

function RankingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || hallOfFameCategories[0]?.id || 'attendance'
  );
  const [rankings, setRankings] = useState<HallOfFameEntry[]>([]);
  const [myRanking, setMyRanking] = useState<HallOfFameEntry | undefined>();

  useEffect(() => {
    // 카테고리에 맞는 랭킹 데이터 로드
    const data = getRankingByCategory(selectedCategory as HallOfFameEntry['category']);
    setRankings(data.slice(0, 10)); // Top 10

    // 내 랭킹 확인
    const myRank = getMyRanking(CURRENT_USER_ID, selectedCategory as HallOfFameEntry['category']);
    setMyRanking(myRank);
  }, [selectedCategory]);

  const getCategoryInfo = (categoryId: string) => {
    return hallOfFameCategories.find((c) => c.id === categoryId);
  };

  const currentCategory = getCategoryInfo(selectedCategory);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return (
          <div className="relative">
            <Medal className="h-5 w-5 text-gray-400" />
            <span className="absolute -bottom-1 -right-1 text-[10px] font-bold text-gray-500">2</span>
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <Award className="h-5 w-5 text-amber-600" />
            <span className="absolute -bottom-1 -right-1 text-[10px] font-bold text-amber-700">3</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-[#F7F5F2] border-transparent';
    }
  };

  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-lg font-medium">명예의 전당</h1>
            <p className="text-xs text-muted-foreground">
              {currentCategory?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {hallOfFameCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                selectedCategory === category.id
                  ? 'bg-[#8B5A2B] text-white'
                  : 'bg-white border border-border text-gray-600 hover:border-[#8B5A2B]'
              )}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* My Ranking Card */}
        {myRanking && (
          <div className="bg-white rounded-xl border border-primary/30 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">내 순위</p>
                <p className="text-lg font-medium text-gray-900">
                  {myRanking.rank}위
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">기록</p>
                <p className="text-lg font-medium text-primary">
                  {myRanking.value}
                  {myRanking.unit}
                </p>
              </div>
            </div>
          </div>
        )}

        {!myRanking && (
          <div className="bg-white rounded-xl border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">
              아직 이 카테고리에 기록이 없습니다
            </p>
          </div>
        )}

        {/* Top 10 Rankings */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-900">TOP 10</h2>

          {rankings.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <p className="text-muted-foreground">랭킹 데이터가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rankings.map((entry) => (
                <div
                  key={entry.id}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border transition-all',
                    getRankBackground(entry.rank),
                    entry.userId === CURRENT_USER_ID && 'ring-2 ring-primary'
                  )}
                >
                  {/* Rank */}
                  <div className="w-10 flex items-center justify-center">
                    {getRankIcon(entry.rank) || (
                      <span className="text-lg font-bold text-muted-foreground">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.userImage} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                      {entry.userName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <div className="flex-1">
                    <p
                      className={cn(
                        'font-medium',
                        entry.userId === CURRENT_USER_ID
                          ? 'text-primary'
                          : 'text-gray-900'
                      )}
                    >
                      {entry.userName}
                      {entry.userId === CURRENT_USER_ID && (
                        <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                          나
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <span
                      className={cn(
                        'text-lg font-bold',
                        entry.rank <= 3 ? 'text-primary' : 'text-gray-900'
                      )}
                    >
                      {entry.value}
                    </span>
                    <span className="text-sm text-muted-foreground ml-0.5">
                      {entry.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl border border-border p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">안내사항</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 랭킹은 매월 1일에 초기화됩니다.</li>
            <li>• 출석왕: 월간 출석 횟수 기준</li>
            <li>• 인바디왕: 인바디 종합 점수 기준</li>
            <li>• 근력왕(남/여): 성별별 골격근량 기준</li>
            <li>• 다이어트왕: 체지방률 감소폭 기준</li>
            <li>• 변화왕: 인바디 점수 상승폭 기준</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function RankingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-muted flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <RankingContent />
    </Suspense>
  );
}
