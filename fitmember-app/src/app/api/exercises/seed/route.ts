import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, query } from 'firebase/firestore';
import { EXERCISE_LIST, EXERCISES } from '@/lib/exercises';

// POST: 운동 데이터를 Firebase에 시드
export async function POST() {
  try {
    const exercisesRef = collection(db, 'exercises');

    // 기존 데이터 확인
    const existingDocs = await getDocs(query(exercisesRef));
    const existingCount = existingDocs.size;

    let addedCount = 0;
    let skippedCount = 0;

    // 운동 데이터 추가
    for (const exercise of EXERCISES) {
      const exerciseNum = parseInt(exercise.id.replace('exercise-', ''));
      const docRef = doc(exercisesRef, exercise.id);

      // 운동 데이터 구조
      const exerciseData = {
        id: exercise.id,
        number: exerciseNum,
        name: exercise.name,
        category: exercise.category,
        description: exercise.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, exerciseData, { merge: true });
      addedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `운동 데이터 시드 완료`,
      data: {
        totalExercises: Object.keys(EXERCISE_LIST).length,
        addedOrUpdated: addedCount,
        previousCount: existingCount,
      },
    });
  } catch (error) {
    console.error('Exercise seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET: 현재 운동 데이터 조회
export async function GET() {
  try {
    const exercisesRef = collection(db, 'exercises');
    const snapshot = await getDocs(query(exercisesRef));

    const exercises = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json({
      success: true,
      count: exercises.length,
      exercises: exercises.sort((a, b) => (a.number || 0) - (b.number || 0)),
    });
  } catch (error) {
    console.error('Exercise fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
