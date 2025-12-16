import { Mission, Notice, Challenge, User, Event } from '@/types';
import { hallOfFameCategories, getHallOfFameEntries } from './hall-of-fame-store';

// Re-export hall of fame data from the store (auto-calculated from InBody/attendance data)
export { hallOfFameCategories };
export const hallOfFameEntries = getHallOfFameEntries();

// Current user - 기본 사용자 (로그인 전)
export const currentUser: User = {
  id: 'guest',
  name: '회원',
  nickname: '',
  email: '',
  phone: '',
  gender: 'male',
  profileImage: '',
  points: 0,
  joinDate: new Date().toISOString().split('T')[0],
  centerId: 'center-1',
};

// Today's missions - 기본 미션 템플릿
export const todayMissions: Mission[] = [
  {
    id: 'mission-1',
    type: 'attendance',
    title: '출석 체크',
    description: 'QR 스캔으로 출석 체크하기',
    points: 10,
    completed: false,
    icon: '',
  },
  {
    id: 'mission-2',
    type: 'workout',
    title: '운동 기록',
    description: '1개 이상 운동 세트 기록하기',
    points: 20,
    completed: false,
    icon: '',
  },
  {
    id: 'mission-3',
    type: 'post',
    title: '인증글 작성',
    description: '커뮤니티에 인증글 올리기',
    points: 30,
    completed: false,
    icon: '',
  },
];

// Notices - 빈 배열로 초기화 (관리자가 추가)
export const notices: Notice[] = [];

// Active challenges - 샘플 데이터 (새 배너 업로드 전까지 유지)
export const activeChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '12월 출석왕 챌린지',
    description: '이번 달 가장 많이 출석한 회원에게 특별 리워드!',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    type: 'attendance',
    goal: 25,
    unit: '일',
    currentProgress: 0,
    participants: 0,
    myRank: 0,
    reward: 'PT 1회권 + 5,000P',
    isActive: true,
  },
  {
    id: 'challenge-2',
    title: '새해 감량 챌린지',
    description: '새해를 맞아 건강한 다이어트에 도전하세요!',
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    type: 'weight_loss',
    goal: 5,
    unit: 'kg',
    currentProgress: 0,
    participants: 0,
    myRank: 0,
    reward: '인바디 무료 측정권 3회',
    isActive: true,
  },
];

// Active events - 샘플 데이터 (새 배너 업로드 전까지 유지)
export const activeEvents: Event[] = [
  {
    id: 'event-1',
    title: '신규 회원 20% 할인',
    description: '1월 신규 가입 시 첫 달 이용권 20% 할인!',
    startDate: '2024-12-15',
    endDate: '2025-01-31',
    type: 'discount',
    participants: 0,
    isActive: true,
  },
  {
    id: 'event-2',
    title: '친구 추천 이벤트',
    description: '친구를 추천하면 둘 다 10,000P 적립!',
    startDate: '2024-12-01',
    endDate: '2025-03-31',
    type: 'promotion',
    participants: 0,
    isActive: true,
  },
  {
    id: 'event-3',
    title: '무료 PT 체험',
    description: '처음 오시는 분께 PT 1회 무료 체험!',
    startDate: '2024-12-01',
    endDate: '2025-01-31',
    type: 'free_trial',
    participants: 0,
    isActive: true,
  },
];

// Recent Q&A - 빈 배열로 초기화
export const recentQnA: { id: string; question: string; isAnswered: boolean; trainerName?: string }[] = [];
