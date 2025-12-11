import { StoreBanner } from '@/types';

// Mock store banner data
export const storeBanners: StoreBanner[] = [
  // 특가 이벤트
  {
    id: 'special-1',
    title: '12월 특가 세일',
    imageUrl: '/images/banners/december-sale.jpg',
    linkUrl: 'https://example.com/december-sale',
    category: 'special',
    isActive: true,
    order: 1,
  },
  {
    id: 'special-2',
    title: '신규회원 특별 혜택',
    imageUrl: '/images/banners/new-member.jpg',
    linkUrl: 'https://example.com/new-member',
    category: 'special',
    isActive: true,
    order: 2,
  },
  {
    id: 'special-3',
    title: '베스트셀러 모음전',
    imageUrl: '/images/banners/bestseller.jpg',
    linkUrl: 'https://example.com/bestseller',
    category: 'special',
    isActive: true,
    order: 3,
  },

  // 교정용품
  {
    id: 'correction-1',
    title: '자세 교정 밴드',
    imageUrl: '/images/banners/posture-band.jpg',
    linkUrl: 'https://example.com/posture-band',
    category: 'correction',
    isActive: true,
    order: 1,
  },
  {
    id: 'correction-2',
    title: '척추 교정 베개',
    imageUrl: '/images/banners/spine-pillow.jpg',
    linkUrl: 'https://example.com/spine-pillow',
    category: 'correction',
    isActive: true,
    order: 2,
  },
  {
    id: 'correction-3',
    title: '골반 교정 쿠션',
    imageUrl: '/images/banners/pelvis-cushion.jpg',
    linkUrl: 'https://example.com/pelvis-cushion',
    category: 'correction',
    isActive: true,
    order: 3,
  },

  // 운동용품
  {
    id: 'exercise-1',
    title: '덤벨 세트',
    imageUrl: '/images/banners/dumbbell.jpg',
    linkUrl: 'https://example.com/dumbbell',
    category: 'exercise',
    isActive: true,
    order: 1,
  },
  {
    id: 'exercise-2',
    title: '요가 매트',
    imageUrl: '/images/banners/yoga-mat.jpg',
    linkUrl: 'https://example.com/yoga-mat',
    category: 'exercise',
    isActive: true,
    order: 2,
  },
  {
    id: 'exercise-3',
    title: '저항 밴드 세트',
    imageUrl: '/images/banners/resistance-band.jpg',
    linkUrl: 'https://example.com/resistance-band',
    category: 'exercise',
    isActive: true,
    order: 3,
  },

  // 건강용품
  {
    id: 'health-1',
    title: '마사지건',
    imageUrl: '/images/banners/massage-gun.jpg',
    linkUrl: 'https://example.com/massage-gun',
    category: 'health',
    isActive: true,
    order: 1,
  },
  {
    id: 'health-2',
    title: '폼롤러',
    imageUrl: '/images/banners/foam-roller.jpg',
    linkUrl: 'https://example.com/foam-roller',
    category: 'health',
    isActive: true,
    order: 2,
  },
  {
    id: 'health-3',
    title: '찜질팩 세트',
    imageUrl: '/images/banners/hot-pack.jpg',
    linkUrl: 'https://example.com/hot-pack',
    category: 'health',
    isActive: true,
    order: 3,
  },

  // 건강식품
  {
    id: 'food-1',
    title: '프로틴 파우더',
    imageUrl: '/images/banners/protein.jpg',
    linkUrl: 'https://example.com/protein',
    category: 'food',
    isActive: true,
    order: 1,
  },
  {
    id: 'food-2',
    title: '멀티 비타민',
    imageUrl: '/images/banners/vitamin.jpg',
    linkUrl: 'https://example.com/vitamin',
    category: 'food',
    isActive: true,
    order: 2,
  },
  {
    id: 'food-3',
    title: '다이어트 쉐이크',
    imageUrl: '/images/banners/shake.jpg',
    linkUrl: 'https://example.com/shake',
    category: 'food',
    isActive: true,
    order: 3,
  },
];

// Get active banners sorted by order
export const getActiveBanners = (): StoreBanner[] => {
  return storeBanners
    .filter((banner) => banner.isActive)
    .sort((a, b) => a.order - b.order);
};

// Get banners by category
export const getBannersByCategory = (category: StoreBanner['category']): StoreBanner[] => {
  return storeBanners
    .filter((banner) => banner.isActive && banner.category === category)
    .sort((a, b) => a.order - b.order);
};

// Get special event banners (for top slider)
export const getSpecialBanners = (): StoreBanner[] => {
  return getBannersByCategory('special');
};
