'use client';

import { useState, useRef, TouchEvent } from 'react';
import { Challenge } from '@/types';
import { cn } from '@/lib/utils';

const challengeImages = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=500&fit=crop',
];

interface ActiveChallengesProps {
  challenges: Challenge[];
  onViewAll?: () => void;
  onChallengeClick?: (challenge: Challenge) => void;
}

export function ActiveChallenges({ challenges, onChallengeClick }: ActiveChallengesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!challenges.length) return null;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold && currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const challenge = challenges[currentIndex];

  return (
    <div className="space-y-2">
      <div>
        <p className="watermark-text">Challenge</p>
        <h2 className="text-lg font-light">챌린지</h2>
      </div>

      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={() => onChallengeClick?.(challenge)}
          className="relative w-full aspect-[4/5] overflow-hidden rounded-lg group"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url('${challengeImages[currentIndex % challengeImages.length]}')`,
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
            <span className="text-[10px] tracking-wider opacity-80 mb-0.5">DISCOUNT</span>
            <h3 className="text-sm font-medium leading-tight mb-2 line-clamp-2">
              {challenge.title}
            </h3>
            <div className="inline-flex">
              <span className="px-3 py-1 bg-[#C4A574] text-white text-[10px] rounded-full">
                참여하기
              </span>
            </div>
          </div>
        </button>

        {/* Slide Indicators */}
        {challenges.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {challenges.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  idx === currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
