'use client';

import { useState, useRef, TouchEvent } from 'react';
import { Event } from '@/types';
import { cn } from '@/lib/utils';

const eventImages = [
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=500&fit=crop',
];

interface ActiveEventsProps {
  events: Event[];
  onViewAll?: () => void;
  onEventClick?: (event: Event) => void;
}

export function ActiveEvents({ events, onEventClick }: ActiveEventsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!events.length) return null;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold && currentIndex < events.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const event = events[currentIndex];

  return (
    <div className="space-y-2">
      <div>
        <p className="watermark-text">Event</p>
        <h2 className="text-lg font-light">이벤트</h2>
      </div>

      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={() => onEventClick?.(event)}
          className="relative w-full aspect-[4/5] overflow-hidden rounded-lg group"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url('${eventImages[currentIndex % eventImages.length]}')`,
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
            <span className="text-[10px] tracking-wider opacity-80 mb-0.5">PROMOT</span>
            <h3 className="text-sm font-medium leading-tight mb-2 line-clamp-2">
              {event.title}
            </h3>
            <div className="inline-flex">
              <span className="px-3 py-1 bg-[#C4A574] text-white text-[10px] rounded-full">
                참여하기
              </span>
            </div>
          </div>
        </button>

        {/* Slide Indicators */}
        {events.length > 1 && (
          <div className="flex justify-center gap-1 mt-2">
            {events.map((_, idx) => (
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
