// Content store for managing editable page content
// This allows admin to modify page content without code changes

export interface ContentBlock {
  id: string;
  type: 'text' | 'title' | 'description' | 'image' | 'list' | 'html';
  value: string;
  label: string; // Admin-friendly label
}

export interface PageContent {
  pageId: string;
  pageName: string;
  pagePath: string;
  blocks: ContentBlock[];
}

// Default content for all pages
const defaultContent: PageContent[] = [
  {
    pageId: 'home',
    pageName: '홈',
    pagePath: '/',
    blocks: [],
  },
  {
    pageId: 'about',
    pageName: '회사소개',
    pagePath: '/about',
    blocks: [
      // 표시 모드 설정
      { id: 'about-display-mode', type: 'text', value: 'text', label: '표시 모드 (text/image/link)' },
      { id: 'about-image-url', type: 'image', value: '', label: '이미지 모드: 이미지 URL' },
      { id: 'about-link-url', type: 'text', value: '', label: '링크 모드: 외부 링크 URL' },
      // 기본 회사 정보
      { id: 'about-company-name', type: 'title', value: 'ITN FITNESS', label: '회사명' },
      { id: 'about-slogan', type: 'text', value: '건강한 삶을 위한 첫걸음', label: '슬로건' },
      { id: 'about-description', type: 'description', value: 'ITN FITNESS는 회원 한 분 한 분의 건강한 라이프스타일을 위해 최선을 다하는 프리미엄 피트니스 센터입니다. 최신 운동 장비와 전문 트레이너가 여러분의 목표 달성을 함께합니다.', label: '회사 소개' },
      // 섹션 제목들
      { id: 'about-section-values', type: 'text', value: '핵심 가치', label: '섹션 제목: 핵심 가치' },
      { id: 'about-section-facilities', type: 'text', value: '시설 안내', label: '섹션 제목: 시설 안내' },
      { id: 'about-section-trainers', type: 'text', value: '트레이너 소개', label: '섹션 제목: 트레이너' },
      { id: 'about-section-contact', type: 'text', value: '연락처 및 위치', label: '섹션 제목: 연락처' },
      { id: 'about-section-directions', type: 'text', value: '오시는 길', label: '섹션 제목: 오시는 길' },
      // 핵심 가치 (4개)
      { id: 'about-value-1-title', type: 'text', value: '목표 달성', label: '핵심가치1 제목' },
      { id: 'about-value-1-desc', type: 'text', value: '개인 맞춤형 프로그램으로 목표 달성을 지원합니다.', label: '핵심가치1 설명' },
      { id: 'about-value-2-title', type: 'text', value: '전문 트레이너', label: '핵심가치2 제목' },
      { id: 'about-value-2-desc', type: 'text', value: '자격을 갖춘 전문 트레이너가 1:1로 코칭합니다.', label: '핵심가치2 설명' },
      { id: 'about-value-3-title', type: 'text', value: '최신 시설', label: '핵심가치3 제목' },
      { id: 'about-value-3-desc', type: 'text', value: '프리미엄 운동 장비와 쾌적한 환경을 제공합니다.', label: '핵심가치3 설명' },
      { id: 'about-value-4-title', type: 'text', value: '건강한 커뮤니티', label: '핵심가치4 제목' },
      { id: 'about-value-4-desc', type: 'text', value: '함께 운동하며 동기부여를 받는 커뮤니티를 만듭니다.', label: '핵심가치4 설명' },
      // 시설 안내 (8개)
      { id: 'about-facility-1', type: 'text', value: '프리웨이트 존', label: '시설1' },
      { id: 'about-facility-2', type: 'text', value: '머신 운동 존', label: '시설2' },
      { id: 'about-facility-3', type: 'text', value: '카디오 존', label: '시설3' },
      { id: 'about-facility-4', type: 'text', value: '스트레칭 존', label: '시설4' },
      { id: 'about-facility-5', type: 'text', value: 'PT 전용 공간', label: '시설5' },
      { id: 'about-facility-6', type: 'text', value: '인바디 측정실', label: '시설6' },
      { id: 'about-facility-7', type: 'text', value: '남/녀 샤워실', label: '시설7' },
      { id: 'about-facility-8', type: 'text', value: '개인 락커', label: '시설8' },
      // 트레이너 (3명)
      { id: 'about-trainer-1-name', type: 'text', value: '김민호', label: '트레이너1 이름' },
      { id: 'about-trainer-1-role', type: 'text', value: '헤드 트레이너', label: '트레이너1 직책' },
      { id: 'about-trainer-1-specialty', type: 'text', value: '체형교정, 재활운동', label: '트레이너1 전문분야' },
      { id: 'about-trainer-2-name', type: 'text', value: '이서연', label: '트레이너2 이름' },
      { id: 'about-trainer-2-role', type: 'text', value: '시니어 트레이너', label: '트레이너2 직책' },
      { id: 'about-trainer-2-specialty', type: 'text', value: '다이어트, 바디프로필', label: '트레이너2 전문분야' },
      { id: 'about-trainer-3-name', type: 'text', value: '박준혁', label: '트레이너3 이름' },
      { id: 'about-trainer-3-role', type: 'text', value: '트레이너', label: '트레이너3 직책' },
      { id: 'about-trainer-3-specialty', type: 'text', value: '근력강화, 벌크업', label: '트레이너3 전문분야' },
      // 연락처 정보
      { id: 'about-established', type: 'text', value: '2020년', label: '설립년도' },
      { id: 'about-address', type: 'text', value: '서울특별시 강남구 테헤란로 123 피트니스빌딩 2-3층', label: '주소' },
      { id: 'about-phone', type: 'text', value: '02-1234-5678', label: '전화번호' },
      { id: 'about-email', type: 'text', value: 'info@itnfitness.com', label: '이메일' },
      { id: 'about-ceo', type: 'text', value: '홍길동', label: '대표자명' },
      { id: 'about-business-number', type: 'text', value: '123-45-67890', label: '사업자등록번호' },
      { id: 'about-directions', type: 'text', value: '강남역 3번 출구 도보 5분', label: '오시는 길 안내' },
      { id: 'about-operating-hours', type: 'text', value: '평일 06:00-23:00 / 주말 09:00-21:00', label: '운영시간' },
    ],
  },
  {
    pageId: 'challenge',
    pageName: '챌린지',
    pagePath: '/challenge',
    blocks: [
      { id: 'challenge-banner-count', type: 'text', value: '3', label: '배너 개수 (1~5)' },
      { id: 'challenge-banner-1-image', type: 'image', value: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop', label: '배너1 이미지' },
      { id: 'challenge-banner-1-title', type: 'text', value: '이달의 챌린지', label: '배너1 제목' },
      { id: 'challenge-banner-1-subtitle', type: 'text', value: '30일 출석 챌린지에 도전하세요!', label: '배너1 설명' },
      { id: 'challenge-banner-1-link', type: 'text', value: '/challenge', label: '배너1 링크' },
      { id: 'challenge-banner-1-detail-image', type: 'image', value: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop', label: '배너1 상세 이미지' },
      { id: 'challenge-banner-1-detail-content', type: 'description', value: '매일 출석하고 포인트를 적립하세요! 30일 연속 출석 시 특별 보상이 주어집니다.', label: '배너1 상세 내용' },
      { id: 'challenge-banner-2-image', type: 'image', value: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=500&fit=crop', label: '배너2 이미지' },
      { id: 'challenge-banner-2-title', type: 'text', value: '다이어트 챌린지', label: '배너2 제목' },
      { id: 'challenge-banner-2-subtitle', type: 'text', value: '새해 목표 달성! 체중 감량 챌린지', label: '배너2 설명' },
      { id: 'challenge-banner-2-link', type: 'text', value: '/challenge', label: '배너2 링크' },
      { id: 'challenge-banner-2-detail-image', type: 'image', value: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop', label: '배너2 상세 이미지' },
      { id: 'challenge-banner-2-detail-content', type: 'description', value: '체계적인 식단 관리와 운동으로 건강한 다이어트를 시작하세요!', label: '배너2 상세 내용' },
      { id: 'challenge-banner-3-image', type: 'image', value: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=500&fit=crop', label: '배너3 이미지' },
      { id: 'challenge-banner-3-title', type: 'text', value: '근력 UP 챌린지', label: '배너3 제목' },
      { id: 'challenge-banner-3-subtitle', type: 'text', value: '8주 동안 근력을 키워보세요!', label: '배너3 설명' },
      { id: 'challenge-banner-3-link', type: 'text', value: '/challenge', label: '배너3 링크' },
      { id: 'challenge-banner-3-detail-image', type: 'image', value: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&h=600&fit=crop', label: '배너3 상세 이미지' },
      { id: 'challenge-banner-3-detail-content', type: 'description', value: '전문 트레이너와 함께하는 8주 근력 강화 프로그램! 참가자 전원에게 프로틴 쉐이크 제공!', label: '배너3 상세 내용' },
      { id: 'challenge-banner-4-image', type: 'image', value: '', label: '배너4 이미지' },
      { id: 'challenge-banner-4-title', type: 'text', value: '', label: '배너4 제목' },
      { id: 'challenge-banner-4-subtitle', type: 'text', value: '', label: '배너4 설명' },
      { id: 'challenge-banner-4-link', type: 'text', value: '', label: '배너4 링크' },
      { id: 'challenge-banner-4-detail-image', type: 'image', value: '', label: '배너4 상세 이미지' },
      { id: 'challenge-banner-4-detail-content', type: 'description', value: '', label: '배너4 상세 내용' },
      { id: 'challenge-banner-5-image', type: 'image', value: '', label: '배너5 이미지' },
      { id: 'challenge-banner-5-title', type: 'text', value: '', label: '배너5 제목' },
      { id: 'challenge-banner-5-subtitle', type: 'text', value: '', label: '배너5 설명' },
      { id: 'challenge-banner-5-link', type: 'text', value: '', label: '배너5 링크' },
      { id: 'challenge-banner-5-detail-image', type: 'image', value: '', label: '배너5 상세 이미지' },
      { id: 'challenge-banner-5-detail-content', type: 'description', value: '', label: '배너5 상세 내용' },
    ],
  },
  {
    pageId: 'event',
    pageName: '이벤트',
    pagePath: '/event',
    blocks: [
      { id: 'event-banner-count', type: 'text', value: '3', label: '배너 개수 (1~5)' },
      { id: 'event-banner-1-image', type: 'image', value: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=500&fit=crop', label: '배너1 이미지' },
      { id: 'event-banner-1-title', type: 'text', value: '신규 회원 이벤트', label: '배너1 제목' },
      { id: 'event-banner-1-subtitle', type: 'text', value: '첫 등록시 1개월 무료!', label: '배너1 설명' },
      { id: 'event-banner-1-link', type: 'text', value: '/event', label: '배너1 링크' },
      { id: 'event-banner-1-detail-image', type: 'image', value: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', label: '배너1 상세 이미지' },
      { id: 'event-banner-1-detail-content', type: 'description', value: '신규 회원 가입 시 첫 달 이용권이 무료! 지금 바로 건강한 라이프스타일을 시작하세요.', label: '배너1 상세 내용' },
      { id: 'event-banner-2-image', type: 'image', value: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=500&fit=crop', label: '배너2 이미지' },
      { id: 'event-banner-2-title', type: 'text', value: '친구 추천 이벤트', label: '배너2 제목' },
      { id: 'event-banner-2-subtitle', type: 'text', value: '친구와 함께하면 더 즐거워요!', label: '배너2 설명' },
      { id: 'event-banner-2-link', type: 'text', value: '/event', label: '배너2 링크' },
      { id: 'event-banner-2-detail-image', type: 'image', value: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop', label: '배너2 상세 이미지' },
      { id: 'event-banner-2-detail-content', type: 'description', value: '친구를 추천하면 둘 다 10,000P 적립! 함께 운동하고 포인트도 받으세요.', label: '배너2 상세 내용' },
      { id: 'event-banner-3-image', type: 'image', value: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=500&fit=crop', label: '배너3 이미지' },
      { id: 'event-banner-3-title', type: 'text', value: 'PT 할인 이벤트', label: '배너3 제목' },
      { id: 'event-banner-3-subtitle', type: 'text', value: 'PT 10회권 20% 할인!', label: '배너3 설명' },
      { id: 'event-banner-3-link', type: 'text', value: '/event', label: '배너3 링크' },
      { id: 'event-banner-3-detail-image', type: 'image', value: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop', label: '배너3 상세 이미지' },
      { id: 'event-banner-3-detail-content', type: 'description', value: '전문 트레이너와 1:1 퍼스널 트레이닝! 10회권 구매 시 20% 할인 이벤트 진행 중.', label: '배너3 상세 내용' },
      { id: 'event-banner-4-image', type: 'image', value: '', label: '배너4 이미지' },
      { id: 'event-banner-4-title', type: 'text', value: '', label: '배너4 제목' },
      { id: 'event-banner-4-subtitle', type: 'text', value: '', label: '배너4 설명' },
      { id: 'event-banner-4-link', type: 'text', value: '', label: '배너4 링크' },
      { id: 'event-banner-4-detail-image', type: 'image', value: '', label: '배너4 상세 이미지' },
      { id: 'event-banner-4-detail-content', type: 'description', value: '', label: '배너4 상세 내용' },
      { id: 'event-banner-5-image', type: 'image', value: '', label: '배너5 이미지' },
      { id: 'event-banner-5-title', type: 'text', value: '', label: '배너5 제목' },
      { id: 'event-banner-5-subtitle', type: 'text', value: '', label: '배너5 설명' },
      { id: 'event-banner-5-link', type: 'text', value: '', label: '배너5 링크' },
      { id: 'event-banner-5-detail-image', type: 'image', value: '', label: '배너5 상세 이미지' },
      { id: 'event-banner-5-detail-content', type: 'description', value: '', label: '배너5 상세 내용' },
    ],
  },
  {
    pageId: 'blog',
    pageName: '블로그',
    pagePath: '/blog',
    blocks: [
      { id: 'blog-banner-enabled', type: 'text', value: 'true', label: '블로그 배너 활성화 (true/false)' },
      { id: 'blog-banner-count', type: 'text', value: '1', label: '블로그 개수 (1~3)' },
      { id: 'blog-banner-1-url', type: 'text', value: 'https://blog.naver.com/itnfitness', label: '블로그1 URL' },
      { id: 'blog-banner-1-image', type: 'image', value: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop', label: '블로그1 이미지' },
      { id: 'blog-banner-1-title', type: 'text', value: '효과적인 운동 루틴 만들기', label: '블로그1 제목' },
      { id: 'blog-banner-1-description', type: 'text', value: '초보자도 쉽게 따라할 수 있는 운동 루틴을 소개합니다.', label: '블로그1 설명' },
      { id: 'blog-banner-2-url', type: 'text', value: '', label: '블로그2 URL' },
      { id: 'blog-banner-2-image', type: 'image', value: '', label: '블로그2 이미지' },
      { id: 'blog-banner-2-title', type: 'text', value: '', label: '블로그2 제목' },
      { id: 'blog-banner-2-description', type: 'text', value: '', label: '블로그2 설명' },
      { id: 'blog-banner-3-url', type: 'text', value: '', label: '블로그3 URL' },
      { id: 'blog-banner-3-image', type: 'image', value: '', label: '블로그3 이미지' },
      { id: 'blog-banner-3-title', type: 'text', value: '', label: '블로그3 제목' },
      { id: 'blog-banner-3-description', type: 'text', value: '', label: '블로그3 설명' },
    ],
  },
];

// Storage key
const STORAGE_KEY = 'fitmember-page-content';

// Load content from localStorage and merge with default content
const loadContent = (): PageContent[] => {
  if (typeof window === 'undefined') return defaultContent;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const savedContent: PageContent[] = JSON.parse(saved);

      // 기존 저장 데이터에 새로운 기본 블록 병합
      const mergedContent = defaultContent.map(defaultPage => {
        const savedPage = savedContent.find(p => p.pageId === defaultPage.pageId);
        if (!savedPage) {
          return defaultPage;
        }

        // 기존 페이지에 새로운 블록 추가
        const mergedBlocks = defaultPage.blocks.map(defaultBlock => {
          const savedBlock = savedPage.blocks.find(b => b.id === defaultBlock.id);
          return savedBlock || defaultBlock;
        });

        return {
          ...defaultPage,
          blocks: mergedBlocks,
        };
      });

      return mergedContent;
    }
  } catch (error) {
    console.error('Failed to load content:', error);
  }
  return defaultContent;
};

// Save content to localStorage
const saveContent = (content: PageContent[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch (error) {
    console.error('Failed to save content:', error);
  }
};

let contentState: PageContent[] = defaultContent;
let listeners: (() => void)[] = [];

export const contentStore = {
  // Initialize store (call this on client side)
  init: (): void => {
    contentState = loadContent();
  },

  // Get all pages
  getAllPages: (): PageContent[] => {
    return contentState;
  },

  // Get content for a specific page
  getPageContent: (pageId: string): PageContent | undefined => {
    return contentState.find(p => p.pageId === pageId);
  },

  // Get a specific content block value
  getContent: (blockId: string): string => {
    for (const page of contentState) {
      const block = page.blocks.find(b => b.id === blockId);
      if (block) return block.value;
    }
    // Fallback to default content
    for (const page of defaultContent) {
      const block = page.blocks.find(b => b.id === blockId);
      if (block) return block.value;
    }
    return '';
  },

  // Update a content block
  updateContent: (blockId: string, value: string): void => {
    for (const page of contentState) {
      const block = page.blocks.find(b => b.id === blockId);
      if (block) {
        block.value = value;
        saveContent(contentState);
        listeners.forEach(l => l());
        return;
      }
    }
  },

  // Update multiple blocks at once
  updatePageContent: (pageId: string, updates: { blockId: string; value: string }[]): void => {
    const page = contentState.find(p => p.pageId === pageId);
    if (page) {
      for (const update of updates) {
        const block = page.blocks.find(b => b.id === update.blockId);
        if (block) {
          block.value = update.value;
        }
      }
      saveContent(contentState);
      listeners.forEach(l => l());
    }
  },

  // Add a new block to a page
  addBlock: (pageId: string, block: ContentBlock): void => {
    const page = contentState.find(p => p.pageId === pageId);
    if (page) {
      page.blocks.push(block);
      saveContent(contentState);
      listeners.forEach(l => l());
    }
  },

  // Remove a block from a page
  removeBlock: (pageId: string, blockId: string): void => {
    const page = contentState.find(p => p.pageId === pageId);
    if (page) {
      page.blocks = page.blocks.filter(b => b.id !== blockId);
      saveContent(contentState);
      listeners.forEach(l => l());
    }
  },

  // Reset page to default content
  resetPage: (pageId: string): void => {
    const defaultPage = defaultContent.find(p => p.pageId === pageId);
    if (defaultPage) {
      const pageIndex = contentState.findIndex(p => p.pageId === pageId);
      if (pageIndex !== -1) {
        contentState[pageIndex] = JSON.parse(JSON.stringify(defaultPage));
        saveContent(contentState);
        listeners.forEach(l => l());
      }
    }
  },

  // Reset all content to default
  resetAll: (): void => {
    contentState = JSON.parse(JSON.stringify(defaultContent));
    saveContent(contentState);
    listeners.forEach(l => l());
  },

  // Subscribe to changes
  subscribe: (listener: () => void): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
