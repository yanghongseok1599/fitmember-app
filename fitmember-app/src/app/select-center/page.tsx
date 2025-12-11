'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Building2, ChevronDown, Check, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 지역 데이터 (실제로는 API에서 가져옴)
const regions = [
  { id: 'seoul', name: '서울특별시' },
  { id: 'gyeonggi', name: '경기도' },
  { id: 'incheon', name: '인천광역시' },
  { id: 'busan', name: '부산광역시' },
  { id: 'daegu', name: '대구광역시' },
  { id: 'daejeon', name: '대전광역시' },
  { id: 'gwangju', name: '광주광역시' },
  { id: 'ulsan', name: '울산광역시' },
  { id: 'sejong', name: '세종특별자치시' },
  { id: 'gangwon', name: '강원특별자치도' },
  { id: 'chungbuk', name: '충청북도' },
  { id: 'chungnam', name: '충청남도' },
  { id: 'jeonbuk', name: '전북특별자치도' },
  { id: 'jeonnam', name: '전라남도' },
  { id: 'gyeongbuk', name: '경상북도' },
  { id: 'gyeongnam', name: '경상남도' },
  { id: 'jeju', name: '제주특별자치도' },
];

// 시/군/구 데이터 (전체)
const citiesByRegion: Record<string, { id: string; name: string }[]> = {
  seoul: [
    { id: 'gangnam', name: '강남구' },
    { id: 'gangdong', name: '강동구' },
    { id: 'gangbuk', name: '강북구' },
    { id: 'gangseo', name: '강서구' },
    { id: 'gwanak', name: '관악구' },
    { id: 'gwangjin', name: '광진구' },
    { id: 'guro', name: '구로구' },
    { id: 'geumcheon', name: '금천구' },
    { id: 'nowon', name: '노원구' },
    { id: 'dobong', name: '도봉구' },
    { id: 'dongdaemun', name: '동대문구' },
    { id: 'dongjak', name: '동작구' },
    { id: 'mapo', name: '마포구' },
    { id: 'seodaemun', name: '서대문구' },
    { id: 'seocho', name: '서초구' },
    { id: 'seongdong', name: '성동구' },
    { id: 'seongbuk', name: '성북구' },
    { id: 'songpa', name: '송파구' },
    { id: 'yangcheon', name: '양천구' },
    { id: 'yeongdeungpo', name: '영등포구' },
    { id: 'yongsan', name: '용산구' },
    { id: 'eunpyeong', name: '은평구' },
    { id: 'jongno', name: '종로구' },
    { id: 'jung', name: '중구' },
    { id: 'jungnang', name: '중랑구' },
  ],
  gyeonggi: [
    // 시
    { id: 'suwon', name: '수원시' },
    { id: 'seongnam', name: '성남시' },
    { id: 'goyang', name: '고양시' },
    { id: 'yongin', name: '용인시' },
    { id: 'bucheon', name: '부천시' },
    { id: 'ansan', name: '안산시' },
    { id: 'anyang', name: '안양시' },
    { id: 'namyangju', name: '남양주시' },
    { id: 'hwaseong', name: '화성시' },
    { id: 'pyeongtaek', name: '평택시' },
    { id: 'uijeongbu', name: '의정부시' },
    { id: 'siheung', name: '시흥시' },
    { id: 'paju', name: '파주시' },
    { id: 'gimpo', name: '김포시' },
    { id: 'gwangmyeong', name: '광명시' },
    { id: 'gwangju-gg', name: '광주시' },
    { id: 'gunpo', name: '군포시' },
    { id: 'hanam', name: '하남시' },
    { id: 'osan', name: '오산시' },
    { id: 'icheon', name: '이천시' },
    { id: 'anseong', name: '안성시' },
    { id: 'uiwang', name: '의왕시' },
    { id: 'yangju', name: '양주시' },
    { id: 'pocheon', name: '포천시' },
    { id: 'yeoju', name: '여주시' },
    { id: 'dongducheon', name: '동두천시' },
    { id: 'guri', name: '구리시' },
    { id: 'gwacheon', name: '과천시' },
    // 군
    { id: 'yangpyeong', name: '양평군' },
    { id: 'gapyeong', name: '가평군' },
    { id: 'yeoncheon', name: '연천군' },
  ],
  incheon: [
    // 구
    { id: 'jung-incheon', name: '중구' },
    { id: 'dong-incheon', name: '동구' },
    { id: 'michuhol', name: '미추홀구' },
    { id: 'yeonsu', name: '연수구' },
    { id: 'namdong', name: '남동구' },
    { id: 'bupyeong', name: '부평구' },
    { id: 'gyeyang', name: '계양구' },
    { id: 'seo-incheon', name: '서구' },
    // 군
    { id: 'ganghwa', name: '강화군' },
    { id: 'ongjin', name: '옹진군' },
  ],
  busan: [
    // 구
    { id: 'jung-busan', name: '중구' },
    { id: 'seo-busan', name: '서구' },
    { id: 'dong-busan', name: '동구' },
    { id: 'yeongdo', name: '영도구' },
    { id: 'busanjin', name: '부산진구' },
    { id: 'dongnae', name: '동래구' },
    { id: 'nam-busan', name: '남구' },
    { id: 'buk-busan', name: '북구' },
    { id: 'haeundae', name: '해운대구' },
    { id: 'saha', name: '사하구' },
    { id: 'geumjeong', name: '금정구' },
    { id: 'gangseo-busan', name: '강서구' },
    { id: 'yeonje', name: '연제구' },
    { id: 'suyeong', name: '수영구' },
    { id: 'sasang', name: '사상구' },
    // 군
    { id: 'gijang', name: '기장군' },
  ],
  daegu: [
    // 구
    { id: 'jung-daegu', name: '중구' },
    { id: 'dong-daegu', name: '동구' },
    { id: 'seo-daegu', name: '서구' },
    { id: 'nam-daegu', name: '남구' },
    { id: 'buk-daegu', name: '북구' },
    { id: 'suseong', name: '수성구' },
    { id: 'dalseo', name: '달서구' },
    // 군
    { id: 'dalseong', name: '달성군' },
    { id: 'gunwi', name: '군위군' },
  ],
  daejeon: [
    { id: 'dong-daejeon', name: '동구' },
    { id: 'jung-daejeon', name: '중구' },
    { id: 'seo-daejeon', name: '서구' },
    { id: 'yuseong', name: '유성구' },
    { id: 'daedeok', name: '대덕구' },
  ],
  gwangju: [
    { id: 'dong-gwangju', name: '동구' },
    { id: 'seo-gwangju', name: '서구' },
    { id: 'nam-gwangju', name: '남구' },
    { id: 'buk-gwangju', name: '북구' },
    { id: 'gwangsan', name: '광산구' },
  ],
  ulsan: [
    // 구
    { id: 'jung-ulsan', name: '중구' },
    { id: 'nam-ulsan', name: '남구' },
    { id: 'dong-ulsan', name: '동구' },
    { id: 'buk-ulsan', name: '북구' },
    // 군
    { id: 'ulju', name: '울주군' },
  ],
  sejong: [
    { id: 'sejong-all', name: '세종시 전체' },
  ],
  gangwon: [
    // 시
    { id: 'chuncheon', name: '춘천시' },
    { id: 'wonju', name: '원주시' },
    { id: 'gangneung', name: '강릉시' },
    { id: 'donghae', name: '동해시' },
    { id: 'taebaek', name: '태백시' },
    { id: 'sokcho', name: '속초시' },
    { id: 'samcheok', name: '삼척시' },
    // 군
    { id: 'hongcheon', name: '홍천군' },
    { id: 'hoengseong', name: '횡성군' },
    { id: 'yeongwol', name: '영월군' },
    { id: 'pyeongchang', name: '평창군' },
    { id: 'jeongseon', name: '정선군' },
    { id: 'cheorwon', name: '철원군' },
    { id: 'hwacheon', name: '화천군' },
    { id: 'yanggu', name: '양구군' },
    { id: 'inje', name: '인제군' },
    { id: 'goseong-gw', name: '고성군' },
    { id: 'yangyang', name: '양양군' },
  ],
  chungbuk: [
    // 시
    { id: 'cheongju', name: '청주시' },
    { id: 'chungju', name: '충주시' },
    { id: 'jecheon', name: '제천시' },
    // 군
    { id: 'boeun', name: '보은군' },
    { id: 'okcheon', name: '옥천군' },
    { id: 'yeongdong', name: '영동군' },
    { id: 'jeungpyeong', name: '증평군' },
    { id: 'jincheon', name: '진천군' },
    { id: 'goesan', name: '괴산군' },
    { id: 'eumseong', name: '음성군' },
    { id: 'danyang', name: '단양군' },
  ],
  chungnam: [
    // 시
    { id: 'cheonan', name: '천안시' },
    { id: 'gongju', name: '공주시' },
    { id: 'boryeong', name: '보령시' },
    { id: 'asan', name: '아산시' },
    { id: 'seosan', name: '서산시' },
    { id: 'nonsan', name: '논산시' },
    { id: 'gyeryong', name: '계룡시' },
    { id: 'dangjin', name: '당진시' },
    // 군
    { id: 'geumsan', name: '금산군' },
    { id: 'buyeo', name: '부여군' },
    { id: 'seocheon', name: '서천군' },
    { id: 'cheongyang', name: '청양군' },
    { id: 'hongseong', name: '홍성군' },
    { id: 'yesan', name: '예산군' },
    { id: 'taean', name: '태안군' },
  ],
  jeonbuk: [
    // 시
    { id: 'jeonju', name: '전주시' },
    { id: 'gunsan', name: '군산시' },
    { id: 'iksan', name: '익산시' },
    { id: 'jeongeup', name: '정읍시' },
    { id: 'namwon', name: '남원시' },
    { id: 'gimje', name: '김제시' },
    // 군
    { id: 'wanju', name: '완주군' },
    { id: 'jinan', name: '진안군' },
    { id: 'muju', name: '무주군' },
    { id: 'jangsu', name: '장수군' },
    { id: 'imsil', name: '임실군' },
    { id: 'sunchang', name: '순창군' },
    { id: 'gochang', name: '고창군' },
    { id: 'buan', name: '부안군' },
  ],
  jeonnam: [
    // 시
    { id: 'mokpo', name: '목포시' },
    { id: 'yeosu', name: '여수시' },
    { id: 'suncheon', name: '순천시' },
    { id: 'naju', name: '나주시' },
    { id: 'gwangyang', name: '광양시' },
    // 군
    { id: 'damyang', name: '담양군' },
    { id: 'gokseong', name: '곡성군' },
    { id: 'gurye', name: '구례군' },
    { id: 'goheung', name: '고흥군' },
    { id: 'boseong', name: '보성군' },
    { id: 'hwasun', name: '화순군' },
    { id: 'jangheung', name: '장흥군' },
    { id: 'gangjin', name: '강진군' },
    { id: 'haenam', name: '해남군' },
    { id: 'yeongam', name: '영암군' },
    { id: 'muan', name: '무안군' },
    { id: 'hampyeong', name: '함평군' },
    { id: 'yeonggwang', name: '영광군' },
    { id: 'jangseong', name: '장성군' },
    { id: 'wando', name: '완도군' },
    { id: 'jindo', name: '진도군' },
    { id: 'sinan', name: '신안군' },
  ],
  gyeongbuk: [
    // 시
    { id: 'pohang', name: '포항시' },
    { id: 'gyeongju', name: '경주시' },
    { id: 'gimcheon', name: '김천시' },
    { id: 'andong', name: '안동시' },
    { id: 'gumi', name: '구미시' },
    { id: 'yeongju', name: '영주시' },
    { id: 'yeongcheon', name: '영천시' },
    { id: 'sangju', name: '상주시' },
    { id: 'mungyeong', name: '문경시' },
    { id: 'gyeongsan', name: '경산시' },
    // 군
    { id: 'uiseong', name: '의성군' },
    { id: 'cheongsong', name: '청송군' },
    { id: 'yeongyang', name: '영양군' },
    { id: 'yeongdeok', name: '영덕군' },
    { id: 'cheongdo', name: '청도군' },
    { id: 'goryeong', name: '고령군' },
    { id: 'seongju', name: '성주군' },
    { id: 'chilgok', name: '칠곡군' },
    { id: 'yecheon', name: '예천군' },
    { id: 'bonghwa', name: '봉화군' },
    { id: 'uljin', name: '울진군' },
    { id: 'ulleung', name: '울릉군' },
  ],
  gyeongnam: [
    // 시
    { id: 'changwon', name: '창원시' },
    { id: 'jinju', name: '진주시' },
    { id: 'tongyeong', name: '통영시' },
    { id: 'sacheon', name: '사천시' },
    { id: 'gimhae', name: '김해시' },
    { id: 'miryang', name: '밀양시' },
    { id: 'geoje', name: '거제시' },
    { id: 'yangsan', name: '양산시' },
    // 군
    { id: 'uiryeong', name: '의령군' },
    { id: 'haman', name: '함안군' },
    { id: 'changnyeong', name: '창녕군' },
    { id: 'goseong-gn', name: '고성군' },
    { id: 'namhae', name: '남해군' },
    { id: 'hadong', name: '하동군' },
    { id: 'sancheong', name: '산청군' },
    { id: 'hamyang', name: '함양군' },
    { id: 'geochang', name: '거창군' },
    { id: 'hapcheon', name: '합천군' },
  ],
  jeju: [
    { id: 'jeju-city', name: '제주시' },
    { id: 'seogwipo', name: '서귀포시' },
  ],
};

// 등록된 센터 데이터 (ITN FITNESS만 등록)
interface CenterData {
  id: string;
  name: string;
  address: string;
  regionId: string;
  cityId: string;
}

const registeredCenters: CenterData[] = [
  // 강원도 동해시
  { id: 'itn-donghae', name: 'ITN FITNESS 동해점', address: '강원도 동해시 천곡동 123', regionId: 'gangwon', cityId: 'donghae' },
];

export default function SelectCenterPage() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const selectedRegionData = regions.find((r) => r.id === selectedRegion);
  const availableCities = selectedRegion ? citiesByRegion[selectedRegion] || [] : [];
  const selectedCityData = availableCities.find((c) => c.id === selectedCity);

  // 선택된 지역/시에 해당하는 등록된 센터만 필터링
  const availableCenters = useMemo(() => {
    return registeredCenters.filter((center) => {
      if (selectedRegion && selectedCity) {
        return center.regionId === selectedRegion && center.cityId === selectedCity;
      }
      if (selectedRegion) {
        return center.regionId === selectedRegion;
      }
      return false;
    });
  }, [selectedRegion, selectedCity]);

  const selectedCenterData = availableCenters.find((c) => c.id === selectedCenter);

  const handleConfirm = () => {
    if (selectedRegion && selectedCenter) {
      // 선택한 센터 정보 저장
      localStorage.setItem('selectedCenter', JSON.stringify({
        regionId: selectedRegion,
        regionName: selectedRegionData?.name,
        cityId: selectedCity,
        cityName: selectedCityData?.name,
        centerId: selectedCenter,
        centerName: selectedCenterData?.name,
        centerAddress: selectedCenterData?.address,
      }));
      localStorage.setItem('centerSelected', 'true');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F7F4] to-white flex flex-col">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-4 mx-auto">
            <span className="text-3xl font-bold text-white">ITN</span>
          </div>
          <h1 className="text-2xl font-light text-center text-gray-900">
            FitMember
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            나만의 피트니스 파트너
          </p>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            센터를 선택해주세요
          </h2>
          <p className="text-sm text-gray-500">
            이용하실 피트니스 센터를 선택하면<br />
            맞춤형 서비스를 제공해드립니다
          </p>
        </div>

        {/* Selection Form */}
        <div className="w-full max-w-sm space-y-4">
          {/* Region Select */}
          <div className="relative">
            <label className="text-sm text-gray-600 mb-2 block">
              시/도 선택
            </label>
            <button
              onClick={() => {
                setShowRegionDropdown(!showRegionDropdown);
                setShowCityDropdown(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 bg-white border rounded-xl transition-colors",
                showRegionDropdown ? "border-primary" : "border-gray-200",
                selectedRegion ? "text-gray-900" : "text-gray-400"
              )}
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{selectedRegionData?.name || '시/도를 선택하세요'}</span>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 text-gray-400 transition-transform",
                showRegionDropdown && "rotate-180"
              )} />
            </button>

            {/* Region Dropdown */}
            {showRegionDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      setSelectedRegion(region.id);
                      setSelectedCity(null);
                      setSelectedCenter(null);
                      setShowRegionDropdown(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      selectedRegion === region.id && "bg-primary/5 text-primary"
                    )}
                  >
                    <span>{region.name}</span>
                    {selectedRegion === region.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* City Select */}
          <div className="relative">
            <label className="text-sm text-gray-600 mb-2 block">
              시/군/구 선택
            </label>
            {!selectedRegion ? (
              <div className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-400">
                <Navigation className="h-5 w-5" />
                <span>먼저 시/도를 선택하세요</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowCityDropdown(!showCityDropdown);
                    setShowRegionDropdown(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 bg-white border rounded-xl transition-colors",
                    showCityDropdown ? "border-primary" : "border-gray-200",
                    selectedCity ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-gray-400" />
                    <span>{selectedCityData?.name || '시/군/구를 선택하세요'}</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-gray-400 transition-transform",
                    showCityDropdown && "rotate-180"
                  )} />
                </button>

                {/* City Dropdown */}
                {showCityDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                    {availableCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city.id);
                          setSelectedCenter(null);
                          setShowCityDropdown(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                          selectedCity === city.id && "bg-primary/5 text-primary"
                        )}
                      >
                        <span>{city.name}</span>
                        {selectedCity === city.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Center Select */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              센터 선택
            </label>
            {!selectedRegion ? (
              <div className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-400">
                <Building2 className="h-5 w-5" />
                <span>먼저 지역을 선택하세요</span>
              </div>
            ) : availableCenters.length === 0 ? (
              <div className="w-full flex flex-col items-center gap-2 px-4 py-6 bg-gray-50 border border-gray-200 rounded-xl text-gray-400">
                <Building2 className="h-8 w-8" />
                <span className="text-sm">해당 지역에 등록된 센터가 없습니다</span>
                <span className="text-xs">다른 지역을 선택해주세요</span>
              </div>
            ) : (
              <div className="space-y-2">
                {availableCenters.map((center) => (
                  <button
                    key={center.id}
                    onClick={() => setSelectedCenter(center.id)}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3.5 bg-white border rounded-xl text-left transition-all",
                      selectedCenter === center.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Building2 className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      selectedCenter === center.id ? "text-primary" : "text-gray-400"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium",
                        selectedCenter === center.id ? "text-primary" : "text-gray-900"
                      )}>
                        {center.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {center.address}
                      </p>
                    </div>
                    {selectedCenter === center.id && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="max-w-sm mx-auto">
          <Button
            onClick={handleConfirm}
            disabled={!selectedRegion || !selectedCenter}
            className="w-full h-14 text-base bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400"
          >
            시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
