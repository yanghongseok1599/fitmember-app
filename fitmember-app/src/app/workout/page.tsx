'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Calendar,
  Clock,
  Flame,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Target,
  Heart,
  TrendingUp,
  Share2,
  AlertCircle,
  Upload,
  Check,
  Camera,
  X,
  Image as ImageIcon,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EXERCISE_LIST } from '@/lib/exercises';
import { inbodyStore, InBodyData } from '@/lib/inbody-store';
import { workoutStore, WorkoutRecord } from '@/lib/workout-store';
import { postStore } from '@/lib/post-store';
import { pointStore } from '@/lib/point-store';
import { useRouter } from 'next/navigation';

interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface ExerciseRecord {
  id: string;
  name: string;
  sets: WorkoutSet[];
  type: 'weight' | 'cardio';
}

interface CardioRecord {
  id: string;
  name: string;
  type: 'cardio';
  speed: number; // km/h
  duration: number; // minutes
  distance?: number; // km
}

// MET values for different exercises
const EXERCISE_MET: Record<string, number> = {
  // Weight training
  '벤치프레스': 5.0,
  '스쿼트': 6.0,
  '데드리프트': 6.0,
  '오버헤드프레스': 5.0,
  '바벨로우': 5.0,
  '덤벨컬': 4.0,
  '트라이셉 익스텐션': 4.0,
  '레그프레스': 5.0,
  '레그컬': 4.0,
  '레그익스텐션': 4.0,
  '케이블 플라이': 4.0,
  '랫풀다운': 5.0,
  '시티드 로우': 5.0,
  'default_weight': 5.0,
  // Cardio
  '러닝': 9.8,
  '걷기': 3.5,
  '사이클': 7.5,
  '에코바이크': 9.0,
  '일립티컬': 5.0,
  '로잉머신': 7.0,
  '클라임밀': 8.0,
  'default_cardio': 7.0,
};

// Calculate 1RM using Brzycki formula
const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 1) return weight;
  if (reps > 12) return weight * (1 + 0.0333 * reps); // Epley for high reps
  return weight * (36 / (37 - reps)); // Brzycki
};

// Calculate calories burned
const calculateCalories = (
  met: number,
  weightKg: number,
  durationMinutes: number
): number => {
  return (met * weightKg * durationMinutes) / 60;
};

// Get MET for running based on speed
const getRunningMET = (speedKmh: number): number => {
  if (speedKmh <= 4) return 3.5; // Walking
  if (speedKmh <= 6) return 5.0; // Light jog
  if (speedKmh <= 8) return 8.3; // Jogging
  if (speedKmh <= 10) return 9.8; // Running
  if (speedKmh <= 12) return 11.0; // Fast running
  return 12.8; // Sprint
};

export default function WorkoutPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  const [cardioRecords, setCardioRecords] = useState<CardioRecord[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCardioDialogOpen, setIsCardioDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseRecord | null>(null);
  const [editingSetIndex, setEditingSetIndex] = useState<number | null>(null);

  // InBody data
  const [inbodyData, setInbodyData] = useState<InBodyData | undefined>();

  // Form states
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('1');

  // Cardio form states
  const [cardioName, setCardioName] = useState('러닝');
  const [cardioSpeed, setCardioSpeed] = useState('');
  const [cardioDuration, setCardioDuration] = useState('');

  // Rest timer states
  const [restTime, setRestTime] = useState(90); // default 90 seconds
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string | null>(null);
  const [timerCount, setTimerCount] = useState(0); // 타이머 작동 횟수
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentExerciseIdRef = useRef<string | null>(null);
  const timerFinishedRef = useRef(false); // 타이머 완료 중복 방지용

  // Workout record states (저장 및 공유)
  const [savedRecord, setSavedRecord] = useState<WorkoutRecord | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewingPastRecord, setViewingPastRecord] = useState<WorkoutRecord | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [recordedDates, setRecordedDates] = useState<string[]>([]);

  // Photo upload states (인증 사진)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [verifyPhoto, setVerifyPhoto] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Webcam states (데스크톱용)
  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Workout start time for calorie calculation
  const [workoutStartTime] = useState(new Date());

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // Load InBody data
  useEffect(() => {
    setInbodyData(inbodyStore.getLatest());
    const unsubscribe = inbodyStore.subscribe(() => {
      setInbodyData(inbodyStore.getLatest());
    });
    return () => unsubscribe();
  }, []);

  // Load saved workout record on mount
  useEffect(() => {
    const record = workoutStore.getTodayRecord();
    if (record) {
      setSavedRecord(record);
      setExercises(record.exercises);
      setCardioRecords(record.cardioRecords);
      setTimerCount(record.timerCount);
    }
    // Load recorded dates for calendar
    setRecordedDates(workoutStore.getRecordedDates());
  }, []);

  // Auto-save workout record when exercises or cardio change
  useEffect(() => {
    if (exercises.length === 0 && cardioRecords.length === 0) return;

    const todayDate = new Date().toISOString().split('T')[0];
    const totalVolume = exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);

    const record = workoutStore.saveRecord({
      date: todayDate,
      exercises,
      cardioRecords,
      totalVolume,
      totalCalories: calculateTotalCalories(),
      timerCount,
      shared: savedRecord?.shared || false,
    });

    setSavedRecord(record);
    // Update recorded dates for calendar
    setRecordedDates(workoutStore.getRecordedDates());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercises, cardioRecords, timerCount]);

  // Handle date selection from calendar
  const handleDateSelect = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(date);
    setShowCalendar(false);

    if (date === today) {
      // Show today's editable record
      setViewingPastRecord(null);
    } else {
      // Show past record (read-only)
      const pastRecord = workoutStore.getRecordByDate(date);
      setViewingPastRecord(pastRecord || null);
    }
  };

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCalendarMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Check if a date has a workout record
  const hasWorkoutRecord = (day: number): boolean => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return recordedDates.includes(dateStr);
  };

  // Check if a date is today
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      calendarMonth.getFullYear() === today.getFullYear() &&
      calendarMonth.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };

  // Check if a date is selected
  const isSelected = (day: number): boolean => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDate === dateStr;
  };

  // Handle photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerifyPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Webcam functions (데스크톱용)
  const openWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      setWebcamStream(stream);
      setShowWebcam(true);
      // 비디오 요소에 스트림 연결
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error('웹캠 접근 실패:', error);
      alert('카메라에 접근할 수 없습니다. 브라우저 권한을 확인해주세요.');
    }
  };

  const closeWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setShowWebcam(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setVerifyPhoto(dataUrl);
        closeWebcam();
      }
    }
  };

  // Open verification dialog
  const openVerifyDialog = () => {
    if (!savedRecord) return;
    setVerifyPhoto(null);
    setVerifyMessage('');
    setShowVerifyDialog(true);
  };

  // Share workout to community (운동 인증)
  const handleShareWorkout = async () => {
    if (!savedRecord || isSharing) return;

    setIsSharing(true);
    try {
      const workoutContent = workoutStore.generateShareContent(savedRecord);
      // 추가 메시지가 있으면 운동 기록 앞에 추가
      const content = verifyMessage.trim()
        ? `${verifyMessage.trim()}\n\n${workoutContent}`
        : workoutContent;
      const images = verifyPhoto ? [verifyPhoto] : [];
      postStore.addPost(content, images, 'workout');
      workoutStore.markAsShared(savedRecord.id);

      // 운동 인증 포인트 지급 (5포인트)
      pointStore.earnPoints('user-1', 5, '운동 인증');

      setSavedRecord({ ...savedRecord, shared: true });
      setShowVerifyDialog(false);
      setVerifyPhoto(null);
      setVerifyMessage('');
      router.push('/community');
    } finally {
      setIsSharing(false);
    }
  };

  // Share workout externally (외부 공유)
  const handleExternalShare = async () => {
    if (!savedRecord) return;

    const content = workoutStore.generateShareContent(savedRecord);
    const shareData = {
      title: 'FitMember 운동 기록',
      text: content,
      url: window.location.origin,
    };

    try {
      // Web Share API 지원 확인 (모바일)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 클립보드 복사 (데스크톱)
        await navigator.clipboard.writeText(content);
        alert('운동 기록이 클립보드에 복사되었습니다!\n카카오톡, 인스타그램 등에 붙여넣기 하세요.');
      }
    } catch (error) {
      // 사용자가 공유 취소한 경우는 무시
      if ((error as Error).name !== 'AbortError') {
        // 클립보드 복사 시도
        try {
          await navigator.clipboard.writeText(content);
          alert('운동 기록이 클립보드에 복사되었습니다!');
        } catch {
          alert('공유에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  };

  // Create audio context for alarm
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Play alarm sound (plays twice)
  const playAlarm = useCallback(() => {
    const playBeep = (delay: number) => {
      setTimeout(() => {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.5;

        oscillator.start();

        // Beep pattern
        setTimeout(() => gainNode.gain.value = 0, 200);
        setTimeout(() => gainNode.gain.value = 0.5, 300);
        setTimeout(() => gainNode.gain.value = 0, 500);
        setTimeout(() => {
          oscillator.stop();
          audioContext.close();
        }, 600);
      }, delay);
    };

    // Play twice
    playBeep(0);
    playBeep(800);

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200, 300, 200, 100, 200, 100, 200]);
    }
  }, []);

  // Track if timer just finished (for auto add set)
  const [timerJustFinished, setTimerJustFinished] = useState(false);

  // Keep ref in sync with state
  useEffect(() => {
    currentExerciseIdRef.current = currentExerciseId;
  }, [currentExerciseId]);

  // Timer countdown effect
  useEffect(() => {
    if (isTimerRunning && remainingTime > 0) {
      // Reset the finished flag when timer starts
      timerFinishedRef.current = false;

      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Timer finished - use ref to prevent double execution
            if (!timerFinishedRef.current) {
              timerFinishedRef.current = true;
              setIsTimerRunning(false);
              setTimerJustFinished(true);
              setTimerCount(c => c + 1);
              playAlarm();

              // Auto add set directly here
              const exerciseId = currentExerciseIdRef.current;
              if (exerciseId) {
                setExercises(prevExercises => {
                  return prevExercises.map(exercise => {
                    if (exercise.id === exerciseId) {
                      const lastSet = exercise.sets[exercise.sets.length - 1];
                      const newSet: WorkoutSet = {
                        id: `set-${Date.now()}`,
                        weight: lastSet?.weight || 0,
                        reps: lastSet?.reps || 0,
                        completed: false,
                      };
                      return { ...exercise, sets: [...exercise.sets, newSet] };
                    }
                    return exercise;
                  });
                });
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, playAlarm]);

  const startRestTimer = (seconds?: number, exerciseId?: string) => {
    const time = seconds || restTime;
    setRemainingTime(time);
    setIsTimerRunning(true);
    setShowTimerModal(true);
    setTimerJustFinished(false);
    timerFinishedRef.current = false; // Reset ref

    // 운동 ID 설정: 전달된 값 > 현재 선택된 값 > 첫 번째 운동
    if (exerciseId) {
      setCurrentExerciseId(exerciseId);
    } else if (!currentExerciseId && exercises.length > 0) {
      // 선택된 운동이 없고 운동 목록이 있으면 첫 번째 운동 선택
      setCurrentExerciseId(exercises[0].id);
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    // If timer finished, start new timer for next set
    if (remainingTime === 0 || timerJustFinished) {
      setRemainingTime(restTime);
      setTimerJustFinished(false);
      timerFinishedRef.current = false; // Reset ref for new timer
    }
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setRemainingTime(restTime);
    timerFinishedRef.current = false;
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setRemainingTime(0);
    setTimerJustFinished(false);
    timerFinishedRef.current = false;
    setCurrentExerciseId(null);
    setShowTimerModal(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotalVolume = () => {
    return exercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
    }, 0);
  };

  const calculateTotalCalories = (): number => {
    if (!inbodyData?.weight) return 0;

    const userWeight = inbodyData.weight;
    let totalCalories = 0;

    // Weight training calories (estimate 3 min per set)
    exercises.forEach((exercise) => {
      const met = EXERCISE_MET[exercise.name] || EXERCISE_MET['default_weight'];
      const durationPerSet = 3; // minutes per set
      const totalDuration = exercise.sets.length * durationPerSet;
      totalCalories += calculateCalories(met, userWeight, totalDuration);
    });

    // Cardio calories
    cardioRecords.forEach((cardio) => {
      const met = cardio.name === '러닝' || cardio.name === '걷기'
        ? getRunningMET(cardio.speed)
        : EXERCISE_MET[cardio.name] || EXERCISE_MET['default_cardio'];
      totalCalories += calculateCalories(met, userWeight, cardio.duration);
    });

    return Math.round(totalCalories);
  };

  const handleAddExercise = () => {
    if (!exerciseName || !weight || !reps) return;

    const newSets: WorkoutSet[] = Array.from({ length: parseInt(sets) || 1 }, (_, i) => ({
      id: `set-${Date.now()}-${i}`,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      completed: false,
    }));

    const newExercise: ExerciseRecord = {
      id: `exercise-${Date.now()}`,
      name: exerciseName,
      sets: newSets,
      type: 'weight',
    };

    setExercises([...exercises, newExercise]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleAddCardio = () => {
    const speed = parseFloat(cardioSpeed) || 8.0;
    const duration = parseFloat(cardioDuration) || 30;

    const newCardio: CardioRecord = {
      id: `cardio-${Date.now()}`,
      name: cardioName,
      type: 'cardio',
      speed,
      duration,
      distance: (speed * duration) / 60,
    };

    setCardioRecords([...cardioRecords, newCardio]);
    setCardioName('러닝');
    setCardioSpeed('');
    setCardioDuration('');
    setIsCardioDialogOpen(false);
  };

  const handleEditSet = (exerciseId: string, setIndex: number) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      setEditingExercise(exercise);
      setEditingSetIndex(setIndex);
      const set = exercise.sets[setIndex];
      setWeight(set.weight.toString());
      setReps(set.reps.toString());
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateSet = () => {
    if (!editingExercise || editingSetIndex === null) return;

    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === editingExercise.id) {
        const updatedSets = [...exercise.sets];
        updatedSets[editingSetIndex] = {
          ...updatedSets[editingSetIndex],
          weight: parseFloat(weight),
          reps: parseInt(reps),
        };
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });

    setExercises(updatedExercises);
    resetForm();
    setIsEditDialogOpen(false);
    setEditingExercise(null);
    setEditingSetIndex(null);
  };

  const handleCompleteSet = (exerciseId: string, setIndex: number) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSets = [...exercise.sets];
        updatedSets[setIndex] = {
          ...updatedSets[setIndex],
          completed: !updatedSets[setIndex].completed,
        };
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    setExercises(updatedExercises);

    // Start rest timer when set is completed
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise && !exercise.sets[setIndex].completed) {
      startRestTimer(undefined, exerciseId);
    }
  };

  const handleAddSet = (exerciseId: string) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet: WorkoutSet = {
          id: `set-${Date.now()}`,
          weight: lastSet?.weight || 0,
          reps: lastSet?.reps || 0,
          completed: false,
        };
        return { ...exercise, sets: [...exercise.sets, newSet] };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const handleDeleteSet = (exerciseId: string, setIndex: number) => {
    const updatedExercises = exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    }).filter(exercise => exercise.sets.length > 0);

    setExercises(updatedExercises);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(e => e.id !== exerciseId));
  };

  const handleDeleteCardio = (cardioId: string) => {
    setCardioRecords(cardioRecords.filter(c => c.id !== cardioId));
  };

  const resetForm = () => {
    setExerciseName('');
    setWeight('');
    setReps('');
    setSets('1');
  };

  // Get best 1RM for an exercise
  const getExercise1RM = (exercise: ExerciseRecord): number => {
    let max1RM = 0;
    exercise.sets.forEach(set => {
      const estimated1RM = calculate1RM(set.weight, set.reps);
      if (estimated1RM > max1RM) max1RM = estimated1RM;
    });
    return Math.round(max1RM * 10) / 10;
  };

  // Calculate cardio calories
  const calculateCardioCalories = (cardio: CardioRecord): number => {
    if (!inbodyData?.weight) return 0;
    const met = cardio.name === '러닝' || cardio.name === '걷기'
      ? getRunningMET(cardio.speed)
      : EXERCISE_MET[cardio.name] || EXERCISE_MET['default_cardio'];
    return Math.round(calculateCalories(met, inbodyData.weight, cardio.duration));
  };

  // Calculate weight exercise calories
  const calculateExerciseCalories = (exercise: ExerciseRecord): number => {
    if (!inbodyData?.weight) return 0;
    const met = EXERCISE_MET[exercise.name] || EXERCISE_MET['default_weight'];
    const durationPerSet = 3; // minutes per set
    const totalDuration = exercise.sets.length * durationPerSet;
    return Math.round(calculateCalories(met, inbodyData.weight, totalDuration));
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="py-4 sm:py-6 border-b border-border">
        <p className="watermark-text mb-1 sm:mb-2">Workout Log</p>
        <h1 className="text-lg sm:text-xl font-light">운동 기록</h1>
      </div>

      {/* Date & Summary */}
      <div className="py-4 sm:py-6 space-y-3 sm:space-y-4">
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="text-responsive-sm">
            {viewingPastRecord
              ? new Date(viewingPastRecord.date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })
              : today}
          </span>
          <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>

        {/* 과거 기록 보기 모드 알림 */}
        {viewingPastRecord && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-blue-800">
                과거 기록을 보고 있습니다 (읽기 전용)
              </p>
              <button
                onClick={() => {
                  setViewingPastRecord(null);
                  setSelectedDate(new Date().toISOString().split('T')[0]);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                오늘로 돌아가기
              </button>
            </div>
          </div>
        )}

        {(exercises.length > 0 || cardioRecords.length > 0) && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 bg-muted/30 border border-border">
              <div className="flex items-center gap-1.5 sm:gap-2 stat-label text-muted-foreground mb-1">
                <Dumbbell className="h-3 w-3 flex-shrink-0" />
                <span>총 볼륨</span>
              </div>
              <p className="stat-value font-medium text-primary">
                {calculateTotalVolume().toLocaleString()}kg
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-muted/30 border border-border">
              <div className="flex items-center gap-1.5 sm:gap-2 stat-label text-muted-foreground mb-1">
                <Flame className="h-3 w-3 flex-shrink-0" />
                <span>소비 칼로리</span>
              </div>
              <p className="stat-value font-medium text-orange-500">
                {calculateTotalCalories()}kcal
              </p>
              {!inbodyData && (
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  인바디 정보 필요
                </p>
              )}
            </div>
          </div>
        )}

        {/* InBody Info */}
        {inbodyData && (
          <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2 sm:gap-4 flex-wrap">
            <span>체중: {inbodyData.weight}kg</span>
            {inbodyData.basalMetabolicRate && (
              <span>기초대사량: {inbodyData.basalMetabolicRate}kcal</span>
            )}
          </div>
        )}

        {/* 기록 저장 상태 & 공유 버튼 */}
        {savedRecord && (exercises.length > 0 || cardioRecords.length > 0) && !viewingPastRecord && (
          <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-green-800">
                  기록이 자동 저장되었습니다
                </p>
                <p className="text-[10px] sm:text-xs text-green-600">
                  달력에서 이전 기록을 확인할 수 있어요
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 운동 인증 버튼 (커뮤니티) */}
              <button
                onClick={openVerifyDialog}
                disabled={isSharing}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                  savedRecord.shared
                    ? "bg-[#8B7355] text-white hover:bg-[#7A6548]"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                {savedRecord.shared ? (
                  <>
                    <Camera className="h-3.5 w-3.5" />
                    추가 인증
                  </>
                ) : (
                  <>
                    <Camera className="h-3.5 w-3.5" />
                    운동 인증
                  </>
                )}
              </button>
              {/* 외부 공유 버튼 */}
              <button
                onClick={handleExternalShare}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-white border border-border text-foreground hover:bg-muted transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                공유
              </button>
            </div>
            {/* 인증 완료 표시 */}
            {savedRecord.shared && (
              <div className="flex items-center gap-1.5 text-[#8B7355]">
                <Check className="h-3.5 w-3.5" />
                <span className="text-[10px] sm:text-xs">인증 완료됨 - 추가 인증 가능</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rest Timer Button (Fixed) */}
      <button
        onClick={() => setShowTimerModal(true)}
        className={cn(
          "fixed right-3 sm:right-4 top-16 sm:top-20 z-40 p-2.5 sm:p-3 rounded-full shadow-lg transition-all",
          isTimerRunning
            ? "bg-primary text-white animate-pulse"
            : "bg-white border border-border text-muted-foreground"
        )}
      >
        <Timer className="h-4 w-4 sm:h-5 sm:w-5" />
        {isTimerRunning && (
          <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full">
            {formatTime(remainingTime)}
          </span>
        )}
      </button>

      {/* Timer Modal */}
      {showTimerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-medium">휴식 타이머</h3>
                {exercises.length > 0 && (
                  <div className="mt-1">
                    <select
                      value={currentExerciseId || ''}
                      onChange={(e) => setCurrentExerciseId(e.target.value || null)}
                      className="text-xs sm:text-sm text-muted-foreground bg-transparent border-none p-0 pr-4 focus:outline-none cursor-pointer max-w-full truncate"
                    >
                      <option value="">운동 선택 안함</option>
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name} ({ex.sets.length}세트)
                        </option>
                      ))}
                    </select>
                    {currentExerciseId && (
                      <p className="text-[10px] sm:text-xs text-primary mt-0.5">
                        타이머 완료 시 세트 자동추가
                      </p>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowTimerModal(false)}
                className="text-muted-foreground p-1 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-4 sm:mb-6">
              <div className={cn(
                "timer-display font-light mb-3 sm:mb-4",
                remainingTime === 0 && !isTimerRunning ? "text-green-500" : "text-gray-900"
              )}>
                {formatTime(remainingTime)}
              </div>
              {remainingTime === 0 && !isTimerRunning && (
                <p className="text-green-500 font-medium text-sm sm:text-base">휴식 완료! 다음 세트 시작</p>
              )}
              {/* Timer Count Display */}
              {timerCount > 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  타이머 사용 횟수: <span className="font-medium text-primary">{timerCount}회</span>
                </p>
              )}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {isTimerRunning ? (
                <button
                  onClick={pauseTimer}
                  className="p-3 sm:p-4 bg-yellow-500 text-white rounded-full"
                >
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="p-3 sm:p-4 bg-green-500 text-white rounded-full"
                >
                  <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}
              <button
                onClick={resetTimer}
                className="p-3 sm:p-4 bg-gray-200 text-gray-700 rounded-full"
              >
                <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <button
                onClick={stopTimer}
                className="p-3 sm:p-4 bg-red-500 text-white rounded-full"
              >
                <span className="h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold text-xs sm:text-sm">종료</span>
              </button>
            </div>

            {/* Rest Time Presets */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {[10, 20, 30, 60, 90].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => {
                    setRestTime(seconds);
                    startRestTimer(seconds, currentExerciseId || undefined);
                  }}
                  className={cn(
                    "py-1.5 sm:py-2 text-xs sm:text-sm rounded border transition-colors",
                    restTime === seconds && !isTimerRunning
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-border hover:border-primary"
                  )}
                >
                  {seconds}초
                </button>
              ))}
            </div>

            {/* Custom Time */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="초"
                value={restTime}
                onChange={(e) => setRestTime(parseInt(e.target.value) || 0)}
                className="flex-1 text-center text-sm sm:text-base"
              />
              <Button
                onClick={() => startRestTimer(undefined, currentExerciseId || undefined)}
                className="btn-secondary text-sm sm:text-base px-3 sm:px-4"
              >
                시작
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div className="space-y-3 sm:space-y-4 pb-32">
        {exercises.length === 0 && cardioRecords.length === 0 ? (
          <div className="py-12 sm:py-16 text-center">
            <Dumbbell className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/30 mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">오늘의 운동을 기록해보세요</p>
          </div>
        ) : (
          <>
            {/* Weight Exercises */}
            {exercises.map((exercise) => (
              <div key={exercise.id} className="border border-border">
                {/* Exercise Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-muted/30">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base truncate">{exercise.name}</h3>
                    {/* 1RM & Calories Display */}
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                        1RM: <strong className="text-primary">{getExercise1RM(exercise)}kg</strong>
                      </span>
                      {inbodyData && (
                        <span className="flex items-center gap-0.5 sm:gap-1">
                          <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                          <strong className="text-orange-500">{calculateExerciseCalories(exercise)}kcal</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="p-1 ml-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>

                {/* Sets Table */}
                <div className="divide-y divide-border">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-muted-foreground bg-muted/20">
                    <span>세트</span>
                    <span className="text-center">무게</span>
                    <span className="text-center">회수</span>
                    <span className="text-center">1RM</span>
                    <span className="text-right">완료</span>
                  </div>

                  {/* Set Rows */}
                  {exercise.sets.map((set, index) => (
                    <div
                      key={set.id}
                      className={cn(
                        "grid grid-cols-5 gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 items-center transition-colors",
                        set.completed ? "bg-green-50" : "hover:bg-muted/20"
                      )}
                    >
                      <span className="text-xs sm:text-sm">{index + 1}</span>
                      <button
                        onClick={() => handleEditSet(exercise.id, index)}
                        className="text-center text-xs sm:text-sm font-medium hover:text-primary transition-colors"
                      >
                        {set.weight}kg
                      </button>
                      <button
                        onClick={() => handleEditSet(exercise.id, index)}
                        className="text-center text-xs sm:text-sm font-medium hover:text-primary transition-colors"
                      >
                        {set.reps}회
                      </button>
                      <span className="text-center text-[10px] sm:text-xs text-muted-foreground">
                        {Math.round(calculate1RM(set.weight, set.reps))}kg
                      </span>
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleCompleteSet(exercise.id, index)}
                          className={cn(
                            "p-1 sm:p-1.5 rounded-full transition-colors text-[10px] sm:text-xs",
                            set.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          )}
                        >
                          {set.completed ? "✓" : "○"}
                        </button>
                        <button
                          onClick={() => handleDeleteSet(exercise.id, index)}
                          className="p-0.5 sm:p-1 text-muted-foreground hover:text-destructive transition-all opacity-50 hover:opacity-100"
                        >
                          <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Set Button */}
                  <button
                    onClick={() => handleAddSet(exercise.id)}
                    className="w-full py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-1 sm:gap-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    세트 추가
                  </button>
                </div>
              </div>
            ))}

            {/* Cardio Exercises */}
            {cardioRecords.length > 0 && (
              <div className="border border-border">
                <div className="p-3 sm:p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                    <h3 className="font-medium text-sm sm:text-base">유산소 운동</h3>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {cardioRecords.map((cardio) => (
                    <div key={cardio.id} className="p-3 sm:p-4 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{cardio.name}</p>
                        <div className="flex items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground flex-wrap">
                          <span>{cardio.speed}km/h</span>
                          <span>{cardio.duration}분</span>
                          {cardio.distance && (
                            <span>{cardio.distance.toFixed(2)}km</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 ml-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-medium text-orange-500">
                            {calculateCardioCalories(cardio)}kcal
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteCardio(cardio.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Buttons - Fixed */}
      <div className="fixed bottom-16 sm:bottom-20 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto flex gap-2">
          {/* Add Weight Exercise */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 btn-secondary flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-3">
                <Dumbbell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                웨이트
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto"
              onInteractOutside={(e) => e.preventDefault()}
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg font-light">웨이트 운동 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">운동명</label>
                  <select
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className="w-full p-2.5 sm:p-3 border border-border rounded-none bg-white text-sm sm:text-base"
                  >
                    <option value="">운동을 선택하세요</option>
                    {Object.entries(EXERCISE_LIST).map(([num, data]) => (
                      <option key={num} value={data.name}>
                        {num}. {data.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">무게(kg)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="rounded-none border-border text-center text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">회수</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="rounded-none border-border text-center text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">세트</label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                      className="rounded-none border-border text-center text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* 1RM Preview */}
                {weight && reps && (
                  <div className="p-2.5 sm:p-3 bg-muted/30 border border-border">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        예상 1RM
                      </span>
                      <span className="font-medium text-primary">
                        {Math.round(calculate1RM(parseFloat(weight), parseInt(reps)))}kg
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAddExercise}
                  className="w-full btn-secondary text-sm sm:text-base"
                  disabled={!exerciseName || !weight || !reps}
                >
                  추가하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Cardio Exercise */}
          <Dialog open={isCardioDialogOpen} onOpenChange={setIsCardioDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 btn-outline flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-2.5 sm:py-3">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                유산소
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto"
              onInteractOutside={(e) => e.preventDefault()}
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg font-light">유산소 운동 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">운동 종류</label>
                  <select
                    value={cardioName}
                    onChange={(e) => setCardioName(e.target.value)}
                    className="w-full p-2.5 sm:p-3 border border-border rounded-none bg-white text-sm sm:text-base"
                  >
                    <option value="러닝">러닝</option>
                    <option value="걷기">걷기</option>
                    <option value="사이클">사이클</option>
                    <option value="에코바이크">에코바이크</option>
                    <option value="일립티컬">일립티컬</option>
                    <option value="로잉머신">로잉머신</option>
                    <option value="클라임밀">클라임밀(천국의 계단)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">속도(km/h)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="8.0"
                      value={cardioSpeed}
                      onChange={(e) => setCardioSpeed(e.target.value)}
                      className="rounded-none border-border text-center text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">시간(분)</label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={cardioDuration}
                      onChange={(e) => setCardioDuration(e.target.value)}
                      className="rounded-none border-border text-center text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Distance & Calories Preview */}
                {cardioSpeed && cardioDuration && (
                  <div className="p-2.5 sm:p-3 bg-muted/30 border border-border space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">예상 거리</span>
                      <span className="font-medium">
                        {((parseFloat(cardioSpeed) * parseFloat(cardioDuration)) / 60).toFixed(2)}km
                      </span>
                    </div>
                    {inbodyData?.weight && (
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          예상 소비 칼로리
                        </span>
                        <span className="font-medium text-orange-500">
                          {Math.round(
                            calculateCalories(
                              getRunningMET(parseFloat(cardioSpeed)),
                              inbodyData.weight,
                              parseFloat(cardioDuration)
                            )
                          )}kcal
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleAddCardio}
                  className="w-full btn-secondary text-sm sm:text-base"
                >
                  추가하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Set Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className="max-w-[calc(100%-2rem)] sm:max-w-sm mx-auto"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-light">
              {editingExercise?.name} - {editingSetIndex !== null ? `${editingSetIndex + 1}세트` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">무게(kg)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="rounded-none border-border text-center text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2 block">회수</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="rounded-none border-border text-center text-sm sm:text-base"
                />
              </div>
            </div>

            {/* 1RM Preview */}
            {weight && reps && (
              <div className="p-2.5 sm:p-3 bg-muted/30 border border-border">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    예상 1RM
                  </span>
                  <span className="font-medium text-primary">
                    {Math.round(calculate1RM(parseFloat(weight), parseInt(reps)))}kg
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleUpdateSet}
              className="w-full btn-secondary text-sm sm:text-base"
            >
              수정하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Workout Verification Dialog (사진 업로드) */}
      {showVerifyDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-base sm:text-lg font-medium">운동 인증하기</h3>
              <button
                onClick={() => {
                  setShowVerifyDialog(false);
                  setVerifyPhoto(null);
                  setVerifyMessage('');
                }}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Photo Upload Section */}
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  인증 사진 (선택)
                </label>
                {/* 갤러리용 input (capture 없음) */}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                {/* 카메라용 input - iOS/Android 호환 */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {verifyPhoto ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={verifyPhoto}
                      alt="인증 사진"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setVerifyPhoto(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* 카메라/갤러리 선택 버튼 */}
                    <div className="flex gap-2">
                      <button
                        onClick={openWebcam}
                        className="flex-1 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <Camera className="h-6 w-6" />
                        <span className="text-xs sm:text-sm">카메라</span>
                      </button>
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="flex-1 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-xs sm:text-sm">갤러리</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Message Input */}
              <div>
                <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                  한마디 남기기 (선택)
                </label>
                <textarea
                  value={verifyMessage}
                  onChange={(e) => setVerifyMessage(e.target.value)}
                  placeholder="오늘 운동 어땠나요? 소감을 남겨보세요!"
                  className="w-full h-20 p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  maxLength={200}
                />
                <p className="text-[10px] text-muted-foreground text-right mt-1">
                  {verifyMessage.length}/200
                </p>
              </div>

              {/* Workout Summary */}
              <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                <p className="text-xs sm:text-sm font-medium">오늘의 운동 요약</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="h-3.5 w-3.5" />
                    {exercises.length}종목
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" />
                    {calculateTotalVolume().toLocaleString()}kg
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" />
                    {calculateTotalCalories()}kcal
                  </span>
                </div>
              </div>

              {/* Info Text */}
              <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                사진과 한마디 없이도 인증할 수 있어요
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowVerifyDialog(false);
                    setVerifyPhoto(null);
                    setVerifyMessage('');
                  }}
                  className="flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleShareWorkout}
                  disabled={isSharing}
                  className="flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSharing ? (
                    '인증 중...'
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      {verifyPhoto ? '사진과 함께 인증' : '인증하기'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webcam Modal (데스크톱용) */}
      {showWebcam && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">카메라</h3>
              <button onClick={closeWebcam} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="p-4 flex justify-center">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Camera className="h-8 w-8" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-base sm:text-lg font-medium">
                {calendarMonth.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                })}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                  <div
                    key={day}
                    className={cn(
                      "text-center text-xs font-medium py-2",
                      i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground"
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <button
                        onClick={() => {
                          const year = calendarMonth.getFullYear();
                          const month = calendarMonth.getMonth();
                          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          handleDateSelect(dateStr);
                        }}
                        className={cn(
                          "w-full h-full rounded-full flex flex-col items-center justify-center text-sm transition-colors relative",
                          isToday(day) && "bg-primary text-white",
                          isSelected(day) && !isToday(day) && "bg-primary/20 text-primary",
                          !isToday(day) && !isSelected(day) && "hover:bg-muted",
                          index % 7 === 0 && !isToday(day) && !isSelected(day) && "text-red-500",
                          index % 7 === 6 && !isToday(day) && !isSelected(day) && "text-blue-500"
                        )}
                      >
                        {day}
                        {hasWorkoutRecord(day) && (
                          <span
                            className={cn(
                              "absolute bottom-1 w-1 h-1 rounded-full",
                              isToday(day) ? "bg-white" : "bg-primary"
                            )}
                          />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Footer */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  운동 기록
                </span>
              </div>
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Past Record View Modal */}
      {viewingPastRecord && (
        <div className="fixed bottom-16 sm:bottom-20 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-lg mx-auto">
            <div className="p-4 bg-white rounded-lg border border-border shadow-lg">
              <h4 className="font-medium mb-3">
                {new Date(viewingPastRecord.date).toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                })} 운동 기록
              </h4>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 bg-muted/30 rounded">
                  <p className="text-[10px] text-muted-foreground">총 볼륨</p>
                  <p className="text-sm font-medium text-primary">{viewingPastRecord.totalVolume.toLocaleString()}kg</p>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <p className="text-[10px] text-muted-foreground">소비 칼로리</p>
                  <p className="text-sm font-medium text-orange-500">{viewingPastRecord.totalCalories}kcal</p>
                </div>
              </div>

              {/* Exercises */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {viewingPastRecord.exercises.map((exercise) => (
                  <div key={exercise.id} className="text-xs">
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {exercise.sets.length}세트 | 최대 {Math.max(...exercise.sets.map(s => s.weight))}kg
                    </span>
                  </div>
                ))}
                {viewingPastRecord.cardioRecords.map((cardio) => (
                  <div key={cardio.id} className="text-xs">
                    <span className="font-medium">{cardio.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {cardio.duration}분 | {cardio.speed}km/h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
