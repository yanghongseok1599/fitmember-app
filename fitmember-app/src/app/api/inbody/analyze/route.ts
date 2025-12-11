import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Check base64 data size (Gemini API limit is approximately 4MB for base64 encoded image)
    // Base64 encoding increases size by ~33%, so we check for ~3MB raw data
    const base64SizeInBytes = (base64Data.length * 3) / 4;
    const maxSizeInBytes = 3.5 * 1024 * 1024; // 3.5MB (안전 마진 포함)
    
    if (base64SizeInBytes > maxSizeInBytes) {
      console.error(`Image too large: ${(base64SizeInBytes / 1024 / 1024).toFixed(2)}MB`);
      return NextResponse.json(
        { error: '이미지가 너무 큽니다. 더 작은 이미지를 선택해주세요.' },
        { status: 400 }
      );
    }

    console.log(`Image size: ${(base64SizeInBytes / 1024 / 1024).toFixed(2)}MB`);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `이 이미지는 인바디(InBody) 체성분 분석 결과지입니다.
이미지에서 다음 데이터를 정확히 추출해서 JSON 형식으로 반환해주세요.
숫자만 추출하고, 단위는 제외해주세요. 값을 찾을 수 없으면 null로 표시해주세요.

필수 항목:
- weight: 체중 (kg)
- skeletalMuscleMass: 골격근량 (kg)
- bodyFatMass: 체지방량 (kg)
- bodyFatPercentage: 체지방률 (%)
- bmi: BMI

선택 항목 (있으면 포함):
- basalMetabolicRate: 기초대사량 (kcal)
- totalBodyWater: 체수분 (L)
- protein: 단백질 (kg)
- minerals: 무기질 (kg)
- visceralFatLevel: 내장지방레벨 (숫자)
- score: 인바디 점수

JSON만 반환하고 다른 텍스트는 포함하지 마세요.
예시:
{
  "weight": 75.5,
  "skeletalMuscleMass": 33.2,
  "bodyFatMass": 15.8,
  "bodyFatPercentage": 20.9,
  "bmi": 24.1,
  "basalMetabolicRate": 1680,
  "totalBodyWater": 43.5,
  "protein": 11.8,
  "minerals": 3.8,
  "visceralFatLevel": 8,
  "score": 78
}`;

    let result;
    try {
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
      ]);
    } catch (apiError: any) {
      console.error('Gemini generateContent error:', apiError);
      
      // Gemini API의 에러 메시지 확인
      const errorMessage = apiError?.message || apiError?.toString() || '';
      if (errorMessage.includes('too large') || errorMessage.includes('Image was too large') || errorMessage.includes('400')) {
        throw new Error('Image was too large');
      }
      throw apiError;
    }

    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse InBody data' }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Gemini API 에러 메시지 확인
    let errorMessage = '이미지 분석 중 오류가 발생했습니다.';
    let statusCode = 500;
    
    const errorStr = error?.message || error?.toString() || '';
    
    if (errorStr.includes('too large') || errorStr.includes('Image was too large') || errorStr.includes('400')) {
      errorMessage = '이미지가 너무 큽니다. 더 작은 이미지를 선택해주세요.';
      statusCode = 400;
    } else if (errorStr.includes('quota') || errorStr.includes('rate limit') || errorStr.includes('429')) {
      errorMessage = 'API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.';
      statusCode = 429;
    } else if (errorStr.includes('403') || errorStr.includes('permission')) {
      errorMessage = 'API 접근 권한이 없습니다. 설정을 확인해주세요.';
      statusCode = 403;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
