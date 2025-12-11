'use client';

import { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 'faq-1',
    category: '이용문의',
    question: '회원가입은 어떻게 하나요?',
    answer:
      '앱 첫 화면에서 회원가입 버튼을 누르고, 이메일과 비밀번호를 입력하면 간편하게 가입할 수 있습니다. 소셜 로그인(카카오, 네이버, 구글)도 지원합니다.',
  },
  {
    id: 'faq-2',
    category: '이용문의',
    question: '포인트는 어떻게 적립하나요?',
    answer:
      '매일 출석 체크, 운동 기록, 커뮤니티 인증글 작성 등 다양한 미션을 완료하면 포인트가 적립됩니다. 적립된 포인트는 헬스장 내 상품 구매 시 사용할 수 있습니다.',
  },
  {
    id: 'faq-3',
    category: '주문/배송',
    question: '주문 취소는 어떻게 하나요?',
    answer:
      '마이페이지 > 주문내역에서 취소하고자 하는 주문을 선택한 후 주문취소 버튼을 누르면 됩니다. 단, 배송이 시작된 경우에는 취소가 불가능합니다.',
  },
  {
    id: 'faq-4',
    category: '주문/배송',
    question: '배송은 얼마나 걸리나요?',
    answer:
      '일반적으로 결제 완료 후 2-3일 내에 배송됩니다. 도서산간 지역의 경우 1-2일 추가 소요될 수 있습니다.',
  },
  {
    id: 'faq-5',
    category: '결제/환불',
    question: '환불은 어떻게 받나요?',
    answer:
      '상품 수령 후 7일 이내에 고객센터로 문의하시면 교환/환불 절차를 안내해 드립니다. 단, 상품의 하자가 아닌 단순 변심의 경우 반품 배송비가 발생할 수 있습니다.',
  },
  {
    id: 'faq-6',
    category: '계정/보안',
    question: '비밀번호를 잊어버렸어요',
    answer:
      '로그인 화면에서 비밀번호 찾기를 선택하고 가입 시 사용한 이메일을 입력하면 비밀번호 재설정 링크가 발송됩니다.',
  },
];

const categories = ['전체', '이용문의', '주문/배송', '결제/환불', '계정/보안'];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs =
    selectedCategory === '전체'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div>
        <p className="watermark-text mb-1">Help Center</p>
        <h1 className="text-xl font-light">고객센터</h1>
      </div>

      {/* Contact Info */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">문의하기</h2>
        <div className="space-y-3">
          <a
            href="tel:02-1234-5678"
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">전화 문의</p>
              <p className="text-sm font-medium text-gray-900">02-1234-5678</p>
            </div>
          </a>
          <a
            href="mailto:help@fitmember.com"
            className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">이메일 문의</p>
              <p className="text-sm font-medium text-gray-900">help@fitmember.com</p>
            </div>
          </a>
          <button className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors text-left w-full">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">1:1 채팅 문의</p>
              <p className="text-sm font-medium text-gray-900">채팅 시작하기</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>운영시간: 평일 09:00 - 18:00 (점심 12:00 - 13:00)</span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <h2 className="text-sm font-medium text-gray-900">자주 묻는 질문</h2>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-4 py-2 text-xs rounded-full whitespace-nowrap transition-colors',
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="divide-y divide-border">
          {filteredFaqs.map((faq) => (
            <div key={faq.id}>
              <button
                onClick={() =>
                  setExpandedId(expandedId === faq.id ? null : faq.id)
                }
                className="flex items-center justify-between w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-primary font-medium text-sm">Q</span>
                  <div>
                    <span className="text-xs text-gray-400 mr-2">
                      [{faq.category}]
                    </span>
                    <span className="text-sm text-gray-900">{faq.question}</span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ml-2',
                    expandedId === faq.id && 'rotate-180'
                  )}
                />
              </button>
              {expandedId === faq.id && (
                <div className="px-4 pb-4">
                  <div className="flex gap-3 pl-6 p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 font-medium text-sm">A</span>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Links */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-medium text-gray-900">관련 정보</h2>
        </div>
        <div className="divide-y divide-border">
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">이용약관</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">개인정보 처리방침</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex items-center justify-between w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">환불 정책</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
