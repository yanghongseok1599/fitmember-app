'use client';

import { ChevronRight, Sparkles, Bone, Dumbbell, Heart, Apple } from 'lucide-react';
import { BannerSlider, BannerCard } from '@/components/store';
import { getSpecialBanners, getBannersByCategory } from '@/lib/store-data';
import { StoreBanner } from '@/types';
import { AppLayout } from '@/components/layout';

interface CategorySectionProps {
  title: string;
  icon: React.ElementType;
  banners: StoreBanner[];
  color: string;
}

function CategorySection({ title, icon: Icon, banners, color }: CategorySectionProps) {
  if (banners.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-base font-medium text-gray-900">{title}</h2>
        </div>
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          더보기
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {banners.slice(0, 4).map((banner) => (
          <BannerCard key={banner.id} banner={banner} size="small" />
        ))}
      </div>
    </section>
  );
}

export default function StorePage() {
  const specialBanners = getSpecialBanners();
  const correctionBanners = getBannersByCategory('correction');
  const exerciseBanners = getBannersByCategory('exercise');
  const healthBanners = getBannersByCategory('health');
  const foodBanners = getBannersByCategory('food');

  return (
    <AppLayout>
      {/* Header */}
      <div className="py-4 sm:py-6 border-b border-border -mx-4 px-4 bg-card">
        <p className="watermark-text">Store</p>
        <h1 className="text-xl font-light">스토어</h1>
      </div>

      {/* Main Content */}
      <div className="py-6 space-y-8">
        {/* 특가 이벤트 섹션 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-base font-medium text-gray-900">특가 이벤트</h2>
          </div>
          <BannerSlider banners={specialBanners} autoPlay={true} autoPlayInterval={4000} />
        </section>

        {/* 카테고리별 섹션 */}
        <CategorySection
          title="교정용품"
          icon={Bone}
          banners={correctionBanners}
          color="bg-purple-500"
        />

        <CategorySection
          title="운동용품"
          icon={Dumbbell}
          banners={exerciseBanners}
          color="bg-blue-500"
        />

        <CategorySection
          title="건강용품"
          icon={Heart}
          banners={healthBanners}
          color="bg-green-500"
        />

        <CategorySection
          title="건강식품"
          icon={Apple}
          banners={foodBanners}
          color="bg-orange-500"
        />

        {/* Info Section */}
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">안내사항</h3>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 배너를 클릭하면 해당 상품 페이지로 이동합니다.</li>
            <li>• 모든 상품은 외부 쇼핑몰에서 구매 가능합니다.</li>
            <li>• 회원 전용 할인 코드는 마이페이지에서 확인하세요.</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
