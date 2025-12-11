'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Image as ImageIcon,
  X,
  Camera,
} from 'lucide-react';
import Link from 'next/link';
import { postStore, BoardType } from '@/lib/post-store';

function CreatePostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardType = (searchParams.get('board') as BoardType) || 'workout';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWorkout = boardType === 'workout';
  const pageTitle = isWorkout ? '인증글 작성' : '글 작성';
  const placeholder = isWorkout ? '오늘의 운동을 기록해보세요...' : '자유롭게 글을 작성해보세요...';

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Max 4 images
    const remainingSlots = 4 - images.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;

    setIsSubmitting(true);

    // Add post to store with board type
    postStore.addPost(content, images, boardType);

    setIsSubmitting(false);
    router.push('/community');
  };

  const canSubmit = content.trim().length > 0 || images.length > 0;

  return (
    <AppLayout hideNavigation>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/community"
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-light">{pageTitle}</h1>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="py-6">
        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[200px] p-0 text-base leading-relaxed resize-none border-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"
          autoFocus
        />

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-muted overflow-hidden rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ display: 'block' }}
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Debug: Show image count */}
        {images.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {images.length}개의 사진이 선택됨
          </p>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= 4}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-muted hover:bg-muted/80 text-foreground transition-colors disabled:opacity-50 rounded-sm"
            >
              <ImageIcon className="h-5 w-5" />
              <span className="text-sm font-medium">사진 추가</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={images.length >= 4}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-muted hover:bg-muted/80 text-foreground transition-colors disabled:opacity-50 rounded-sm"
            >
              <Camera className="h-5 w-5" />
              <span className="text-sm font-medium">카메라</span>
            </button>
            <span className="text-sm text-muted-foreground min-w-[40px] text-right">
              {images.length}/4
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-muted flex items-center justify-center">로딩 중...</div>}>
      <CreatePostContent />
    </Suspense>
  );
}
