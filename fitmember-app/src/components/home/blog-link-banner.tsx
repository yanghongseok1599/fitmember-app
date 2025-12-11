'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { contentStore } from '@/lib/content-store';
import { cn } from '@/lib/utils';

interface BlogItem {
  url: string;
  image: string;
  title: string;
  description: string;
}

interface BlogLinkBannerProps {
  className?: string;
}

// 기본 블로그 데이터
const defaultBlog: BlogItem = {
  url: 'https://blog.naver.com/itnfitness',
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop',
  title: '효과적인 운동 루틴 만들기',
  description: '초보자도 쉽게 따라할 수 있는 운동 루틴을 소개합니다.',
};

export function BlogLinkBanner({ className }: BlogLinkBannerProps) {
  const [enabled, setEnabled] = useState(true);
  const [blogs, setBlogs] = useState<BlogItem[]>([defaultBlog]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    contentStore.init();

    const loadBlogData = () => {
      const isEnabled = contentStore.getContent('blog-banner-enabled');
      // 기본값으로 활성화 (값이 없거나 'true'일 때)
      setEnabled(isEnabled !== 'false');

      // 배너 개수 확인
      const countStr = contentStore.getContent('blog-banner-count');
      const count = Math.min(Math.max(parseInt(countStr) || 1, 1), 3);

      // 블로그 데이터 로드
      const blogItems: BlogItem[] = [];
      for (let i = 1; i <= count; i++) {
        const url = contentStore.getContent(`blog-banner-${i}-url`);
        const image = contentStore.getContent(`blog-banner-${i}-image`);
        const title = contentStore.getContent(`blog-banner-${i}-title`);
        const description = contentStore.getContent(`blog-banner-${i}-description`);

        // URL과 제목이 있는 항목만 추가
        if (url && title) {
          blogItems.push({ url, image, title, description });
        }
      }

      // 데이터가 없으면 기본 블로그 사용
      if (blogItems.length === 0) {
        blogItems.push(defaultBlog);
      }

      setBlogs(blogItems);
    };

    loadBlogData();

    const unsubscribe = contentStore.subscribe(loadBlogData);
    return () => unsubscribe();
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? blogs.length - 1 : prev - 1));
  }, [blogs.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === blogs.length - 1 ? 0 : prev + 1));
  }, [blogs.length]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // 배너가 비활성화되어 있거나 데이터가 없으면 렌더링하지 않음
  if (!enabled || blogs.length === 0) {
    return null;
  }

  const currentBlog = blogs[currentIndex];

  return (
    <div className={className}>
      {/* 섹션 헤더 */}
      <div className="mb-4">
        <p className="watermark-text mb-2">Blog</p>
        <h2 className="text-lg font-light">오늘의 블로그</h2>
      </div>

      {/* 슬라이더 컨테이너 */}
      <div className="relative">
        <div
          className="overflow-hidden rounded-xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <a
            href={currentBlog.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              {/* OG 이미지 */}
              {currentBlog.image && (
                <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentBlog.image}
                    alt={currentBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 네이버 블로그 아이콘 배지 */}
                  <div className="absolute top-3 left-3 bg-[#03C75A] text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
                    </svg>
                    블로그
                  </div>
                  {/* 슬라이드 번호 표시 */}
                  {blogs.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                      {currentIndex + 1} / {blogs.length}
                    </div>
                  )}
                </div>
              )}

              {/* 텍스트 콘텐츠 */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                      {currentBlog.title}
                    </h3>
                    {currentBlog.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {currentBlog.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-primary transition-colors" />
                </div>

                {/* URL 표시 */}
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  {currentBlog.url.replace(/^https?:\/\//, '')}
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* 이전/다음 버튼 (2개 이상일 때만) */}
        {blogs.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-colors z-10"
              aria-label="이전 블로그"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-colors z-10"
              aria-label="다음 블로그"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* 페이지네이션 도트 (2개 이상일 때만) */}
      {blogs.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {blogs.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === currentIndex
                  ? 'bg-primary'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`블로그 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
