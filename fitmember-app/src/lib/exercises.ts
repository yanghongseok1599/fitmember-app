import { Exercise } from '@/types';

// 웨이트 운동 카테고리 타입
export type ExerciseCategory = 'chest' | 'back' | 'shoulder' | 'arm' | 'leg' | 'core' | 'cardio';

// 운동 번호 → 운동명 매핑
export const EXERCISE_LIST: Record<number, { name: string; category: ExerciseCategory }> = {
  1: { name: '멀티레이즈', category: 'shoulder' },
  2: { name: '하이랫풀', category: 'back' },
  3: { name: '친딥어시스트', category: 'arm' },
  4: { name: '랫풀다운', category: 'back' },
  5: { name: '랫풀다운&롱풀', category: 'back' },
  6: { name: '토르소', category: 'core' },
  7: { name: '시티드체스트프레스', category: 'chest' },
  8: { name: '업도미널', category: 'core' },
  9: { name: '백익스텐션', category: 'back' },
  10: { name: '풀업(행잉)', category: 'back' },
  11: { name: '시티드레그프레스', category: 'leg' },
  12: { name: '레그컬', category: 'leg' },
  13: { name: '시티드로우', category: 'back' },
  14: { name: '아웃타이이너싸이', category: 'leg' },
  15: { name: '토르소', category: 'core' },
  16: { name: '레터럴레이즈', category: 'shoulder' },
  17: { name: '암컬', category: 'arm' },
  18: { name: '숄더프레스', category: 'shoulder' },
  19: { name: '펙덱플라이', category: 'chest' },
  20: { name: '시티드레그컬', category: 'leg' },
  21: { name: '레익스텐션', category: 'leg' },
  22: { name: '토탈힙', category: 'leg' },
  23: { name: '덤벨', category: 'arm' },
  24: { name: '바벨', category: 'back' },
  25: { name: '멀티스미스', category: 'chest' },
  26: { name: '듀얼풀리', category: 'back' },
  27: { name: '멀티스미스', category: 'chest' },
  28: { name: '크로스케이블', category: 'chest' },
  29: { name: '로우로우', category: 'back' },
  30: { name: '시티드로우', category: 'back' },
  31: { name: '인클라인벤치프레스', category: 'chest' },
  32: { name: '벤치프레스(디클라인)', category: 'chest' },
  33: { name: '펙플라이', category: 'chest' },
  34: { name: '벤치프레스', category: 'chest' },
  35: { name: '멀티프레스', category: 'chest' },
  36: { name: '하이퍼익스텐션', category: 'back' },
  37: { name: '와이드리어풀다운', category: 'back' },
  38: { name: '하이로우', category: 'back' },
  39: { name: '티바로우', category: 'back' },
  40: { name: '시티드딥', category: 'arm' },
  41: { name: '핵스쿼트', category: 'leg' },
  42: { name: '45도파워레그프레스', category: 'leg' },
  43: { name: '덩키킥', category: 'leg' },
  44: { name: '스탠딩아웃싸이', category: 'leg' },
  45: { name: '립쓰러스트', category: 'leg' },
  46: { name: '브이스쿼트', category: 'leg' },
  47: { name: '버티컬레그프레스', category: 'leg' },
  48: { name: '몬스터글루트', category: 'leg' },
  49: { name: '글루트', category: 'leg' },
  50: { name: '스미스', category: 'leg' },
  51: { name: '스미스', category: 'chest' },
  52: { name: '스미스', category: 'shoulder' },
  53: { name: '스미스', category: 'back' },
  54: { name: '파워랙', category: 'leg' },
  55: { name: '파워랙', category: 'chest' },
  56: { name: '파워랙', category: 'back' },
  57: { name: 'AB스윙', category: 'core' },
};

// 전체 운동 목록 (Exercise 타입으로 변환)
export const EXERCISES: Exercise[] = Object.entries(EXERCISE_LIST).map(([num, data]) => ({
  id: `exercise-${num}`,
  name: data.name,
  category: data.category,
  description: `${data.name} 운동`,
}));

// 번호로 운동 정보 가져오기
export function getExerciseByNumber(num: number): { name: string; category: ExerciseCategory } | null {
  return EXERCISE_LIST[num] || null;
}

// 번호로 운동명만 가져오기
export function getExerciseName(num: number): string | null {
  return EXERCISE_LIST[num]?.name || null;
}

// 운동명으로 번호 가져오기
export function getExerciseNumber(name: string): number | null {
  const entry = Object.entries(EXERCISE_LIST).find(([, data]) => data.name === name);
  return entry ? parseInt(entry[0]) : null;
}

// 카테고리별 운동 목록 가져오기
export function getExercisesByCategory(category: ExerciseCategory): { num: number; name: string }[] {
  return Object.entries(EXERCISE_LIST)
    .filter(([, data]) => data.category === category)
    .map(([num, data]) => ({ num: parseInt(num), name: data.name }));
}

// 전체 운동 번호 배열
export const EXERCISE_NUMBERS = Object.keys(EXERCISE_LIST).map(Number);

// 카테고리 한글명 매핑
export const CATEGORY_NAMES: Record<ExerciseCategory, string> = {
  chest: '가슴',
  back: '등',
  shoulder: '어깨',
  arm: '팔',
  leg: '하체',
  core: '코어',
  cardio: '유산소',
};

// 카테고리별 색상 (UI용)
export const CATEGORY_COLORS: Record<ExerciseCategory, string> = {
  chest: '#ef4444', // red
  back: '#3b82f6', // blue
  shoulder: '#f97316', // orange
  arm: '#8b5cf6', // purple
  leg: '#22c55e', // green
  core: '#eab308', // yellow
  cardio: '#ec4899', // pink
};
