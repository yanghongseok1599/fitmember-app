// 운동 기록 저장소 - localStorage 기반, 24시간 후 자동 삭제

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface ExerciseRecord {
  id: string;
  name: string;
  sets: WorkoutSet[];
  type: 'weight' | 'cardio';
}

export interface CardioRecord {
  id: string;
  name: string;
  type: 'cardio';
  speed: number;
  duration: number;
  distance?: number;
}

export interface WorkoutRecord {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  exercises: ExerciseRecord[];
  cardioRecords: CardioRecord[];
  totalVolume: number;
  totalCalories: number;
  timerCount: number;
  shared: boolean; // 커뮤니티 공유 여부
}

const STORAGE_KEY = 'fitmember_workout_records';
const EXPIRY_HOURS = 24;

// localStorage에서 기록 불러오기
const loadRecords = (): WorkoutRecord[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// localStorage에 기록 저장
const saveRecords = (records: WorkoutRecord[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save workout records:', e);
  }
};

// 24시간 지난 기록 삭제
const cleanupExpiredRecords = (): WorkoutRecord[] => {
  const records = loadRecords();
  const now = new Date().getTime();
  const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000;

  const validRecords = records.filter(record => {
    const recordTime = new Date(record.createdAt).getTime();
    return (now - recordTime) < expiryMs;
  });

  if (validRecords.length !== records.length) {
    saveRecords(validRecords);
  }

  return validRecords;
};

let listeners: (() => void)[] = [];

export const workoutStore = {
  // 모든 기록 가져오기 (만료된 기록 자동 정리)
  getRecords: (): WorkoutRecord[] => {
    return cleanupExpiredRecords().sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // 오늘 기록 가져오기
  getTodayRecord: (): WorkoutRecord | undefined => {
    const today = new Date().toISOString().split('T')[0];
    const records = cleanupExpiredRecords();
    return records.find(r => r.date === today);
  },

  // 특정 날짜 기록 가져오기
  getRecordByDate: (date: string): WorkoutRecord | undefined => {
    const records = cleanupExpiredRecords();
    return records.find(r => r.date === date);
  },

  // 기록 저장/업데이트
  saveRecord: (record: Omit<WorkoutRecord, 'id' | 'createdAt'>): WorkoutRecord => {
    const records = cleanupExpiredRecords();

    // 같은 날짜 기록이 있으면 업데이트
    const existingIndex = records.findIndex(r => r.date === record.date);

    const newRecord: WorkoutRecord = {
      ...record,
      id: existingIndex >= 0 ? records[existingIndex].id : `workout-${Date.now()}`,
      createdAt: existingIndex >= 0 ? records[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      records[existingIndex] = newRecord;
    } else {
      records.push(newRecord);
    }

    saveRecords(records);
    listeners.forEach(listener => listener());
    return newRecord;
  },

  // 기록 삭제
  deleteRecord: (recordId: string): void => {
    const records = cleanupExpiredRecords();
    const filtered = records.filter(r => r.id !== recordId);
    saveRecords(filtered);
    listeners.forEach(listener => listener());
  },

  // 공유 상태 업데이트
  markAsShared: (recordId: string): void => {
    const records = loadRecords();
    const updated = records.map(r =>
      r.id === recordId ? { ...r, shared: true } : r
    );
    saveRecords(updated);
    listeners.forEach(listener => listener());
  },

  // 남은 시간 계산 (밀리초)
  getTimeRemaining: (record: WorkoutRecord): number => {
    const createdAt = new Date(record.createdAt).getTime();
    const expiryTime = createdAt + (EXPIRY_HOURS * 60 * 60 * 1000);
    const remaining = expiryTime - Date.now();
    return Math.max(0, remaining);
  },

  // 남은 시간 포맷팅
  formatTimeRemaining: (record: WorkoutRecord): string => {
    const remaining = workoutStore.getTimeRemaining(record);
    if (remaining <= 0) return '만료됨';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 남음`;
    }
    return `${minutes}분 남음`;
  },

  // 운동 기록을 공유용 텍스트로 변환
  generateShareContent: (record: WorkoutRecord): string => {
    const lines: string[] = [];

    // 날짜
    const date = new Date(record.date);
    const dateStr = date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
    lines.push(`📅 ${dateStr} 운동 기록`);
    lines.push('');

    // 웨이트 운동
    if (record.exercises.length > 0) {
      lines.push('💪 웨이트 운동');
      record.exercises.forEach(exercise => {
        const totalSets = exercise.sets.length;
        const completedSets = exercise.sets.filter(s => s.completed).length;
        const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
        const totalReps = exercise.sets.reduce((sum, s) => sum + s.reps, 0);
        lines.push(`• ${exercise.name}: ${completedSets}/${totalSets}세트 | 최대 ${maxWeight}kg | 총 ${totalReps}회`);
      });
      lines.push('');
    }

    // 유산소 운동
    if (record.cardioRecords.length > 0) {
      lines.push('❤️ 유산소 운동');
      record.cardioRecords.forEach(cardio => {
        lines.push(`• ${cardio.name}: ${cardio.duration}분 | ${cardio.speed}km/h | ${cardio.distance?.toFixed(2)}km`);
      });
      lines.push('');
    }

    // 요약
    lines.push('📊 오늘의 요약');
    lines.push(`• 총 볼륨: ${record.totalVolume.toLocaleString()}kg`);
    lines.push(`• 소비 칼로리: ${record.totalCalories}kcal`);
    if (record.timerCount > 0) {
      lines.push(`• 세트 완료: ${record.timerCount}회`);
    }

    return lines.join('\n');
  },

  // 구독
  subscribe: (listener: () => void): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
