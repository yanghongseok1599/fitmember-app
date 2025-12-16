// Hall of Fame Store - 인바디 및 출석 데이터 기반 자동 집계
import { HallOfFameEntry, HallOfFameCategory } from '@/types';

// 회원 데이터 (실제로는 DB에서 가져옴)
interface MemberData {
  id: string;
  name: string;
  nickname: string;
  gender: 'male' | 'female';
  profileImage?: string;
  role?: 'user' | 'staff' | 'admin';
}

// 출석 기록 (실제로는 DB에서 가져옴)
interface AttendanceRecord {
  memberId: string;
  date: string;
  checkInTime: string;
}

// 인바디 기록 (실제로는 DB에서 가져옴)
interface InBodyRecord {
  memberId: string;
  date: string;
  score: number;
  skeletalMuscleMass: number;
  bodyFatPercentage: number;
}

// 회원 데이터 - 빈 배열 (실제 데이터는 DB에서 가져옴)
const mockMembers: MemberData[] = [];

// 명예의 전당 대상 회원 필터 (직원/관리자 제외)
const getEligibleMembers = (): MemberData[] => {
  return mockMembers.filter(m => !m.role || m.role === 'user');
};

// 회원 ID로 명예의 전당 대상 여부 확인
const isEligibleForHallOfFame = (memberId: string): boolean => {
  const member = mockMembers.find(m => m.id === memberId);
  return !member?.role || member.role === 'user';
};

// 출석 기록 - 빈 배열
const generateAttendanceRecords = (): AttendanceRecord[] => {
  return [];
};

// 인바디 기록 - 빈 배열
const generateInBodyRecords = (): { current: InBodyRecord[]; previous: InBodyRecord[] } => {
  return { current: [], previous: [] };
};

// 명예의 전당 카테고리
export const hallOfFameCategories: HallOfFameCategory[] = [
  { id: 'attendance', name: '출석왕', icon: '', description: '월간 출석 횟수' },
  { id: 'inbody', name: '인바디왕', icon: '', description: '인바디 종합 점수' },
  { id: 'muscle-male', name: '근력왕(남)', icon: '', description: '골격근량 최고 (남성)' },
  { id: 'muscle-female', name: '근력왕(여)', icon: '', description: '골격근량 최고 (여성)' },
  { id: 'diet', name: '다이어트왕', icon: '', description: '체지방률 감소폭' },
  { id: 'change', name: '변화왕', icon: '', description: '인바디 점수 상승폭' },
];

// 닉네임 반환 (닉네임이 없으면 실명 반환)
const getDisplayName = (member: MemberData): string => {
  if (member.nickname) return member.nickname;
  return member.name;
};

// 출석왕 랭킹 계산
const calculateAttendanceRanking = (): HallOfFameEntry[] => {
  const records = generateAttendanceRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const attendanceCount: Record<string, number> = {};
  records.forEach((record) => {
    if (isEligibleForHallOfFame(record.memberId)) {
      attendanceCount[record.memberId] = (attendanceCount[record.memberId] || 0) + 1;
    }
  });

  const sorted = Object.entries(attendanceCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return sorted.map(([memberId, count], index) => {
    const member = eligibleMembers.find((m) => m.id === memberId);
    return {
      id: `attendance-${memberId}`,
      userId: memberId,
      userName: member ? getDisplayName(member) : '알수없음',
      userImage: member?.profileImage,
      category: 'attendance' as const,
      rank: index + 1,
      value: count,
      unit: '일',
      month,
    };
  });
};

// 인바디왕 랭킹 계산
const calculateInBodyRanking = (): HallOfFameEntry[] => {
  const { current } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const sorted = [...current]
    .filter((r) => r.score != null && isEligibleForHallOfFame(r.memberId))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return sorted.map((record, index) => {
    const member = eligibleMembers.find((m) => m.id === record.memberId);
    return {
      id: `inbody-${record.memberId}`,
      userId: record.memberId,
      userName: member ? getDisplayName(member) : '알수없음',
      userImage: member?.profileImage,
      category: 'inbody' as const,
      rank: index + 1,
      value: record.score,
      unit: '점',
      month,
    };
  });
};

// 근력왕 랭킹 계산 - 남성
const calculateMuscleRankingMale = (): HallOfFameEntry[] => {
  const { current } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const maleMembers = eligibleMembers.filter((m) => m.gender === 'male');
  const maleMemberIds = maleMembers.map((m) => m.id);

  const sorted = [...current]
    .filter((r) => maleMemberIds.includes(r.memberId) && isEligibleForHallOfFame(r.memberId))
    .sort((a, b) => b.skeletalMuscleMass - a.skeletalMuscleMass)
    .slice(0, 10);

  return sorted.map((record, index) => {
    const member = eligibleMembers.find((m) => m.id === record.memberId);
    return {
      id: `muscle-male-${record.memberId}`,
      userId: record.memberId,
      userName: member ? getDisplayName(member) : '알수없음',
      userImage: member?.profileImage,
      category: 'muscle-male' as const,
      rank: index + 1,
      value: record.skeletalMuscleMass,
      unit: 'kg',
      month,
    };
  });
};

// 근력왕 랭킹 계산 - 여성
const calculateMuscleRankingFemale = (): HallOfFameEntry[] => {
  const { current } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const femaleMembers = eligibleMembers.filter((m) => m.gender === 'female');
  const femaleMemberIds = femaleMembers.map((m) => m.id);

  const sorted = [...current]
    .filter((r) => femaleMemberIds.includes(r.memberId) && isEligibleForHallOfFame(r.memberId))
    .sort((a, b) => b.skeletalMuscleMass - a.skeletalMuscleMass)
    .slice(0, 10);

  return sorted.map((record, index) => {
    const member = eligibleMembers.find((m) => m.id === record.memberId);
    return {
      id: `muscle-female-${record.memberId}`,
      userId: record.memberId,
      userName: member ? getDisplayName(member) : '알수없음',
      userImage: member?.profileImage,
      category: 'muscle-female' as const,
      rank: index + 1,
      value: record.skeletalMuscleMass,
      unit: 'kg',
      month,
    };
  });
};

// 다이어트왕 랭킹 계산
const calculateDietRanking = (): HallOfFameEntry[] => {
  const { current, previous } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const changes: { memberId: string; change: number }[] = [];

  current.forEach((curr) => {
    if (!isEligibleForHallOfFame(curr.memberId)) return;

    const prev = previous.find((p) => p.memberId === curr.memberId);
    if (prev) {
      const change = prev.bodyFatPercentage - curr.bodyFatPercentage;
      if (change > 0) {
        changes.push({ memberId: curr.memberId, change });
      }
    }
  });

  const sorted = changes.sort((a, b) => b.change - a.change).slice(0, 10);

  return sorted.map((item, index) => {
    const member = eligibleMembers.find((m) => m.id === item.memberId);
    return {
      id: `diet-${item.memberId}`,
      userId: item.memberId,
      userName: member ? getDisplayName(member) : '알수없음',
      userImage: member?.profileImage,
      category: 'diet' as const,
      rank: index + 1,
      value: Math.round(item.change * 10) / 10,
      unit: '%↓',
      month,
    };
  });
};

// 변화왕 랭킹 계산
const calculateChangeRanking = (): HallOfFameEntry[] => {
  const { current, previous } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const changes: { memberId: string; change: number }[] = [];

  current.forEach((curr) => {
    if (!isEligibleForHallOfFame(curr.memberId)) return;

    const prev = previous.find((p) => p.memberId === curr.memberId);
    if (prev && curr.score != null && prev.score != null) {
      const change = curr.score - prev.score;
      if (change > 0) {
        changes.push({ memberId: curr.memberId, change });
      }
    }
  });

  const sorted = changes.sort((a, b) => b.change - a.change).slice(0, 10);

  return sorted.map((item, index) => {
    const member = eligibleMembers.find((m) => m.id === item.memberId);
    return {
      id: `change-${item.memberId}`,
      userId: item.memberId,
      userName: member ? getDisplayName(member) : '알수없음',
      userImage: member?.profileImage,
      category: 'change' as const,
      rank: index + 1,
      value: item.change,
      unit: '점↑',
      month,
    };
  });
};

// 전체 명예의 전당 데이터 가져오기
export const getHallOfFameEntries = (): HallOfFameEntry[] => {
  return [
    ...calculateAttendanceRanking(),
    ...calculateInBodyRanking(),
    ...calculateMuscleRankingMale(),
    ...calculateMuscleRankingFemale(),
    ...calculateDietRanking(),
    ...calculateChangeRanking(),
  ];
};

// 특정 카테고리의 랭킹 가져오기
export const getRankingByCategory = (
  category: HallOfFameEntry['category']
): HallOfFameEntry[] => {
  switch (category) {
    case 'attendance':
      return calculateAttendanceRanking();
    case 'inbody':
      return calculateInBodyRanking();
    case 'muscle-male':
      return calculateMuscleRankingMale();
    case 'muscle-female':
      return calculateMuscleRankingFemale();
    case 'diet':
      return calculateDietRanking();
    case 'change':
      return calculateChangeRanking();
    default:
      return [];
  }
};

// 현재 사용자의 랭킹 가져오기
export const getMyRanking = (
  userId: string,
  category: HallOfFameEntry['category']
): HallOfFameEntry | undefined => {
  const rankings = getRankingByCategory(category);
  return rankings.find((entry) => entry.userId === userId);
};
