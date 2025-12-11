'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Award, Users, Target, Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contentStore } from '@/lib/content-store';

const valueIcons = [Target, Users, Award, Heart];
const valueColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];

export default function AboutPage() {
  const [displayMode, setDisplayMode] = useState<'text' | 'image' | 'link'>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [content, setContent] = useState({
    companyName: 'ITN FITNESS',
    slogan: '건강한 삶을 위한 첫걸음',
    description: '',
    established: '2020년',
    address: '',
    phone: '',
    email: '',
    ceo: '홍길동',
    businessNumber: '123-45-67890',
    directions: '강남역 3번 출구 도보 5분',
    operatingHours: '평일 06:00-23:00 / 주말 09:00-21:00',
    sectionValues: '핵심 가치',
    sectionFacilities: '시설 안내',
    sectionTrainers: '트레이너 소개',
    sectionContact: '연락처 및 위치',
    sectionDirections: '오시는 길',
    facilities: [] as string[],
    values: [] as { title: string; description: string }[],
    trainers: [] as { name: string; role: string; specialty: string }[],
  });

  useEffect(() => {
    contentStore.init();

    const loadContent = () => {
      // Display mode
      const mode = contentStore.getContent('about-display-mode') || 'text';
      setDisplayMode(mode as 'text' | 'image' | 'link');
      setImageUrl(contentStore.getContent('about-image-url') || '');
      setLinkUrl(contentStore.getContent('about-link-url') || '');

      // Load basic company info
      setContent({
        companyName: contentStore.getContent('about-company-name') || 'ITN FITNESS',
        slogan: contentStore.getContent('about-slogan') || '건강한 삶을 위한 첫걸음',
        description: contentStore.getContent('about-description') || 'ITN FITNESS는 회원 한 분 한 분의 건강한 라이프스타일을 위해 최선을 다하는 프리미엄 피트니스 센터입니다.',
        established: contentStore.getContent('about-established') || '2020년',
        address: contentStore.getContent('about-address') || '서울특별시 강남구 테헤란로 123 피트니스빌딩 2-3층',
        phone: contentStore.getContent('about-phone') || '02-1234-5678',
        email: contentStore.getContent('about-email') || 'info@itnfitness.com',
        ceo: contentStore.getContent('about-ceo') || '홍길동',
        businessNumber: contentStore.getContent('about-business-number') || '123-45-67890',
        directions: contentStore.getContent('about-directions') || '강남역 3번 출구 도보 5분',
        operatingHours: contentStore.getContent('about-operating-hours') || '평일 06:00-23:00 / 주말 09:00-21:00',
        sectionValues: contentStore.getContent('about-section-values') || '핵심 가치',
        sectionFacilities: contentStore.getContent('about-section-facilities') || '시설 안내',
        sectionTrainers: contentStore.getContent('about-section-trainers') || '트레이너 소개',
        sectionContact: contentStore.getContent('about-section-contact') || '연락처 및 위치',
        sectionDirections: contentStore.getContent('about-section-directions') || '오시는 길',
        facilities: [
          contentStore.getContent('about-facility-1') || '프리웨이트 존',
          contentStore.getContent('about-facility-2') || '머신 운동 존',
          contentStore.getContent('about-facility-3') || '카디오 존',
          contentStore.getContent('about-facility-4') || '스트레칭 존',
          contentStore.getContent('about-facility-5') || 'PT 전용 공간',
          contentStore.getContent('about-facility-6') || '인바디 측정실',
          contentStore.getContent('about-facility-7') || '남/녀 샤워실',
          contentStore.getContent('about-facility-8') || '개인 락커',
        ].filter(f => f.trim() !== ''),
        values: [
          {
            title: contentStore.getContent('about-value-1-title') || '목표 달성',
            description: contentStore.getContent('about-value-1-desc') || '개인 맞춤형 프로그램으로 목표 달성을 지원합니다.',
          },
          {
            title: contentStore.getContent('about-value-2-title') || '전문 트레이너',
            description: contentStore.getContent('about-value-2-desc') || '자격을 갖춘 전문 트레이너가 1:1로 코칭합니다.',
          },
          {
            title: contentStore.getContent('about-value-3-title') || '최신 시설',
            description: contentStore.getContent('about-value-3-desc') || '프리미엄 운동 장비와 쾌적한 환경을 제공합니다.',
          },
          {
            title: contentStore.getContent('about-value-4-title') || '건강한 커뮤니티',
            description: contentStore.getContent('about-value-4-desc') || '함께 운동하며 동기부여를 받는 커뮤니티를 만듭니다.',
          },
        ].filter(v => v.title.trim() !== ''),
        trainers: [
          {
            name: contentStore.getContent('about-trainer-1-name') || '김민호',
            role: contentStore.getContent('about-trainer-1-role') || '헤드 트레이너',
            specialty: contentStore.getContent('about-trainer-1-specialty') || '체형교정, 재활운동',
          },
          {
            name: contentStore.getContent('about-trainer-2-name') || '이서연',
            role: contentStore.getContent('about-trainer-2-role') || '시니어 트레이너',
            specialty: contentStore.getContent('about-trainer-2-specialty') || '다이어트, 바디프로필',
          },
          {
            name: contentStore.getContent('about-trainer-3-name') || '박준혁',
            role: contentStore.getContent('about-trainer-3-role') || '트레이너',
            specialty: contentStore.getContent('about-trainer-3-specialty') || '근력강화, 벌크업',
          },
        ].filter(t => t.name.trim() !== ''),
      });
    };

    loadContent();

    const unsubscribe = contentStore.subscribe(loadContent);
    return () => unsubscribe();
  }, []);

  // 링크 모드일 때 외부 링크로 리다이렉트
  useEffect(() => {
    if (displayMode === 'link' && linkUrl) {
      window.location.href = linkUrl;
    }
  }, [displayMode, linkUrl]);

  // 이미지 모드
  if (displayMode === 'image' && imageUrl) {
    return (
      <div className="min-h-screen bg-muted pb-24">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-4 py-4">
            <p className="watermark-text">About</p>
            <h1 className="text-xl font-light">회사소개</h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="회사소개"
            className="w-full h-auto"
          />
        </main>
      </div>
    );
  }

  // 링크 모드 로딩 중
  if (displayMode === 'link') {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">페이지 이동 중...</p>
        </div>
      </div>
    );
  }

  // 텍스트 모드 (기본)
  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <p className="watermark-text">About</p>
          <h1 className="text-xl font-light">회사소개</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold">{content.companyName}</h2>
          <p className="text-lg text-primary font-medium">{content.slogan}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </section>

        {/* Values */}
        {content.values.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-medium">{content.sectionValues}</h3>
            <div className="grid grid-cols-2 gap-3">
              {content.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length];
                const color = valueColors[index % valueColors.length];
                return (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-lg p-4 space-y-2"
                  >
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-medium text-sm">{value.title}</h4>
                    <p className="text-xs text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Facilities */}
        {content.facilities.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-medium">{content.sectionFacilities}</h3>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2">
                {content.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trainers */}
        {content.trainers.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-medium">{content.sectionTrainers}</h3>
            <div className="space-y-3">
              {content.trainers.map((trainer, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-medium text-muted-foreground">
                      {trainer.name.slice(0, 1)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{trainer.name}</p>
                    <p className="text-xs text-primary">{trainer.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{trainer.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Info */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">{content.sectionContact}</h3>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            <div className="p-4 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">주소</p>
                <p className="text-sm text-muted-foreground">{content.address}</p>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">전화</p>
                <a href={`tel:${content.phone}`} className="text-sm text-primary">
                  {content.phone}
                </a>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">이메일</p>
                <a href={`mailto:${content.email}`} className="text-sm text-primary">
                  {content.email}
                </a>
              </div>
            </div>
            <div className="p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">운영시간</p>
                <p className="text-sm text-muted-foreground">
                  {content.operatingHours}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">{content.sectionDirections}</h3>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">지도 영역</p>
                <p className="text-xs mt-1">{content.directions}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1 pt-4">
          <p>상호: {content.companyName} | 대표: {content.ceo}</p>
          <p>사업자등록번호: {content.businessNumber}</p>
          <p>설립: {content.established}</p>
        </div>
      </main>
    </div>
  );
}
