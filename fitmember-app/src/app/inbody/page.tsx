'use client';

import { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Camera,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Loader2,
  X,
  Check,
  BarChart3,
  GitCompare,
  Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { inbodyStore, InBodyData } from '@/lib/inbody-store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type ChartMetric = 'weight' | 'skeletalMuscleMass' | 'bodyFatMass' | 'bodyFatPercentage';

const metricLabels: Record<ChartMetric, string> = {
  weight: '체중',
  skeletalMuscleMass: '골격근량',
  bodyFatMass: '체지방량',
  bodyFatPercentage: '체지방률',
};

const metricUnits: Record<ChartMetric, string> = {
  weight: 'kg',
  skeletalMuscleMass: 'kg',
  bodyFatMass: 'kg',
  bodyFatPercentage: '%',
};

const metricColors: Record<ChartMetric, string> = {
  weight: '#C4A574',
  skeletalMuscleMass: '#22c55e',
  bodyFatMass: '#ef4444',
  bodyFatPercentage: '#3b82f6',
};

type InputMode = 'photo' | 'manual';

interface ManualFormData {
  weight: string;
  skeletalMuscleMass: string;
  bodyFatMass: string;
  bodyFatPercentage: string;
  bmi: string;
  basalMetabolicRate: string;
  totalBodyWater: string;
  protein: string;
  minerals: string;
  visceralFatLevel: string;
  score: string;
}

const initialManualForm: ManualFormData = {
  weight: '',
  skeletalMuscleMass: '',
  bodyFatMass: '',
  bodyFatPercentage: '',
  bmi: '',
  basalMetabolicRate: '',
  totalBodyWater: '',
  protein: '',
  minerals: '',
  visceralFatLevel: '',
  score: '',
};

export default function InBodyPage() {
  const [records, setRecords] = useState<InBodyData[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('photo');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<Partial<InBodyData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual input state
  const [manualForm, setManualForm] = useState<ManualFormData>(initialManualForm);

  // Chart state
  const [showChart, setShowChart] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('weight');

  // Compare state
  const [showCompare, setShowCompare] = useState(false);
  const [compareDate1, setCompareDate1] = useState<string>('');
  const [compareDate2, setCompareDate2] = useState<string>('');

  useEffect(() => {
    setRecords(inbodyStore.getRecords());
    const unsubscribe = inbodyStore.subscribe(() => {
      setRecords(inbodyStore.getRecords());
    });
    return () => unsubscribe();
  }, []);

  // Set default compare dates when records change
  useEffect(() => {
    if (records.length >= 2) {
      setCompareDate1(records[0].date);
      setCompareDate2(records[1].date);
    } else if (records.length === 1) {
      setCompareDate1(records[0].date);
      setCompareDate2(records[0].date);
    }
  }, [records]);

  const compressImage = (file: File, maxWidth: number = 1600, maxHeight: number = 1600, maxSizeInMB: number = 3.5): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // 이미지 크기 조정
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          const compress = (quality: number): string => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Canvas context not available');
            }

            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL('image/jpeg', quality);
          };

          // 품질을 낮춰가며 크기 체크 (최소 0.3까지)
          let quality = 0.7;
          let dataUrl = compress(quality);
          let dataUrlSize = (dataUrl.length * 3) / 4 / 1024 / 1024; // MB

          while (dataUrlSize > maxSizeInMB && quality > 0.3) {
            quality -= 0.1;
            dataUrl = compress(quality);
            dataUrlSize = (dataUrl.length * 3) / 4 / 1024 / 1024;
          }

          // 여전히 크면 이미지 크기 자체를 더 줄임
          if (dataUrlSize > maxSizeInMB) {
            width = Math.floor(width * 0.8);
            height = Math.floor(height * 0.8);
            dataUrl = compress(0.5);
          }

          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('이미지 파일이 너무 큽니다. 10MB 이하의 파일을 선택해주세요.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setError(null);
      // 이미지 압축
      const compressedImage = await compressImage(file);
      setSelectedImage(compressedImage);
      setAnalyzedData(null);
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.');
      console.error('Image compression error:', err);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/inbody/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '이미지 분석 중 오류가 발생했습니다.');
      }

      setAnalyzedData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!analyzedData) return;

    const today = new Date().toISOString().split('T')[0];

    inbodyStore.addRecord({
      date: today,
      weight: analyzedData.weight || 0,
      skeletalMuscleMass: analyzedData.skeletalMuscleMass || 0,
      bodyFatMass: analyzedData.bodyFatMass || 0,
      bodyFatPercentage: analyzedData.bodyFatPercentage || 0,
      bmi: analyzedData.bmi || 0,
      basalMetabolicRate: analyzedData.basalMetabolicRate,
      totalBodyWater: analyzedData.totalBodyWater,
      protein: analyzedData.protein,
      minerals: analyzedData.minerals,
      visceralFatLevel: analyzedData.visceralFatLevel,
      score: analyzedData.score,
      imageUrl: selectedImage || undefined,
    });

    setShowUpload(false);
    setSelectedImage(null);
    setAnalyzedData(null);
  };

  const handleCancel = () => {
    setShowUpload(false);
    setSelectedImage(null);
    setAnalyzedData(null);
    setError(null);
    setInputMode('photo');
    setManualForm(initialManualForm);
  };

  const handleManualFormChange = (field: keyof ManualFormData, value: string) => {
    setManualForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleManualSave = () => {
    // Validate required fields
    if (!manualForm.weight || !manualForm.skeletalMuscleMass || !manualForm.bodyFatMass || !manualForm.bodyFatPercentage) {
      setError('필수 항목(체중, 골격근량, 체지방량, 체지방률)을 입력해주세요.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    inbodyStore.addRecord({
      date: today,
      weight: parseFloat(manualForm.weight) || 0,
      skeletalMuscleMass: parseFloat(manualForm.skeletalMuscleMass) || 0,
      bodyFatMass: parseFloat(manualForm.bodyFatMass) || 0,
      bodyFatPercentage: parseFloat(manualForm.bodyFatPercentage) || 0,
      bmi: parseFloat(manualForm.bmi) || 0,
      basalMetabolicRate: manualForm.basalMetabolicRate ? parseFloat(manualForm.basalMetabolicRate) : undefined,
      totalBodyWater: manualForm.totalBodyWater ? parseFloat(manualForm.totalBodyWater) : undefined,
      protein: manualForm.protein ? parseFloat(manualForm.protein) : undefined,
      minerals: manualForm.minerals ? parseFloat(manualForm.minerals) : undefined,
      visceralFatLevel: manualForm.visceralFatLevel ? parseFloat(manualForm.visceralFatLevel) : undefined,
      score: manualForm.score ? parseFloat(manualForm.score) : undefined,
    });

    setShowUpload(false);
    setManualForm(initialManualForm);
    setError(null);
    setInputMode('photo');
  };

  const latest = records[0];
  const previous = records[1];

  const getChange = (current: number, prev: number) => {
    const diff = current - prev;
    if (Math.abs(diff) < 0.1) return { icon: Minus, color: 'text-muted-foreground', value: '0' };
    if (diff > 0) return { icon: TrendingUp, color: 'text-green-500', value: `+${diff.toFixed(1)}` };
    return { icon: TrendingDown, color: 'text-red-500', value: diff.toFixed(1) };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  // Prepare chart data (reversed to show oldest first)
  const chartData = [...records].reverse().map((record) => ({
    date: formatShortDate(record.date),
    fullDate: record.date,
    weight: record.weight,
    skeletalMuscleMass: record.skeletalMuscleMass,
    bodyFatMass: record.bodyFatMass,
    bodyFatPercentage: record.bodyFatPercentage,
  }));

  // Get comparison records
  const record1 = records.find(r => r.date === compareDate1);
  const record2 = records.find(r => r.date === compareDate2);

  const getCompareChange = (val1: number, val2: number) => {
    const diff = val1 - val2;
    if (Math.abs(diff) < 0.1) return { color: 'text-gray-500', value: '0', arrow: '' };
    if (diff > 0) return { color: 'text-green-500', value: `+${diff.toFixed(1)}`, arrow: '↑' };
    return { color: 'text-red-500', value: diff.toFixed(1), arrow: '↓' };
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="py-6 border-b border-border">
        <p className="watermark-text mb-2">InBody</p>
        <h1 className="text-xl font-light">인바디 기록</h1>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="max-w-lg mx-auto px-4 py-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <button onClick={handleCancel} className="p-2 -ml-2">
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-light">인바디 기록 추가</h2>
              <div className="w-9" />
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setInputMode('photo')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-colors",
                  inputMode === 'photo'
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-border text-gray-700 hover:border-primary"
                )}
              >
                <Camera className="h-4 w-4" />
                <span className="text-sm font-medium">사진 분석</span>
              </button>
              <button
                onClick={() => setInputMode('manual')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-colors",
                  inputMode === 'manual'
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-border text-gray-700 hover:border-primary"
                )}
              >
                <Edit3 className="h-4 w-4" />
                <span className="text-sm font-medium">수기 입력</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {/* Manual Input Mode */}
              {inputMode === 'manual' && (
                <div className="space-y-6">
                  {/* Required Fields */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">필수 항목</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">체중 (kg) *</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="70.0"
                          value={manualForm.weight}
                          onChange={(e) => handleManualFormChange('weight', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">골격근량 (kg) *</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="30.0"
                          value={manualForm.skeletalMuscleMass}
                          onChange={(e) => handleManualFormChange('skeletalMuscleMass', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">체지방량 (kg) *</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="15.0"
                          value={manualForm.bodyFatMass}
                          onChange={(e) => handleManualFormChange('bodyFatMass', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">체지방률 (%) *</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="20.0"
                          value={manualForm.bodyFatPercentage}
                          onChange={(e) => handleManualFormChange('bodyFatPercentage', e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Fields */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">선택 항목</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">BMI</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="22.0"
                          value={manualForm.bmi}
                          onChange={(e) => handleManualFormChange('bmi', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">기초대사량 (kcal)</label>
                        <Input
                          type="number"
                          placeholder="1500"
                          value={manualForm.basalMetabolicRate}
                          onChange={(e) => handleManualFormChange('basalMetabolicRate', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">체수분 (L)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="40.0"
                          value={manualForm.totalBodyWater}
                          onChange={(e) => handleManualFormChange('totalBodyWater', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">단백질 (kg)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="10.0"
                          value={manualForm.protein}
                          onChange={(e) => handleManualFormChange('protein', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">무기질 (kg)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="3.5"
                          value={manualForm.minerals}
                          onChange={(e) => handleManualFormChange('minerals', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">내장지방 레벨</label>
                        <Input
                          type="number"
                          placeholder="5"
                          value={manualForm.visceralFatLevel}
                          onChange={(e) => handleManualFormChange('visceralFatLevel', e.target.value)}
                          className="h-11"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 mb-1 block">인바디 점수</label>
                        <Input
                          type="number"
                          placeholder="75"
                          value={manualForm.score}
                          onChange={(e) => handleManualFormChange('score', e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-sm">
                      {error}
                    </div>
                  )}

                  <Button onClick={handleManualSave} className="w-full btn-primary">
                    저장하기
                  </Button>
                </div>
              )}

              {/* Photo Mode */}
              {inputMode === 'photo' && !selectedImage && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[3/4] border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium mb-1">인바디 결과지 촬영</p>
                      <p className="text-sm text-muted-foreground">
                        사진을 촬영하거나 갤러리에서 선택하세요
                      </p>
                    </div>
                  </button>
                  <p className="text-xs text-center text-gray-400">
                    AI가 자동으로 데이터를 분석합니다
                  </p>
                </div>
              )}

              {inputMode === 'photo' && selectedImage && (
                <div className="space-y-6">
                  <div className="relative aspect-[3/4] bg-muted rounded-sm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedImage}
                      alt="InBody result"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setAnalyzedData(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-sm">
                      {error}
                    </div>
                  )}

                  {!analyzedData && !isAnalyzing && (
                    <Button onClick={handleAnalyze} className="w-full btn-secondary">
                      AI로 데이터 분석하기
                    </Button>
                  )}

                  {isAnalyzing && (
                    <div className="flex items-center justify-center gap-3 py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-muted-foreground">분석 중...</span>
                    </div>
                  )}

                  {analyzedData && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-500">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">분석 완료</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <DataItem label="체중" value={analyzedData.weight} unit="kg" />
                        <DataItem label="골격근량" value={analyzedData.skeletalMuscleMass} unit="kg" />
                        <DataItem label="체지방량" value={analyzedData.bodyFatMass} unit="kg" />
                        <DataItem label="체지방률" value={analyzedData.bodyFatPercentage} unit="%" />
                        <DataItem label="BMI" value={analyzedData.bmi} />
                        <DataItem label="기초대사량" value={analyzedData.basalMetabolicRate} unit="kcal" />
                        {analyzedData.score && (
                          <DataItem label="인바디 점수" value={analyzedData.score} unit="점" />
                        )}
                        {analyzedData.visceralFatLevel && (
                          <DataItem label="내장지방" value={analyzedData.visceralFatLevel} unit="레벨" />
                        )}
                      </div>

                      <Button onClick={handleSave} className="w-full btn-primary">
                        저장하기
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Latest Record Summary */}
      {latest && (
        <div className="py-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">최근 측정</span>
            <span className="text-sm text-muted-foreground">{formatDate(latest.date)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-border rounded-sm">
              <p className="text-xs text-gray-500 mb-1">체중</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-gray-900">{latest.weight}</span>
                <span className="text-sm text-gray-500">kg</span>
              </div>
              {previous && (
                <div className={cn("flex items-center gap-1 mt-1", getChange(latest.weight, previous.weight).color)}>
                  {(() => {
                    const change = getChange(latest.weight, previous.weight);
                    const Icon = change.icon;
                    return (
                      <>
                        <Icon className="h-3 w-3" />
                        <span className="text-xs">{change.value}kg</span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border border-border rounded-sm">
              <p className="text-xs text-gray-500 mb-1">골격근량</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-gray-900">{latest.skeletalMuscleMass}</span>
                <span className="text-sm text-gray-500">kg</span>
              </div>
              {previous && (
                <div className={cn("flex items-center gap-1 mt-1", getChange(latest.skeletalMuscleMass, previous.skeletalMuscleMass).color)}>
                  {(() => {
                    const change = getChange(latest.skeletalMuscleMass, previous.skeletalMuscleMass);
                    const Icon = change.icon;
                    return (
                      <>
                        <Icon className="h-3 w-3" />
                        <span className="text-xs">{change.value}kg</span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border border-border rounded-sm">
              <p className="text-xs text-gray-500 mb-1">체지방량</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-gray-900">{latest.bodyFatMass}</span>
                <span className="text-sm text-gray-500">kg</span>
              </div>
              {previous && (
                <div className={cn("flex items-center gap-1 mt-1", getChange(previous.bodyFatMass, latest.bodyFatMass).color)}>
                  {(() => {
                    const change = getChange(previous.bodyFatMass, latest.bodyFatMass);
                    const Icon = change.icon;
                    return (
                      <>
                        <Icon className="h-3 w-3" />
                        <span className="text-xs">{getChange(latest.bodyFatMass, previous.bodyFatMass).value}kg</span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="p-4 bg-white border border-border rounded-sm">
              <p className="text-xs text-gray-500 mb-1">체지방률</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-gray-900">{latest.bodyFatPercentage}</span>
                <span className="text-sm text-gray-500">%</span>
              </div>
              {previous && (
                <div className={cn("flex items-center gap-1 mt-1", getChange(previous.bodyFatPercentage, latest.bodyFatPercentage).color)}>
                  {(() => {
                    const change = getChange(previous.bodyFatPercentage, latest.bodyFatPercentage);
                    const Icon = change.icon;
                    return (
                      <>
                        <Icon className="h-3 w-3" />
                        <span className="text-xs">{getChange(latest.bodyFatPercentage, previous.bodyFatPercentage).value}%</span>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {latest.score && (
            <div className="mt-4 p-4 bg-white border border-primary/30 rounded-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">인바디 점수</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-medium text-primary">{latest.score}</span>
                  <span className="text-sm text-gray-500">점</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chart & Compare Buttons */}
      {records.length >= 2 && (
        <div className="py-4 border-b border-border">
          <div className="flex gap-3">
            <button
              onClick={() => { setShowChart(!showChart); setShowCompare(false); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border transition-colors",
                showChart
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-border text-gray-700 hover:border-primary"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">변화 그래프</span>
            </button>
            <button
              onClick={() => { setShowCompare(!showCompare); setShowChart(false); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-sm border transition-colors",
                showCompare
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-border text-gray-700 hover:border-primary"
              )}
            >
              <GitCompare className="h-4 w-4" />
              <span className="text-sm font-medium">날짜 비교</span>
            </button>
          </div>
        </div>
      )}

      {/* Chart Section */}
      {showChart && records.length >= 2 && (
        <div className="py-6 border-b border-border">
          <h3 className="text-sm font-medium text-gray-900 mb-4">측정 변화 그래프</h3>

          {/* Metric Selector */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {(Object.keys(metricLabels) as ChartMetric[]).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  selectedMetric === metric
                    ? "text-white"
                    : "bg-white border border-border text-gray-600 hover:border-primary"
                )}
                style={selectedMetric === metric ? { backgroundColor: metricColors[metric] } : {}}
              >
                {metricLabels[metric]}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white border border-border rounded-sm p-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value}${metricUnits[selectedMetric]}`, metricLabels[selectedMetric]]}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={metricColors[selectedMetric]}
                  strokeWidth={2}
                  dot={{ fill: metricColors[selectedMetric], strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: metricColors[selectedMetric] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Compare Section */}
      {showCompare && records.length >= 2 && (
        <div className="py-6 border-b border-border">
          <h3 className="text-sm font-medium text-gray-900 mb-4">날짜별 비교</h3>

          {/* Date Selectors */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">비교 기준</label>
              <select
                value={compareDate1}
                onChange={(e) => setCompareDate1(e.target.value)}
                className="w-full p-3 bg-white border border-border rounded-sm text-sm text-gray-900"
              >
                {records.map((record) => (
                  <option key={record.id} value={record.date}>
                    {formatDate(record.date)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">비교 대상</label>
              <select
                value={compareDate2}
                onChange={(e) => setCompareDate2(e.target.value)}
                className="w-full p-3 bg-white border border-border rounded-sm text-sm text-gray-900"
              >
                {records.map((record) => (
                  <option key={record.id} value={record.date}>
                    {formatDate(record.date)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Table */}
          {record1 && record2 && (
            <div className="bg-white border border-border rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">항목</th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">
                      {formatShortDate(compareDate1)}
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">
                      {formatShortDate(compareDate2)}
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-medium text-gray-500">변화</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow
                    label="체중"
                    val1={record1.weight}
                    val2={record2.weight}
                    unit="kg"
                  />
                  <CompareRow
                    label="골격근량"
                    val1={record1.skeletalMuscleMass}
                    val2={record2.skeletalMuscleMass}
                    unit="kg"
                    positiveIsGood
                  />
                  <CompareRow
                    label="체지방량"
                    val1={record1.bodyFatMass}
                    val2={record2.bodyFatMass}
                    unit="kg"
                    positiveIsGood={false}
                  />
                  <CompareRow
                    label="체지방률"
                    val1={record1.bodyFatPercentage}
                    val2={record2.bodyFatPercentage}
                    unit="%"
                    positiveIsGood={false}
                  />
                  <CompareRow
                    label="BMI"
                    val1={record1.bmi}
                    val2={record2.bmi}
                    unit=""
                  />
                  {record1.score && record2.score && (
                    <CompareRow
                      label="인바디 점수"
                      val1={record1.score}
                      val2={record2.score}
                      unit="점"
                      positiveIsGood
                    />
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Record History */}
      <div className="py-6 pb-32">
        <h2 className="text-sm font-medium mb-4">측정 기록</h2>

        {records.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2">아직 기록이 없습니다</p>
            <p className="text-sm text-muted-foreground">인바디 결과지를 촬영해 기록하세요</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="p-4 bg-white border border-border rounded-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-900">{formatDate(record.date)}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">체중</p>
                    <p className="text-gray-900">{record.weight}kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">골격근</p>
                    <p className="text-gray-900">{record.skeletalMuscleMass}kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">체지방</p>
                    <p className="text-gray-900">{record.bodyFatMass}kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">체지방률</p>
                    <p className="text-gray-900">{record.bodyFatPercentage}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Button - Fixed */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => setShowUpload(true)}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            인바디 기록 추가
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function DataItem({ label, value, unit }: { label: string; value?: number | null; unit?: string }) {
  if (value === undefined || value === null) return null;

  return (
    <div className="p-3 bg-white border border-border rounded-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-light text-gray-900">
        {value}
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
}

function CompareRow({
  label,
  val1,
  val2,
  unit,
  positiveIsGood,
}: {
  label: string;
  val1: number;
  val2: number;
  unit: string;
  positiveIsGood?: boolean;
}) {
  const diff = val1 - val2;
  let changeColor = 'text-gray-500';

  if (Math.abs(diff) >= 0.1) {
    if (positiveIsGood === undefined) {
      changeColor = 'text-gray-700';
    } else if (positiveIsGood) {
      changeColor = diff > 0 ? 'text-green-500' : 'text-red-500';
    } else {
      changeColor = diff < 0 ? 'text-green-500' : 'text-red-500';
    }
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-3 px-4 text-gray-700">{label}</td>
      <td className="py-3 px-4 text-center font-medium text-gray-900">
        {val1}{unit}
      </td>
      <td className="py-3 px-4 text-center text-gray-600">
        {val2}{unit}
      </td>
      <td className={cn("py-3 px-4 text-center font-medium", changeColor)}>
        {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
      </td>
    </tr>
  );
}
