import { Mission, Notice, Challenge, User, Event } from '@/types';
import { hallOfFameCategories, getHallOfFameEntries } from './hall-of-fame-store';

// Re-export hall of fame data from the store (auto-calculated from InBody/attendance data)
export { hallOfFameCategories };
export const hallOfFameEntries = getHallOfFameEntries();

// Current user mock data
export const currentUser: User = {
  id: 'user-1',
  name: '김민수',
  nickname: '헬린이민수',
  email: 'minsu@example.com',
  phone: '010-1234-5678',
  gender: 'male',
  profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face',
  points: 2450,
  joinDate: '2024-01-15',
  centerId: 'center-1',
};

// Today's missions
export const todayMissions: Mission[] = [
  {
    id: 'mission-1',
    type: 'attendance',
    title: '출석 체크',
    description: 'QR 스캔으로 출석 체크하기',
    points: 10,
    completed: true,
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
    description: '커뮤니티',
    points: 30,
    completed: false,
    icon: '',
  },
];


// Notices
export const notices: Notice[] = [
  {
    id: 'notice-1',
    title: '1월 설 연휴 휴관 안내',
    content: '1월 28일(토) ~ 1월 30일(월)은 설 연휴로 휴관입니다.',
    type: 'holiday',
    isNew: true,
    createdAt: '2024-01-20T10:00:00Z',
    centerId: 'center-1',
  },
  {
    id: 'notice-2',
    title: '2월 신규 PT 프로그램 오픈',
    content: '2월부터 새로운 그룹 PT 프로그램이 시작됩니다. 선착순 20명!',
    type: 'event',
    isNew: true,
    createdAt: '2024-01-18T14:00:00Z',
    centerId: 'center-1',
  },
  {
    id: 'notice-3',
    title: '락커 이용 안내',
    content: '개인 락커 이용 시 자물쇠는 개인이 준비해주세요.',
    type: 'general',
    isNew: false,
    createdAt: '2024-01-15T09:00:00Z',
    centerId: 'center-1',
  },
];

// Active challenges
export const activeChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: '1월 출석왕 챌린지',
    description: '이번 달 가장 많이 출석한 회원에게 특별 리워드!',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    type: 'attendance',
    goal: 25,
    unit: '일',
    currentProgress: 18,
    participants: 156,
    myRank: 12,
    reward: 'PT 1회권 + 5,000P',
    isActive: true,
  },
  {
    id: 'challenge-2',
    title: '새해 감량 챌린지',
    description: '새해를 맞아 건강한 다이어트에 도전하세요!',
    startDate: '2024-01-01',
    endDate: '2024-02-29',
    type: 'weight_loss',
    goal: 5,
    unit: 'kg',
    currentProgress: 2.3,
    participants: 89,
    myRank: 24,
    reward: '인바디 무료 측정권 3회',
    isActive: true,
  },
];

// Active events
export const activeEvents: Event[] = [
  {
    id: 'event-1',
    title: '신규 회원 20% 할인',
    description: '2월 신규 가입 시 첫 달 이용권 20% 할인!',
    startDate: '2024-01-15',
    endDate: '2024-02-28',
    type: 'discount',
    participants: 42,
    isActive: true,
  },
  {
    id: 'event-2',
    title: '친구 추천 이벤트',
    description: '친구를 추천하면 둘 다 10,000P 적립!',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    type: 'promotion',
    participants: 78,
    isActive: true,
  },
  {
    id: 'event-3',
    title: '무료 PT 체험',
    description: '처음 오시는 분께 PT 1회 무료 체험!',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    type: 'free_trial',
    participants: 156,
    isActive: true,
  },
];

// Recent Q&A
export const recentQnA = [
  {
    id: 'qa-1',
    question: '하체 운동 후 무릎 통증이 있어요',
    isAnswered: true,
    trainerName: '김트레이너',
  },
  {
    id: 'qa-2',
    question: '단백질 섭취 타이밍이 궁금해요',
    isAnswered: true,
    trainerName: '박트레이너',
  },
];
