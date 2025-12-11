'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileText,
  Edit,
  RotateCcw,
  Save,
  X,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Users,
  Target,
  Heart,
  Pencil,
  Dumbbell,
  Flame,
  Star,
  Zap,
  Trophy,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Shield,
  Smile,
  Crown,
  Gem,
  Lightbulb,
  Rocket,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminGuard } from '@/components/auth/admin-guard';
import { contentStore, PageContent } from '@/lib/content-store';
import { cn } from '@/lib/utils';

// 편집 가능한 텍스트 컴포넌트
function EditableText({
  value,
  onChange,
  className = '',
  as: Component = 'span',
  placeholder = '클릭하여 편집',
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';
  placeholder?: string;
  multiline?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onChange(localValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setLocalValue(value);
              setIsEditing(false);
            }
          }}
          className={cn('w-full bg-primary/10 border-2 border-primary rounded-lg px-3 py-2 outline-none resize-none shadow-lg', className)}
          rows={3}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => {
          setIsEditing(false);
          onChange(localValue);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setIsEditing(false);
            onChange(localValue);
          }
          if (e.key === 'Escape') {
            setLocalValue(value);
            setIsEditing(false);
          }
        }}
        className={cn('bg-primary/10 border-2 border-primary rounded-lg px-3 py-2 outline-none w-full shadow-lg', className)}
      />
    );
  }

  const hasValue = value && value.trim() !== '';

  return (
    <span className="group relative inline-block">
      <Component
        onClick={() => setIsEditing(true)}
        className={cn(
          'cursor-pointer rounded px-1 -mx-1 transition-all inline-block border-2 border-transparent',
          'hover:border-primary/50 hover:bg-primary/5',
          className
        )}
      >
        {hasValue ? value : <span className="text-gray-400 italic">{placeholder}</span>}
      </Component>
      <span
        role="button"
        tabIndex={0}
        onClick={() => setIsEditing(true)}
        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
        className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white rounded-full p-1.5 shadow-lg hover:bg-primary/90 cursor-pointer"
        title={hasValue ? '수정' : '추가'}
      >
        <Pencil className="h-3 w-3" />
      </span>
    </span>
  );
}

// About 페이지 미리보기 + 편집 컴포넌트
// 선택 가능한 아이콘 목록
const availableIcons = {
  target: Target,
  users: Users,
  award: Award,
  heart: Heart,
  dumbbell: Dumbbell,
  flame: Flame,
  star: Star,
  zap: Zap,
  trophy: Trophy,
  sparkles: Sparkles,
  thumbsup: ThumbsUp,
  trending: TrendingUp,
  shield: Shield,
  smile: Smile,
  crown: Crown,
  gem: Gem,
  lightbulb: Lightbulb,
  rocket: Rocket,
  badge: BadgeCheck,
};

const availableColors = [
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'green', class: 'bg-green-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'red', class: 'bg-red-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'pink', class: 'bg-pink-500' },
  { name: 'indigo', class: 'bg-indigo-500' },
  { name: 'teal', class: 'bg-teal-500' },
];

const defaultIcons = ['target', 'users', 'award', 'heart'];
const defaultColors = ['blue', 'green', 'purple', 'red'];

// 아이콘 선택 컴포넌트
function IconSelector({
  selectedIcon,
  selectedColor,
  onIconChange,
  onColorChange,
}: {
  selectedIcon: string;
  selectedColor: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = availableIcons[selectedIcon as keyof typeof availableIcons] || Target;
  const colorClass = availableColors.find(c => c.name === selectedColor)?.class || 'bg-blue-500';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
          colorClass,
          'hover:ring-2 hover:ring-offset-2 hover:ring-primary'
        )}
        title="아이콘 변경"
      >
        <Icon className="h-5 w-5 text-white" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-12 z-50 bg-white rounded-xl shadow-xl border p-4 w-64">
            <p className="text-xs font-medium text-gray-500 mb-2">아이콘 선택</p>
            <div className="grid grid-cols-6 gap-1 mb-4">
              {Object.entries(availableIcons).map(([key, IconComp]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onIconChange(key);
                  }}
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                    selectedIcon === key
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  <IconComp className="h-4 w-4" />
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-gray-500 mb-2">색상 선택</p>
            <div className="grid grid-cols-8 gap-1">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    onColorChange(color.name);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-6 h-6 rounded-full transition-all',
                    color.class,
                    selectedColor === color.name
                      ? 'ring-2 ring-offset-2 ring-gray-400'
                      : 'hover:scale-110'
                  )}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AboutPreviewEditor({
  editingBlocks,
  onBlockChange,
  fileInputRefs,
  onImageUpload,
}: {
  editingBlocks: Record<string, string>;
  onBlockChange: (blockId: string, value: string) => void;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  onImageUpload: (blockId: string, file: File) => void;
}) {
  const displayMode = editingBlocks['about-display-mode'] || 'text';

  // 표시 모드 선택 UI
  const ModeSelector = () => (
    <div className="bg-gray-50 border-b p-4">
      <p className="text-xs text-gray-500 mb-2 text-center">표시 모드 선택</p>
      <div className="flex justify-center gap-2">
        {[
          { value: 'text', label: '텍스트' },
          { value: 'image', label: '이미지' },
          { value: 'link', label: '외부링크' },
        ].map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => onBlockChange('about-display-mode', mode.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              displayMode === mode.value
                ? 'bg-primary text-white'
                : 'bg-white border hover:bg-gray-50'
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );

  // 이미지 모드
  if (displayMode === 'image') {
    return (
      <div className="min-h-full pb-24">
        <ModeSelector />
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4">
            <p className="text-xs text-gray-400">About</p>
            <h1 className="text-xl font-light">회사소개</h1>
          </div>
        </header>
        <main className="p-4">
          <div
            className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-lg min-h-[300px] flex items-center justify-center hover:border-primary transition-colors"
            onClick={() => fileInputRefs.current['about-image-url']?.click()}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => { fileInputRefs.current['about-image-url'] = el; }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload('about-image-url', file);
              }}
            />
            {editingBlocks['about-image-url'] ? (
              <>
                <img
                  src={editingBlocks['about-image-url']}
                  alt="회사소개"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p>클릭하여 이미지 변경</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <Upload className="h-12 w-12 mx-auto mb-2" />
                <p>클릭하여 이미지 업로드</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // 링크 모드
  if (displayMode === 'link') {
    return (
      <div className="min-h-full pb-24">
        <ModeSelector />
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4">
            <p className="text-xs text-gray-400">About</p>
            <h1 className="text-xl font-light">회사소개</h1>
          </div>
        </header>
        <main className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <p className="text-gray-600 mb-4">회사소개 클릭 시 아래 URL로 이동합니다</p>
            <Input
              value={editingBlocks['about-link-url'] || ''}
              onChange={(e) => onBlockChange('about-link-url', e.target.value)}
              placeholder="https://example.com/about"
              className="max-w-md mx-auto"
            />
          </div>
        </main>
      </div>
    );
  }

  // 텍스트 모드 (기본) - 실제 about 페이지와 동일한 레이아웃
  const values = [1, 2, 3, 4].map(num => ({
    title: editingBlocks[`about-value-${num}-title`] || '',
    description: editingBlocks[`about-value-${num}-desc`] || '',
  })).filter(v => v.title.trim() !== '');

  const facilities = [1, 2, 3, 4, 5, 6, 7, 8].map(num =>
    editingBlocks[`about-facility-${num}`] || ''
  ).filter(f => f.trim() !== '');

  const trainers = [1, 2, 3].map(num => ({
    name: editingBlocks[`about-trainer-${num}-name`] || '',
    role: editingBlocks[`about-trainer-${num}-role`] || '',
    specialty: editingBlocks[`about-trainer-${num}-specialty`] || '',
  })).filter(t => t.name.trim() !== '');

  return (
    <div className="min-h-full pb-24">
      <ModeSelector />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <p className="text-xs text-gray-400">About</p>
          <h1 className="text-xl font-light">회사소개</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div>
            <EditableText
              value={editingBlocks['about-company-name'] || ''}
              onChange={(v) => onBlockChange('about-company-name', v)}
              as="h2"
              className="text-2xl font-bold"
              placeholder="회사명"
            />
          </div>
          <div>
            <EditableText
              value={editingBlocks['about-slogan'] || ''}
              onChange={(v) => onBlockChange('about-slogan', v)}
              as="p"
              className="text-lg text-primary font-medium"
              placeholder="슬로건"
            />
          </div>
          <div>
            <EditableText
              value={editingBlocks['about-description'] || ''}
              onChange={(v) => onBlockChange('about-description', v)}
              as="p"
              className="text-sm text-gray-500 leading-relaxed"
              placeholder="회사 소개를 입력하세요"
              multiline
            />
          </div>
        </section>

        {/* Values */}
        <section className="space-y-4">
          <EditableText
            value={editingBlocks['about-section-values'] || '핵심 가치'}
            onChange={(v) => onBlockChange('about-section-values', v)}
            as="h3"
            className="text-lg font-medium"
          />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((num, index) => {
              const title = editingBlocks[`about-value-${num}-title`] || '';
              const desc = editingBlocks[`about-value-${num}-desc`] || '';
              const iconKey = editingBlocks[`about-value-${num}-icon`] || defaultIcons[index];
              const colorKey = editingBlocks[`about-value-${num}-color`] || defaultColors[index];

              if (!title && !desc && num > 1) return null;

              return (
                <div
                  key={num}
                  className="bg-white border rounded-lg p-4 space-y-2"
                >
                  <IconSelector
                    selectedIcon={iconKey}
                    selectedColor={colorKey}
                    onIconChange={(icon) => onBlockChange(`about-value-${num}-icon`, icon)}
                    onColorChange={(color) => onBlockChange(`about-value-${num}-color`, color)}
                  />
                  <EditableText
                    value={title}
                    onChange={(v) => onBlockChange(`about-value-${num}-title`, v)}
                    as="h4"
                    className="font-medium text-sm"
                    placeholder={`가치 ${num} 제목`}
                  />
                  <EditableText
                    value={desc}
                    onChange={(v) => onBlockChange(`about-value-${num}-desc`, v)}
                    as="p"
                    className="text-xs text-gray-500"
                    placeholder="설명"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Facilities */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <EditableText
              value={editingBlocks['about-section-facilities'] || '시설 안내'}
              onChange={(v) => onBlockChange('about-section-facilities', v)}
              as="h3"
              className="text-lg font-medium"
            />
            <button
              type="button"
              onClick={() => {
                // 빈 슬롯 찾기
                for (let i = 1; i <= 12; i++) {
                  if (!editingBlocks[`about-facility-${i}`]) {
                    onBlockChange(`about-facility-${i}`, '새 시설');
                    break;
                  }
                }
              }}
              className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              추가
            </button>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                const facility = editingBlocks[`about-facility-${num}`] || '';
                if (!facility) return null;

                return (
                  <div key={num} className="flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    <EditableText
                      value={facility}
                      onChange={(v) => onBlockChange(`about-facility-${num}`, v)}
                      className="text-sm flex-1"
                      placeholder={`시설 ${num}`}
                    />
                    <button
                      type="button"
                      onClick={() => onBlockChange(`about-facility-${num}`, '')}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-1 transition-opacity"
                      title="삭제"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            {!Object.keys(editingBlocks).some(k => k.startsWith('about-facility-') && editingBlocks[k]) && (
              <p className="text-sm text-gray-400 text-center py-4">시설을 추가해주세요</p>
            )}
          </div>
        </section>

        {/* Trainers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <EditableText
              value={editingBlocks['about-section-trainers'] || '트레이너 소개'}
              onChange={(v) => onBlockChange('about-section-trainers', v)}
              as="h3"
              className="text-lg font-medium"
            />
            <button
              type="button"
              onClick={() => {
                // 빈 슬롯 찾기
                for (let i = 1; i <= 6; i++) {
                  if (!editingBlocks[`about-trainer-${i}-name`]) {
                    onBlockChange(`about-trainer-${i}-name`, '새 트레이너');
                    onBlockChange(`about-trainer-${i}-role`, '트레이너');
                    onBlockChange(`about-trainer-${i}-specialty`, '전문분야');
                    break;
                  }
                }
              }}
              className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              추가
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const name = editingBlocks[`about-trainer-${num}-name`] || '';
              const role = editingBlocks[`about-trainer-${num}-role`] || '';
              const specialty = editingBlocks[`about-trainer-${num}-specialty`] || '';
              const photo = editingBlocks[`about-trainer-${num}-photo`] || '';

              if (!name && !role) return null;

              return (
                <div
                  key={num}
                  className="bg-white border rounded-lg p-4 flex items-start gap-4 group"
                >
                  {/* 프로필 사진 */}
                  <div
                    className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden group/photo hover:ring-2 hover:ring-primary hover:ring-offset-2"
                    onClick={() => fileInputRefs.current[`trainer-photo-${num}`]?.click()}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[`trainer-photo-${num}`] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImageUpload(`about-trainer-${num}-photo`, file);
                      }}
                    />
                    {photo ? (
                      <>
                        <img src={photo} alt={name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <span className="text-xl font-medium text-gray-400">
                          {name ? name.slice(0, 1) : '?'}
                        </span>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">이름</span>
                      <EditableText
                        value={name}
                        onChange={(v) => onBlockChange(`about-trainer-${num}-name`, v)}
                        className="font-medium text-sm"
                        placeholder="이름"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">직급</span>
                      <EditableText
                        value={role}
                        onChange={(v) => onBlockChange(`about-trainer-${num}-role`, v)}
                        className="text-xs text-primary"
                        placeholder="직급"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">전문</span>
                      <EditableText
                        value={specialty}
                        onChange={(v) => onBlockChange(`about-trainer-${num}-specialty`, v)}
                        className="text-xs text-gray-500"
                        placeholder="전문분야"
                      />
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() => {
                      onBlockChange(`about-trainer-${num}-name`, '');
                      onBlockChange(`about-trainer-${num}-role`, '');
                      onBlockChange(`about-trainer-${num}-specialty`, '');
                      onBlockChange(`about-trainer-${num}-photo`, '');
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-1 transition-opacity"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
            {!Object.keys(editingBlocks).some(k => k.includes('trainer') && k.includes('name') && editingBlocks[k]) && (
              <p className="text-sm text-gray-400 text-center py-4 bg-white border rounded-lg">트레이너를 추가해주세요</p>
            )}
          </div>
        </section>

        {/* Contact Info */}
        <section className="space-y-4">
          <EditableText
            value={editingBlocks['about-section-contact'] || '연락처 및 위치'}
            onChange={(v) => onBlockChange('about-section-contact', v)}
            as="h3"
            className="text-lg font-medium"
          />
          <div className="bg-white border rounded-lg divide-y">
            <div className="p-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">주소</p>
                <EditableText
                  value={editingBlocks['about-address'] || ''}
                  onChange={(v) => onBlockChange('about-address', v)}
                  as="p"
                  className="text-sm text-gray-500"
                  placeholder="주소를 입력하세요"
                />
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">전화</p>
                <EditableText
                  value={editingBlocks['about-phone'] || ''}
                  onChange={(v) => onBlockChange('about-phone', v)}
                  as="p"
                  className="text-sm text-primary"
                  placeholder="전화번호"
                />
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">이메일</p>
                <EditableText
                  value={editingBlocks['about-email'] || ''}
                  onChange={(v) => onBlockChange('about-email', v)}
                  as="p"
                  className="text-sm text-primary"
                  placeholder="이메일"
                />
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">운영시간</p>
                <EditableText
                  value={editingBlocks['about-operating-hours'] || ''}
                  onChange={(v) => onBlockChange('about-operating-hours', v)}
                  as="p"
                  className="text-sm text-gray-500"
                  placeholder="운영시간"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Map - Google Maps */}
        <section className="space-y-4">
          <EditableText
            value={editingBlocks['about-section-directions'] || '오시는 길'}
            onChange={(v) => onBlockChange('about-section-directions', v)}
            as="h3"
            className="text-lg font-medium"
          />
          <div className="bg-white border rounded-lg overflow-hidden">
            {/* 주소 입력 */}
            <div className="p-4 border-b bg-gray-50 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">지도에 표시할 주소</span>
              </div>
              <Input
                value={editingBlocks['about-map-address'] || editingBlocks['about-address'] || ''}
                onChange={(e) => onBlockChange('about-map-address', e.target.value)}
                placeholder="예: 서울특별시 강남구 테헤란로 123"
                className="text-sm"
              />
              <p className="text-xs text-gray-400">주소를 입력하면 구글 지도에 표시됩니다</p>
            </div>
            {/* 지도 영역 */}
            <div className="aspect-video bg-gray-100">
              {(editingBlocks['about-map-address'] || editingBlocks['about-address']) ? (
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(editingBlocks['about-map-address'] || editingBlocks['about-address'] || '')}&output=embed&z=16`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="구글 지도"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">주소를 입력하면 지도가 표시됩니다</p>
                  </div>
                </div>
              )}
            </div>
            {/* 오시는 길 안내 */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-600">오시는 길 안내</span>
              </div>
              <EditableText
                value={editingBlocks['about-directions'] || ''}
                onChange={(v) => onBlockChange('about-directions', v)}
                as="p"
                className="text-sm text-gray-500"
                placeholder="예: 강남역 3번 출구에서 도보 5분"
                multiline
              />
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center text-xs text-gray-400 space-y-1 pt-4">
          <p>
            상호: <EditableText value={editingBlocks['about-company-name'] || ''} onChange={(v) => onBlockChange('about-company-name', v)} placeholder="회사명" /> |
            대표: <EditableText value={editingBlocks['about-ceo'] || ''} onChange={(v) => onBlockChange('about-ceo', v)} placeholder="대표자" />
          </p>
          <p>
            사업자등록번호: <EditableText value={editingBlocks['about-business-number'] || ''} onChange={(v) => onBlockChange('about-business-number', v)} placeholder="000-00-00000" />
          </p>
          <p>
            설립: <EditableText value={editingBlocks['about-established'] || ''} onChange={(v) => onBlockChange('about-established', v)} placeholder="2020년" />
          </p>
        </div>
      </main>
    </div>
  );
}

function AdminPagesContent() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [editingBlocks, setEditingBlocks] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    contentStore.init();
    setPages(contentStore.getAllPages());

    const unsubscribe = contentStore.subscribe(() => {
      setPages(contentStore.getAllPages());
      if (selectedPage) {
        const updated = contentStore.getPageContent(selectedPage.pageId);
        if (updated) {
          setSelectedPage(updated);
        }
      }
    });

    return () => unsubscribe();
  }, [selectedPage?.pageId]);

  const handleSelectPage = (page: PageContent) => {
    if (hasChanges) {
      if (!confirm('저장하지 않은 변경사항이 있습니다. 페이지를 변경하시겠습니까?')) {
        return;
      }
    }
    setSelectedPage(page);
    const initialValues: Record<string, string> = {};
    page.blocks.forEach(block => {
      initialValues[block.id] = block.value;
    });
    setEditingBlocks(initialValues);
    setHasChanges(false);

    // 회사소개 페이지는 바로 전체화면 모드로 진입
    if (page.pageId === 'about') {
      setEditingSection('fullscreen');
    } else {
      setEditingSection(null);
    }
  };

  const handleBlockChange = (blockId: string, value: string) => {
    setEditingBlocks(prev => ({ ...prev, [blockId]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!selectedPage) return;

    const updates = Object.entries(editingBlocks).map(([blockId, value]) => ({
      blockId,
      value,
    }));

    contentStore.updatePageContent(selectedPage.pageId, updates);
    setHasChanges(false);
    setSaveMessage('저장되었습니다!');
    setTimeout(() => setSaveMessage(''), 2000);
    // Refresh preview iframe
    setPreviewKey(prev => prev + 1);
  };

  const handleReset = () => {
    if (!selectedPage) return;

    if (confirm('이 페이지의 모든 내용을 기본값으로 복원하시겠습니까?')) {
      contentStore.resetPage(selectedPage.pageId);
      const updated = contentStore.getPageContent(selectedPage.pageId);
      if (updated) {
        const initialValues: Record<string, string> = {};
        updated.blocks.forEach(block => {
          initialValues[block.id] = block.value;
        });
        setEditingBlocks(initialValues);
        setHasChanges(false);
      }
    }
  };

  const handleCancel = () => {
    if (!selectedPage) return;

    if (hasChanges) {
      if (!confirm('변경사항을 취소하시겠습니까?')) {
        return;
      }
    }

    const initialValues: Record<string, string> = {};
    selectedPage.blocks.forEach(block => {
      initialValues[block.id] = block.value;
    });
    setEditingBlocks(initialValues);
    setHasChanges(false);
  };

  const handleImageUpload = (blockId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setEditingBlocks(prev => ({ ...prev, [blockId]: dataUrl }));
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  // 배너 페이지인지 확인 (챌린지, 이벤트, 블로그)
  const isBannerPage = selectedPage?.pageId === 'challenge' || selectedPage?.pageId === 'event' || selectedPage?.pageId === 'blog';
  const isBlogPage = selectedPage?.pageId === 'blog';
  const isAboutPage = selectedPage?.pageId === 'about';

  // 배너 개수 가져오기
  const getBannerCount = () => {
    if (!selectedPage || !isBannerPage) return 0;
    const countBlock = selectedPage.blocks.find(b => b.id.includes('banner-count'));
    // editingBlocks에 값이 없으면 countBlock의 기본값 사용
    const countValue = editingBlocks[countBlock?.id || ''] || countBlock?.value || '1';
    const count = parseInt(countValue);
    const maxCount = isBlogPage ? 3 : 5;
    return Math.min(Math.max(count, 1), maxCount);
  };

  // 배너 추가
  const handleAddBanner = () => {
    if (!selectedPage) return;
    const currentCount = getBannerCount();
    const maxCount = isBlogPage ? 3 : 5;
    if (currentCount >= maxCount) return;

    const countBlockId = selectedPage.blocks.find(b => b.id.includes('banner-count'))?.id;
    if (countBlockId) {
      setEditingBlocks(prev => ({ ...prev, [countBlockId]: String(currentCount + 1) }));
      setHasChanges(true);
    }
  };

  // 배너 삭제
  const handleRemoveBanner = (bannerNum: number) => {
    if (!selectedPage) return;
    const currentCount = getBannerCount();
    if (currentCount <= 1) return;

    const countBlockId = selectedPage.blocks.find(b => b.id.includes('banner-count'))?.id;
    if (countBlockId) {
      // 삭제할 배너의 값들을 초기화
      const newBlocks = { ...editingBlocks };
      if (isBlogPage) {
        newBlocks[`blog-banner-${bannerNum}-url`] = '';
        newBlocks[`blog-banner-${bannerNum}-image`] = '';
        newBlocks[`blog-banner-${bannerNum}-title`] = '';
        newBlocks[`blog-banner-${bannerNum}-description`] = '';
      } else {
        const prefix = selectedPage.pageId === 'challenge' ? 'challenge-banner' : 'event-banner';
        newBlocks[`${prefix}-${bannerNum}-image`] = '';
        newBlocks[`${prefix}-${bannerNum}-title`] = '';
        newBlocks[`${prefix}-${bannerNum}-subtitle`] = '';
        newBlocks[`${prefix}-${bannerNum}-link`] = '';
      }
      newBlocks[countBlockId] = String(currentCount - 1);
      setEditingBlocks(newBlocks);
      setHasChanges(true);
    }
  };

  // 배너 블록 필터링 (개수에 따라)
  const getVisibleBlocks = () => {
    if (!selectedPage) return [];
    if (!isBannerPage) return selectedPage.blocks;

    const bannerCount = getBannerCount();
    return selectedPage.blocks.filter(block => {
      // count 블록은 숨김
      if (block.id.includes('banner-count')) return false;

      // 배너 번호 추출
      const match = block.id.match(/banner-(\d+)-/);
      if (match) {
        const bannerNum = parseInt(match[1]);
        return bannerNum <= bannerCount;
      }
      return true;
    });
  };

  // 회사소개 전체화면 모드일 때
  if (editingSection === 'fullscreen' && isAboutPage && selectedPage) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col">
        {/* 상단 툴바 */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditingSection(null)}
            >
              <X className="h-4 w-4 mr-1" />
              닫기
            </Button>
            <span className="text-sm font-medium">회사소개 편집</span>
          </div>
          <div className="flex items-center gap-2">
            {saveMessage && (
              <span className="text-sm text-green-600">{saveMessage}</span>
            )}
            {hasChanges && (
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-primary text-white"
              >
                <Save className="h-4 w-4 mr-1" />
                저장
              </Button>
            )}
          </div>
        </div>

        {/* 전체 너비 미리보기 + 클릭 편집 */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="max-w-lg mx-auto bg-white min-h-full shadow-lg">
            <AboutPreviewEditor
              editingBlocks={editingBlocks}
              onBlockChange={handleBlockChange}
              fileInputRefs={fileInputRefs}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('모든 페이지 콘텐츠를 기본값으로 초기화하시겠습니까?')) {
                    contentStore.resetAll();
                    setSelectedPage(null);
                    setEditingBlocks({});
                    setHasChanges(false);
                    setSaveMessage('전체 초기화 완료!');
                    setTimeout(() => setSaveMessage(''), 2000);
                  }
                }}
                className="text-xs text-red-600 border-red-200 hover:bg-red-50"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                전체 초기화
              </Button>
            </div>
            {selectedPage && !isAboutPage && (
              <div className="flex items-center gap-2">
                {saveMessage && (
                  <span className="text-sm text-green-600">{saveMessage}</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  초기화
                </Button>
                {hasChanges && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="text-xs"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      취소
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="text-xs bg-primary hover:bg-primary/90 text-white"
                    >
                      <Save className="h-3.5 w-3.5 mr-1" />
                      저장
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col h-[calc(100vh-60px)] overflow-hidden">
        {/* 상단: 페이지 목록 */}
        <div className="bg-white border-b flex-shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 px-3 py-2">
            {pages.map((page) => (
              <button
                key={page.pageId}
                onClick={() => handleSelectPage(page)}
                className={`px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 transition-colors border rounded-lg ${
                  selectedPage?.pageId === page.pageId
                    ? 'bg-primary/5 border-primary'
                    : 'border-gray-200'
                }`}
              >
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{page.pageName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 하단: 편집 패널 */}
        {selectedPage && !isAboutPage && (
          <div className="flex-1 bg-white flex overflow-hidden flex-col min-h-0">
            <div className="flex flex-col flex-1 min-h-0">
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="font-medium text-sm text-gray-900">{selectedPage.pageName} 편집</h2>
                <p className="text-xs text-gray-500">
                  {isBannerPage ? `${getBannerCount()}개 배너 (최대 ${isBlogPage ? 3 : 5}개)` : `${selectedPage.blocks.length}개 항목`}
                </p>
              </div>
              {isBannerPage && (
                <Button
                  type="button"
                  variant={getBannerCount() < (isBlogPage ? 3 : 5) ? "default" : "outline"}
                  size="sm"
                  onClick={handleAddBanner}
                  disabled={getBannerCount() >= (isBlogPage ? 3 : 5)}
                  className={`h-8 text-xs ${getBannerCount() < (isBlogPage ? 3 : 5) ? 'bg-primary hover:bg-primary/90 text-white' : ''}`}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  배너 추가
                </Button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <div className="space-y-4 max-w-xl pb-8">
                {isBannerPage ? (
                  // 배너 페이지: 배너별로 그룹화해서 표시
                  <>
                    {/* 블로그 페이지 활성화 토글 */}
                    {isBlogPage && (
                      <div className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">블로그 배너 활성화</h3>
                            <p className="text-xs text-gray-500 mt-1">홈 화면에 블로그 섹션 표시 여부</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingBlocks['blog-banner-enabled'] === 'true'}
                              onChange={(e) => handleBlockChange('blog-banner-enabled', e.target.checked ? 'true' : 'false')}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    )}
                    {Array.from({ length: getBannerCount() }, (_, i) => i + 1).map((bannerNum) => {
                      if (isBlogPage) {
                        // 블로그 페이지 렌더링
                        const urlBlock = selectedPage.blocks.find(b => b.id === `blog-banner-${bannerNum}-url`);
                        const imageBlock = selectedPage.blocks.find(b => b.id === `blog-banner-${bannerNum}-image`);
                        const titleBlock = selectedPage.blocks.find(b => b.id === `blog-banner-${bannerNum}-title`);
                        const descBlock = selectedPage.blocks.find(b => b.id === `blog-banner-${bannerNum}-description`);

                        return (
                          <div key={bannerNum} className="border border-gray-200 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">블로그 {bannerNum}</h3>
                              {getBannerCount() > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveBanner(bannerNum)}
                                  className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>

                            {/* URL */}
                            {urlBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600">블로그 URL</label>
                                <Input
                                  value={editingBlocks[urlBlock.id] || ''}
                                  onChange={(e) => handleBlockChange(urlBlock.id, e.target.value)}
                                  className="h-9 text-sm"
                                  placeholder="https://blog.naver.com/..."
                                />
                              </div>
                            )}

                            {/* 이미지 */}
                            {imageBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  <ImageIcon className="h-3 w-3 text-gray-400" />
                                  대표 이미지
                                </label>
                                <div className="flex gap-2">
                                  <Input
                                    value={editingBlocks[imageBlock.id] || ''}
                                    onChange={(e) => handleBlockChange(imageBlock.id, e.target.value)}
                                    className="h-9 text-sm flex-1"
                                    placeholder="이미지 URL 입력"
                                  />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={(el) => { fileInputRefs.current[imageBlock.id] = el; }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(imageBlock.id, file);
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3"
                                    onClick={() => fileInputRefs.current[imageBlock.id]?.click()}
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </div>
                                {editingBlocks[imageBlock.id] && (
                                  <div className="relative w-full max-w-xs aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                      src={editingBlocks[imageBlock.id]}
                                      alt="미리보기"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 제목 */}
                            {titleBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600">제목</label>
                                <Input
                                  value={editingBlocks[titleBlock.id] || ''}
                                  onChange={(e) => handleBlockChange(titleBlock.id, e.target.value)}
                                  className="h-9 text-sm"
                                  placeholder="블로그 제목"
                                />
                              </div>
                            )}

                            {/* 설명 */}
                            {descBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600">설명</label>
                                <Input
                                  value={editingBlocks[descBlock.id] || ''}
                                  onChange={(e) => handleBlockChange(descBlock.id, e.target.value)}
                                  className="h-9 text-sm"
                                  placeholder="블로그 설명"
                                />
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        // 챌린지/이벤트 페이지 렌더링
                        const prefix = selectedPage.pageId === 'challenge' ? 'challenge-banner' : 'event-banner';
                        const imageBlock = selectedPage.blocks.find(b => b.id === `${prefix}-${bannerNum}-image`);
                        const titleBlock = selectedPage.blocks.find(b => b.id === `${prefix}-${bannerNum}-title`);
                        const subtitleBlock = selectedPage.blocks.find(b => b.id === `${prefix}-${bannerNum}-subtitle`);
                        const linkBlock = selectedPage.blocks.find(b => b.id === `${prefix}-${bannerNum}-link`);
                        const detailImageBlock = selectedPage.blocks.find(b => b.id === `${prefix}-${bannerNum}-detail-image`);
                        const detailContentBlock = selectedPage.blocks.find(b => b.id === `${prefix}-${bannerNum}-detail-content`);

                        return (
                          <div key={bannerNum} className="border border-gray-200 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">배너 {bannerNum}</h3>
                              {getBannerCount() > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveBanner(bannerNum)}
                                  className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>

                            {/* 이미지 */}
                            {imageBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  <ImageIcon className="h-3 w-3 text-gray-400" />
                                  이미지
                                </label>
                                <div className="flex gap-2">
                                  <Input
                                    value={editingBlocks[imageBlock.id] || ''}
                                    onChange={(e) => handleBlockChange(imageBlock.id, e.target.value)}
                                    className="h-9 text-sm flex-1"
                                    placeholder="이미지 URL 입력"
                                  />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={(el) => { fileInputRefs.current[imageBlock.id] = el; }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(imageBlock.id, file);
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3"
                                    onClick={() => fileInputRefs.current[imageBlock.id]?.click()}
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </div>
                                {editingBlocks[imageBlock.id] && (
                                  <div className="relative w-24 aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                      src={editingBlocks[imageBlock.id]}
                                      alt="미리보기"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 제목 */}
                            {titleBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600">제목</label>
                                <Input
                                  value={editingBlocks[titleBlock.id] || ''}
                                  onChange={(e) => handleBlockChange(titleBlock.id, e.target.value)}
                                  className="h-9 text-sm"
                                  placeholder="배너 제목"
                                />
                              </div>
                            )}

                            {/* 설명 */}
                            {subtitleBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600">설명</label>
                                <Input
                                  value={editingBlocks[subtitleBlock.id] || ''}
                                  onChange={(e) => handleBlockChange(subtitleBlock.id, e.target.value)}
                                  className="h-9 text-sm"
                                  placeholder="배너 설명"
                                />
                              </div>
                            )}

                            {/* 링크 */}
                            {linkBlock && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-600">링크</label>
                                <Input
                                  value={editingBlocks[linkBlock.id] || ''}
                                  onChange={(e) => handleBlockChange(linkBlock.id, e.target.value)}
                                  className="h-9 text-sm"
                                  placeholder="/challenge"
                                />
                              </div>
                            )}

                            {/* 클릭시 상세 정보 구분선 */}
                            <div className="border-t border-gray-200 pt-3 mt-3">
                              <p className="text-xs font-medium text-gray-500 mb-3">클릭시 표시될 상세 정보</p>

                              {/* 상세 이미지 */}
                              {detailImageBlock && (
                                <div className="space-y-1.5 mb-3">
                                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <ImageIcon className="h-3 w-3 text-gray-400" />
                                    상세 이미지
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      value={editingBlocks[detailImageBlock.id] || ''}
                                      onChange={(e) => handleBlockChange(detailImageBlock.id, e.target.value)}
                                      className="h-9 text-sm flex-1"
                                      placeholder="상세 이미지 URL 입력"
                                    />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      ref={(el) => { fileInputRefs.current[detailImageBlock.id] = el; }}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(detailImageBlock.id, file);
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="h-9 px-3"
                                      onClick={() => fileInputRefs.current[detailImageBlock.id]?.click()}
                                    >
                                      <Upload className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {editingBlocks[detailImageBlock.id] && (
                                    <div className="relative w-full max-w-xs aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                      <img
                                        src={editingBlocks[detailImageBlock.id]}
                                        alt="상세 이미지 미리보기"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* 상세 내용 */}
                              {detailContentBlock && (
                                <div className="space-y-1.5">
                                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <Edit className="h-3 w-3 text-gray-400" />
                                    상세 내용
                                  </label>
                                  <textarea
                                    value={editingBlocks[detailContentBlock.id] || ''}
                                    onChange={(e) => handleBlockChange(detailContentBlock.id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary min-h-[100px] resize-y"
                                    placeholder="배너 클릭시 표시될 상세 내용을 입력하세요"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </>
                ) : isAboutPage ? (
                  // 회사소개 페이지는 자동으로 전체화면 모드로 전환됨
                  null
                ) : (
                  // 일반 페이지
                  selectedPage.blocks.map((block) => (
                    <div key={block.id} className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        {block.type === 'image' ? (
                          <ImageIcon className="h-3 w-3 text-gray-400" />
                        ) : (
                          <Edit className="h-3 w-3 text-gray-400" />
                        )}
                        {block.label}
                      </label>
                      {block.type === 'image' ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={editingBlocks[block.id] || ''}
                              onChange={(e) => handleBlockChange(block.id, e.target.value)}
                              className="h-9 text-sm flex-1"
                              placeholder="이미지 URL 입력"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={(el) => { fileInputRefs.current[block.id] = el; }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(block.id, file);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-9 px-3"
                              onClick={() => fileInputRefs.current[block.id]?.click()}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              업로드
                            </Button>
                          </div>
                          {editingBlocks[block.id] && (
                            <div className="relative w-32 aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={editingBlocks[block.id]}
                                alt="미리보기"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ) : block.type === 'description' || block.type === 'html' ? (
                        <textarea
                          value={editingBlocks[block.id] || ''}
                          onChange={(e) => handleBlockChange(block.id, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary min-h-[80px] resize-y"
                          placeholder={block.label}
                        />
                      ) : (
                        <Input
                          value={editingBlocks[block.id] || ''}
                          onChange={(e) => handleBlockChange(block.id, e.target.value)}
                          className="h-9 text-sm"
                          placeholder={block.label}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPagesPage() {
  return (
    <AdminGuard>
      <AdminPagesContent />
    </AdminGuard>
  );
}
