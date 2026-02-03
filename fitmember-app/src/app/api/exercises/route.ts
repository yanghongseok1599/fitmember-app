import { NextRequest, NextResponse } from 'next/server';
import {
  getExerciseByNumber,
  getExercisesByCategory,
  EXERCISE_LIST,
  EXERCISES,
  ExerciseCategory,
} from '@/lib/exercises';

// GET: 운동 조회
// ?number=1 -> 특정 번호 운동 조회
// ?category=chest -> 카테고리별 운동 조회
// (파라미터 없음) -> 전체 운동 목록
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const number = searchParams.get('number');
    const category = searchParams.get('category');

    // 번호로 특정 운동 조회
    if (number) {
      const num = parseInt(number);
      const exercise = getExerciseByNumber(num);

      if (!exercise) {
        return NextResponse.json(
          {
            success: false,
            error: `운동 번호 ${num}을(를) 찾을 수 없습니다.`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        exercise: {
          number: num,
          ...exercise,
        },
      });
    }

    // 카테고리별 운동 조회
    if (category) {
      const validCategories: ExerciseCategory[] = ['chest', 'back', 'shoulder', 'arm', 'leg', 'core', 'cardio'];

      if (!validCategories.includes(category as ExerciseCategory)) {
        return NextResponse.json(
          {
            success: false,
            error: `유효하지 않은 카테고리: ${category}. 유효한 카테고리: ${validCategories.join(', ')}`,
          },
          { status: 400 }
        );
      }

      const exercises = getExercisesByCategory(category as ExerciseCategory);

      return NextResponse.json({
        success: true,
        category,
        count: exercises.length,
        exercises,
      });
    }

    // 전체 운동 목록 반환
    const allExercises = Object.entries(EXERCISE_LIST).map(([num, data]) => ({
      number: parseInt(num),
      name: data.name,
      category: data.category,
    }));

    return NextResponse.json({
      success: true,
      count: allExercises.length,
      exercises: allExercises,
    });
  } catch (error) {
    console.error('Exercise API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
