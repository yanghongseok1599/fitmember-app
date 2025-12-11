// User types
export interface User {
  id: string;
  name: string;
  realName?: string; // 실제 실명 (가입 시 입력)
  nickname: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  profileImage?: string;
  points: number;
  joinDate: string;
  centerId: string;
}

// Mission types
export interface Mission {
  id: string;
  type: 'attendance' | 'workout' | 'post';
  title: string;
  description: string;
  points: number;
  completed: boolean;
  icon: string;
}

// Hall of Fame types
export interface HallOfFameEntry {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  category: 'attendance' | 'inbody' | 'muscle-male' | 'muscle-female' | 'diet' | 'change';
  rank: number;
  value: number;
  unit: string;
  month: string;
}

export type HallOfFameCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  gender?: 'male' | 'female';
};

// Notice types
export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'holiday';
  isNew: boolean;
  createdAt: string;
  centerId: string;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'attendance' | 'weight_loss' | 'muscle_gain' | 'custom';
  goal: number;
  unit: string;
  currentProgress: number;
  participants: number;
  myRank?: number;
  reward: string;
  isActive: boolean;
}

// Workout types
export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'shoulder' | 'arm' | 'leg' | 'core' | 'cardio';
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: WorkoutSet[];
  }[];
  totalVolume: number;
  duration: number;
}

// Community types
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
  workoutRecordId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
}

// Q&A types
export interface Question {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  category: string;
  isAnswered: boolean;
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  trainerId: string;
  trainerName: string;
  trainerImage?: string;
  content: string;
  createdAt: string;
}

// InBody types
export interface InBodyRecord {
  id: string;
  userId: string;
  date: string;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  bodyFatPercentage: number;
  bmi: number;
  score: number;
}

// Consultation types
export interface Consultation {
  id: string;
  userId: string;
  type: 'body_analysis' | 'ot' | 'pt';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  requestedDate: string;
  confirmedDate?: string;
  notes?: string;
  createdAt: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'discount' | 'free_trial' | 'promotion' | 'special';
  participants: number;
  imageUrl?: string;
  isActive: boolean;
}

// Store Banner types
export interface StoreBanner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl: string;
  category: 'special' | 'correction' | 'exercise' | 'health' | 'food';
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
}

// Extended user profile
export interface UserProfile extends User {
  birthDate?: string;
  membershipGrade: 'bronze' | 'silver' | 'gold' | 'platinum';
  membershipStartDate: string;
  membershipEndDate?: string;
  authProvider?: 'email' | 'google' | 'kakao';
  role?: 'user' | 'staff' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
}
