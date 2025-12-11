// Point management store

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'use';
  amount: number;
  description: string;
  createdAt: string;
  // For point usage verification
  verificationCode?: string;
  status?: 'pending' | 'completed' | 'expired';
  staffId?: string;
}

export interface PointUsageRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  verificationCode: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'completed' | 'expired';
}

// Initial mock transactions
const initialTransactions: PointTransaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    type: 'earn',
    amount: 10,
    description: '출석 체크',
    createdAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    type: 'earn',
    amount: 20,
    description: '운동 기록',
    createdAt: '2024-01-19T18:00:00Z',
  },
  {
    id: 'tx-3',
    userId: 'user-1',
    type: 'earn',
    amount: 30,
    description: '인증글 작성',
    createdAt: '2024-01-18T20:00:00Z',
  },
  {
    id: 'tx-4',
    userId: 'user-1',
    type: 'use',
    amount: -500,
    description: '음료 구매',
    createdAt: '2024-01-17T15:00:00Z',
    status: 'completed',
  },
];

let transactions: PointTransaction[] = [...initialTransactions];
let pendingRequests: PointUsageRequest[] = [];
let userPoints: Record<string, number> = { 'user-1': 2450 };
let listeners: (() => void)[] = [];

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const pointStore = {
  // Get user's current points
  getPoints: (userId: string): number => {
    return userPoints[userId] || 0;
  },

  // Get user's transaction history
  getTransactions: (userId: string): PointTransaction[] => {
    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // Earn points (from missions, etc.)
  earnPoints: (userId: string, amount: number, description: string): PointTransaction => {
    const transaction: PointTransaction = {
      id: `tx-${Date.now()}`,
      userId,
      type: 'earn',
      amount,
      description,
      createdAt: new Date().toISOString(),
    };

    transactions.push(transaction);
    userPoints[userId] = (userPoints[userId] || 0) + amount;
    listeners.forEach(l => l());

    return transaction;
  },

  // Create point usage request (generates QR code data)
  createUsageRequest: (userId: string, userName: string, amount: number): PointUsageRequest | null => {
    const currentPoints = userPoints[userId] || 0;
    if (amount > currentPoints || amount <= 0) {
      return null;
    }

    const verificationCode = generateVerificationCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    const request: PointUsageRequest = {
      id: `req-${Date.now()}`,
      userId,
      userName,
      amount,
      verificationCode,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'pending',
    };

    pendingRequests.push(request);
    listeners.forEach(l => l());

    return request;
  },

  // Get pending request by verification code
  getPendingRequest: (verificationCode: string): PointUsageRequest | null => {
    const request = pendingRequests.find(
      r => r.verificationCode === verificationCode && r.status === 'pending'
    );

    if (!request) return null;

    // Check if expired
    if (new Date() > new Date(request.expiresAt)) {
      request.status = 'expired';
      listeners.forEach(l => l());
      return null;
    }

    return request;
  },

  // Confirm point usage (staff action)
  confirmUsage: (verificationCode: string, staffId: string): boolean => {
    const request = pendingRequests.find(
      r => r.verificationCode === verificationCode && r.status === 'pending'
    );

    if (!request) return false;

    // Check if expired
    if (new Date() > new Date(request.expiresAt)) {
      request.status = 'expired';
      listeners.forEach(l => l());
      return false;
    }

    // Deduct points
    const currentPoints = userPoints[request.userId] || 0;
    if (request.amount > currentPoints) {
      return false;
    }

    userPoints[request.userId] = currentPoints - request.amount;

    // Record transaction
    const transaction: PointTransaction = {
      id: `tx-${Date.now()}`,
      userId: request.userId,
      type: 'use',
      amount: -request.amount,
      description: '포인트 사용',
      createdAt: new Date().toISOString(),
      verificationCode,
      status: 'completed',
      staffId,
    };

    transactions.push(transaction);
    request.status = 'completed';

    listeners.forEach(l => l());
    return true;
  },

  // Cancel pending request
  cancelRequest: (requestId: string): void => {
    pendingRequests = pendingRequests.filter(r => r.id !== requestId);
    listeners.forEach(l => l());
  },

  // Get user's pending requests
  getUserPendingRequests: (userId: string): PointUsageRequest[] => {
    return pendingRequests.filter(r => r.userId === userId && r.status === 'pending');
  },

  subscribe: (listener: () => void): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
