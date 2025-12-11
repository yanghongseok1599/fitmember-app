'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers';
import { InBodyRecord, WorkoutRecord, Mission } from '@/types';

// Mock data fetchers - 실제로는 API 호출로 대체
const fetchInBodyRecords = async (userId: string): Promise<InBodyRecord[]> => {
  // Mock implementation
  return [];
};

const fetchWorkoutRecords = async (userId: string): Promise<WorkoutRecord[]> => {
  // Mock implementation
  return [];
};

const fetchMissions = async (userId: string): Promise<Mission[]> => {
  // Mock implementation
  return [];
};

export function useUserData() {
  const { user, isLoggedIn } = useAuth();
  const [inBodyRecords, setInBodyRecords] = useState<InBodyRecord[]>([]);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoggedIn || !user) {
        setInBodyRecords([]);
        setWorkoutRecords([]);
        setMissions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [inBody, workouts, userMissions] = await Promise.all([
          fetchInBodyRecords(user.id),
          fetchWorkoutRecords(user.id),
          fetchMissions(user.id),
        ]);

        setInBodyRecords(inBody);
        setWorkoutRecords(workouts);
        setMissions(userMissions);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, isLoggedIn]);

  return {
    user,
    isLoggedIn,
    inBodyRecords,
    workoutRecords,
    missions,
    isLoading,
  };
}
