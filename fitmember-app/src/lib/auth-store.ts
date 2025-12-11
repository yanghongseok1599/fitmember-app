// Authentication store for managing login state
import { UserProfile } from '@/types';

// Mock user profile data
const createMockUser = (
  email: string,
  realName: string, // 실제 실명 (가입 시 입력)
  nickname: string,
  provider: 'email' | 'google' | 'kakao',
  role: 'user' | 'staff' | 'admin' = 'user',
  displayName?: string // 소셜 로그인 시 표시되는 이름 (구글 계정명 등)
): UserProfile => ({
  id: `user-${Date.now()}`,
  name: displayName || realName, // 표시용 이름
  realName, // 실제 실명
  nickname,
  email,
  phone: '',
  gender: 'male',
  profileImage: undefined,
  points: 0,
  joinDate: new Date().toISOString().split('T')[0],
  centerId: 'center-1',
  birthDate: undefined,
  membershipGrade: 'bronze',
  membershipStartDate: new Date().toISOString().split('T')[0],
  membershipEndDate: undefined,
  authProvider: provider,
  role,
  status: 'active',
  lastLoginAt: new Date().toISOString(),
});

// Demo user for testing
const demoUser: UserProfile = {
  id: 'user-1',
  name: '김민수',
  realName: '김민수', // 실제 실명
  nickname: '헬린이민수',
  email: 'minsu@example.com',
  phone: '010-1234-5678',
  gender: 'male',
  profileImage: undefined,
  points: 2450,
  joinDate: '2023-06-15',
  centerId: 'center-1',
  birthDate: '1990-05-20',
  membershipGrade: 'gold',
  membershipStartDate: '2023-06-15',
  membershipEndDate: '2024-06-15',
  authProvider: 'email',
  role: 'user',
  status: 'active',
  lastLoginAt: '2024-01-15T09:30:00',
};

// Admin user for testing
const adminUser: UserProfile = {
  id: 'admin-1',
  name: '관리자',
  realName: '관리자', // 실제 실명
  nickname: '관리자',
  email: 'admin@fitmember.com',
  phone: '010-0000-0000',
  gender: 'male',
  profileImage: undefined,
  points: 0,
  joinDate: '2023-01-01',
  centerId: 'center-1',
  birthDate: '1985-01-01',
  membershipGrade: 'platinum',
  membershipStartDate: '2023-01-01',
  membershipEndDate: undefined,
  authProvider: 'email',
  role: 'admin',
  status: 'active',
  lastLoginAt: new Date().toISOString(),
};

// Staff user for testing
const staffUser: UserProfile = {
  id: 'staff-1',
  name: '홍직원',
  realName: '홍직원',
  nickname: '직원홍',
  email: 'staff@fitmember.com',
  phone: '010-1111-1111',
  gender: 'male',
  profileImage: undefined,
  points: 500,
  joinDate: '2023-06-01',
  centerId: 'center-1',
  birthDate: '1992-03-15',
  membershipGrade: 'gold',
  membershipStartDate: '2023-06-01',
  membershipEndDate: undefined,
  authProvider: 'email',
  role: 'staff',
  status: 'active',
  lastLoginAt: new Date().toISOString(),
};

interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
}

interface PendingSocialRegistration {
  provider: 'google' | 'kakao';
  email: string;
  displayName?: string; // 소셜 로그인에서 가져온 표시 이름 (구글 계정명 등)
}

let state: AuthState = {
  isLoggedIn: false,
  user: null,
};

let pendingSocialRegistration: PendingSocialRegistration | null = null;

let listeners: (() => void)[] = [];

// Simulated registered users (in real app, this would be a database)
const registeredUsers: Map<string, { password?: string; user: UserProfile }> = new Map([
  ['minsu@example.com', { password: 'password123', user: demoUser }],
  ['admin@fitmember.com', { password: 'admin123', user: adminUser }],
  ['staff@fitmember.com', { password: 'staff123', user: staffUser }],
]);

// Export all users for admin dashboard
export const getAllUsers = (): UserProfile[] => {
  return Array.from(registeredUsers.values()).map(r => r.user);
};

// Get user by email (for NextAuth callback)
export const getUserByEmail = (email: string): UserProfile | null => {
  const registered = registeredUsers.get(email);
  return registered ? registered.user : null;
};

// Login user by email (for social login - no password needed)
export const loginByEmail = (email: string): boolean => {
  const registered = registeredUsers.get(email);
  if (!registered) return false;

  state = {
    isLoggedIn: true,
    user: registered.user,
  };
  listeners.forEach((l) => l());
  return true;
};

export const authStore = {
  getState: (): AuthState => state,

  isLoggedIn: (): boolean => state.isLoggedIn,

  getUser: (): UserProfile | null => state.user,

  // Email login
  loginWithEmail: (email: string, password: string): { success: boolean; error?: string } => {
    const registered = registeredUsers.get(email);

    if (!registered) {
      return { success: false, error: '등록되지 않은 이메일입니다.' };
    }

    if (registered.password !== password) {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' };
    }

    state = {
      isLoggedIn: true,
      user: registered.user,
    };
    listeners.forEach((l) => l());
    return { success: true };
  },

  // Google login - initiate (returns needsRegistration if new user)
  loginWithGoogle: async (): Promise<{ success: boolean; needsRegistration?: boolean; error?: string }> => {
    // In real app, this would integrate with Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const email = 'google.user@gmail.com';

    // Check if user already registered
    const existing = registeredUsers.get(email);
    if (existing) {
      state = {
        isLoggedIn: true,
        user: existing.user,
      };
      listeners.forEach((l) => l());
      return { success: true };
    }

    // New user - needs registration
    pendingSocialRegistration = {
      provider: 'google',
      email,
    };
    return { success: true, needsRegistration: true };
  },

  // Kakao login - initiate (returns needsRegistration if new user)
  loginWithKakao: async (): Promise<{ success: boolean; needsRegistration?: boolean; error?: string }> => {
    // In real app, this would integrate with Kakao OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const email = 'kakao.user@kakao.com';

    // Check if user already registered
    const existing = registeredUsers.get(email);
    if (existing) {
      state = {
        isLoggedIn: true,
        user: existing.user,
      };
      listeners.forEach((l) => l());
      return { success: true };
    }

    // New user - needs registration
    pendingSocialRegistration = {
      provider: 'kakao',
      email,
    };
    return { success: true, needsRegistration: true };
  },

  // Get pending social registration data
  getPendingSocialRegistration: (): PendingSocialRegistration | null => {
    return pendingSocialRegistration;
  },

  // Clear pending social registration
  clearPendingSocialRegistration: (): void => {
    pendingSocialRegistration = null;
  },

  // Set pending social registration with display name (from NextAuth callback)
  setPendingSocialRegistration: (
    provider: 'google' | 'kakao',
    email: string,
    displayName?: string
  ): void => {
    pendingSocialRegistration = { provider, email, displayName };
  },

  // Complete social registration with additional info
  completeSocialRegistration: async (
    realName: string, // 사용자가 입력한 실제 실명
    nickname: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!pendingSocialRegistration) {
      return { success: false, error: '소셜 인증 정보가 없습니다.' };
    }

    const { provider, email, displayName } = pendingSocialRegistration;

    // Create new user - realName은 사용자가 입력한 실명, displayName은 소셜 계정 이름
    const newUser = createMockUser(email, realName, nickname, provider, 'user', displayName);
    newUser.points = 100; // Welcome bonus

    // Save to registered users
    registeredUsers.set(email, { user: newUser });

    // Login the user
    state = {
      isLoggedIn: true,
      user: newUser,
    };

    // Clear pending registration
    pendingSocialRegistration = null;

    listeners.forEach((l) => l());
    return { success: true };
  },

  // Email registration
  registerWithEmail: (
    email: string,
    password: string,
    realName: string, // 사용자가 입력한 실제 실명
    nickname: string,
    phone?: string
  ): { success: boolean; error?: string } => {
    if (registeredUsers.has(email)) {
      return { success: false, error: '이미 가입된 이메일입니다.' };
    }

    // 이메일 가입 시 realName이 곧 표시 이름이 됨
    const newUser = createMockUser(email, realName, nickname, 'email');
    newUser.phone = phone || '';
    newUser.points = 100; // Welcome bonus

    registeredUsers.set(email, { password, user: newUser });

    state = {
      isLoggedIn: true,
      user: newUser,
    };
    listeners.forEach((l) => l());
    return { success: true };
  },

  logout: (): void => {
    state = {
      isLoggedIn: false,
      user: null,
    };
    pendingSocialRegistration = null;
    listeners.forEach((l) => l());
  },

  updateProfile: (updates: Partial<UserProfile>): void => {
    if (state.user) {
      state.user = { ...state.user, ...updates };

      // Update in registered users if email login
      if (state.user.authProvider === 'email') {
        const registered = registeredUsers.get(state.user.email);
        if (registered) {
          registered.user = state.user;
        }
      }

      listeners.forEach((l) => l());
    }
  },

  // Check if email is already registered
  isEmailRegistered: (email: string): boolean => {
    return registeredUsers.has(email);
  },

  subscribe: (listener: () => void): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};
