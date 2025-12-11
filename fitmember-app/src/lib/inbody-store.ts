// Simple in-memory store for InBody records

export interface InBodyData {
  id: string;
  date: string;
  weight: number;           // 체중 (kg)
  skeletalMuscleMass: number; // 골격근량 (kg)
  bodyFatMass: number;      // 체지방량 (kg)
  bodyFatPercentage: number; // 체지방률 (%)
  bmi: number;              // BMI
  basalMetabolicRate?: number; // 기초대사량 (kcal)
  totalBodyWater?: number;  // 체수분 (L)
  protein?: number;         // 단백질 (kg)
  minerals?: number;        // 무기질 (kg)
  visceralFatLevel?: number; // 내장지방레벨
  score?: number;           // 인바디 점수
  imageUrl?: string;        // 원본 이미지
  createdAt: string;
}

// Initial mock data
const initialRecords: InBodyData[] = [
  {
    id: 'inbody-1',
    date: '2024-01-15',
    weight: 75.5,
    skeletalMuscleMass: 33.2,
    bodyFatMass: 15.8,
    bodyFatPercentage: 20.9,
    bmi: 24.1,
    basalMetabolicRate: 1680,
    totalBodyWater: 43.5,
    protein: 11.8,
    minerals: 3.8,
    visceralFatLevel: 8,
    score: 78,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'inbody-2',
    date: '2024-01-01',
    weight: 77.2,
    skeletalMuscleMass: 32.8,
    bodyFatMass: 17.2,
    bodyFatPercentage: 22.3,
    bmi: 24.7,
    basalMetabolicRate: 1650,
    totalBodyWater: 42.8,
    protein: 11.5,
    minerals: 3.7,
    visceralFatLevel: 9,
    score: 74,
    createdAt: '2024-01-01T09:00:00Z',
  },
];

let records: InBodyData[] = [...initialRecords];
let listeners: (() => void)[] = [];

export const inbodyStore = {
  getRecords: (): InBodyData[] => {
    return [...records].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getLatest: (): InBodyData | undefined => {
    const sorted = inbodyStore.getRecords();
    return sorted[0];
  },

  addRecord: (data: Omit<InBodyData, 'id' | 'createdAt'>): InBodyData => {
    const newRecord: InBodyData = {
      ...data,
      id: `inbody-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    records = [newRecord, ...records];
    listeners.forEach(listener => listener());
    return newRecord;
  },

  deleteRecord: (id: string): void => {
    records = records.filter(r => r.id !== id);
    listeners.forEach(listener => listener());
  },

  subscribe: (listener: () => void): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
