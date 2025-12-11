// Hall of Fame Store - 인바디 및 출석 데이터 기반 자동 집계
import { HallOfFameEntry, HallOfFameCategory } from '@/types';

// 회원 데이터 (실제로는 DB에서 가져옴)
interface MemberData {
  id: string;
  name: string;
  nickname: string;
  gender: 'male' | 'female';
  profileImage?: string;
  role?: 'user' | 'staff' | 'admin'; // 직원/관리자는 명예의 전당 제외
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

// Mock 회원 데이터 (role이 없거나 'user'인 경우만 명예의 전당에 포함)
const mockMembers: MemberData[] = [
  { id: 'user-1', name: '김민수', nickname: '헬린이민수', gender: 'male', role: 'user', profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-2', name: '이영희', nickname: '근육여신', gender: 'female', role: 'user', profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-3', name: '박철수', nickname: '철수형', gender: 'male', role: 'user', profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-4', name: '정수진', nickname: '수진이', gender: 'female', role: 'user', profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-5', name: '최동훈', nickname: '동훈이', gender: 'male', role: 'user', profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-6', name: '강미라', nickname: '미라언니', gender: 'female', role: 'user', profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-7', name: '윤재호', nickname: '재호형', gender: 'male', role: 'user', profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-8', name: '한소연', nickname: '소연이', gender: 'female', role: 'user', profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-9', name: '오준혁', nickname: '준혁이', gender: 'male', role: 'user', profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
  { id: 'user-10', name: '서민정', nickname: '민정이', gender: 'female', role: 'user', profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face' },
];

// 명예의 전당 대상 회원 필터 (직원/관리자 제외)
const getEligibleMembers = (): MemberData[] => {
  return mockMembers.filter(m => !m.role || m.role === 'user');
};

// 회원 ID로 명예의 전당 대상 여부 확인
const isEligibleForHallOfFame = (memberId: string): boolean => {
  const member = mockMembers.find(m => m.id === memberId);
  return !member?.role || member.role === 'user';
};

// Mock 출석 기록 (이번 달) - 일반 회원만 대상
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // 각 회원별 랜덤 출석 기록 생성 (명예의 전당 대상 회원만)
  const attendanceCounts = [28, 26, 24, 22, 20, 18, 16, 14, 12, 10];
  const eligibleMembers = getEligibleMembers();

  eligibleMembers.forEach((member, index) => {
    const count = attendanceCounts[index] || 10;
    for (let i = 0; i < count; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      records.push({
        memberId: member.id,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        checkInTime: '09:00:00',
      });
    }
  });

  return records;
};

// Mock 인바디 기록
const generateInBodyRecords = (): { current: InBodyRecord[]; previous: InBodyRecord[] } => {
  const currentRecords: InBodyRecord[] = [
    { memberId: 'user-1', date: '2024-12-01', score: 85, skeletalMuscleMass: 35.2, bodyFatPercentage: 18.5 },
    { memberId: 'user-2', date: '2024-12-01', score: 88, skeletalMuscleMass: 28.5, bodyFatPercentage: 22.0 },
    { memberId: 'user-3', date: '2024-12-01', score: 82, skeletalMuscleMass: 38.1, bodyFatPercentage: 20.5 },
    { memberId: 'user-4', date: '2024-12-01', score: 90, skeletalMuscleMass: 26.8, bodyFatPercentage: 21.0 },
    { memberId: 'user-5', date: '2024-12-01', score: 78, skeletalMuscleMass: 40.5, bodyFatPercentage: 23.5 },
    { memberId: 'user-6', date: '2024-12-01', score: 86, skeletalMuscleMass: 25.2, bodyFatPercentage: 24.0 },
    { memberId: 'user-7', date: '2024-12-01', score: 80, skeletalMuscleMass: 36.8, bodyFatPercentage: 19.5 },
    { memberId: 'user-8', date: '2024-12-01', score: 84, skeletalMuscleMass: 24.5, bodyFatPercentage: 25.5 },
    { memberId: 'user-9', date: '2024-12-01', score: 76, skeletalMuscleMass: 42.0, bodyFatPercentage: 22.0 },
    { memberId: 'user-10', date: '2024-12-01', score: 92, skeletalMuscleMass: 27.2, bodyFatPercentage: 20.0 },
  ];

  const previousRecords: InBodyRecord[] = [
    { memberId: 'user-1', date: '2024-11-01', score: 78, skeletalMuscleMass: 33.8, bodyFatPercentage: 21.0 },
    { memberId: 'user-2', date: '2024-11-01', score: 82, skeletalMuscleMass: 27.2, bodyFatPercentage: 24.5 },
    { memberId: 'user-3', date: '2024-11-01', score: 80, skeletalMuscleMass: 37.5, bodyFatPercentage: 21.5 },
    { memberId: 'user-4', date: '2024-11-01', score: 85, skeletalMuscleMass: 26.0, bodyFatPercentage: 23.0 },
    { memberId: 'user-5', date: '2024-11-01', score: 75, skeletalMuscleMass: 39.8, bodyFatPercentage: 25.0 },
    { memberId: 'user-6', date: '2024-11-01', score: 80, skeletalMuscleMass: 24.5, bodyFatPercentage: 26.5 },
    { memberId: 'user-7', date: '2024-11-01', score: 78, skeletalMuscleMass: 36.2, bodyFatPercentage: 20.5 },
    { memberId: 'user-8', date: '2024-11-01', score: 79, skeletalMuscleMass: 24.0, bodyFatPercentage: 27.0 },
    { memberId: 'user-9', date: '2024-11-01', score: 72, skeletalMuscleMass: 41.2, bodyFatPercentage: 23.5 },
    { memberId: 'user-10', date: '2024-11-01', score: 88, skeletalMuscleMass: 26.5, bodyFatPercentage: 22.0 },
  ];

  return { current: currentRecords, previous: previousRecords };
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

// 출석왕 랭킹 계산 (직원/관리자 제외)
const calculateAttendanceRanking = (): HallOfFameEntry[] => {
  const records = generateAttendanceRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  // 회원별 출석 횟수 집계 (명예의 전당 대상 회원만)
  const attendanceCount: Record<string, number> = {};
  records.forEach((record) => {
    if (isEligibleForHallOfFame(record.memberId)) {
      attendanceCount[record.memberId] = (attendanceCount[record.memberId] || 0) + 1;
    }
  });

  // 정렬 및 랭킹
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

// 인바디왕 랭킹 계산 (종합 점수 기준, 직원/관리자 제외)
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

// 근력왕 랭킹 계산 - 남성 (골격근량 기준, 직원/관리자 제외)
const calculateMuscleRankingMale = (): HallOfFameEntry[] => {
  const { current } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  // 남성 회원만 필터링 (명예의 전당 대상만)
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

// 근력왕 랭킹 계산 - 여성 (골격근량 기준, 직원/관리자 제외)
const calculateMuscleRankingFemale = (): HallOfFameEntry[] => {
  const { current } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  // 여성 회원만 필터링 (명예의 전당 대상만)
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

// 다이어트왕 랭킹 계산 (체지방률 감소폭 기준, 직원/관리자 제외)
const calculateDietRanking = (): HallOfFameEntry[] => {
  const { current, previous } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const changes: { memberId: string; change: number }[] = [];

  current.forEach((curr) => {
    // 명예의 전당 대상 회원만 집계
    if (!isEligibleForHallOfFame(curr.memberId)) return;

    const prev = previous.find((p) => p.memberId === curr.memberId);
    if (prev) {
      const change = prev.bodyFatPercentage - curr.bodyFatPercentage; // 감소가 양수
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

// 변화왕 랭킹 계산 (인바디 점수 상승폭 기준, 직원/관리자 제외)
const calculateChangeRanking = (): HallOfFameEntry[] => {
  const { current, previous } = generateInBodyRecords();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const eligibleMembers = getEligibleMembers();

  const changes: { memberId: string; change: number }[] = [];

  current.forEach((curr) => {
    // 명예의 전당 대상 회원만 집계
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
