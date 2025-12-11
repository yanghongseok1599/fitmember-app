'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 자주 묻는 질문과 답변
const faqResponses: Record<string, string> = {
  '운영시간': '센터 운영시간은 평일 06:00 ~ 23:00, 주말 09:00 ~ 18:00 입니다. 공휴일은 휴무이며, 자세한 휴관일 정보는 공지사항을 확인해주세요.',
  '회원권': '회원권은 1개월, 3개월, 6개월, 12개월 상품이 있습니다. 장기 회원권일수록 월 이용료가 저렴해집니다. 자세한 가격은 센터 방문 또는 전화 문의 부탁드립니다.',
  'pt': 'PT(퍼스널 트레이닝)는 1:1 맞춤 운동 프로그램입니다. 10회, 20회, 30회권으로 구매 가능하며, 체험 PT 1회는 무료입니다!',
  '인바디': '인바디 측정은 센터 내 인바디 기기에서 언제든 무료로 가능합니다. 정확한 측정을 위해 공복 상태에서 측정하시는 것을 권장합니다.',
  '락커': '개인 락커는 월 10,000원에 이용 가능합니다. 일일 락커는 무료로 제공되며, 자물쇠는 개인이 준비해주셔야 합니다.',
  '주차': '건물 지하 주차장 2시간 무료 주차 가능합니다. 추가 주차는 10분당 500원입니다.',
  '샤워': '샤워실은 남녀 구분되어 있으며, 샴푸, 바디워시, 드라이어가 구비되어 있습니다. 수건은 개인 지참 부탁드립니다.',
  '휴회': '휴회는 월 1회, 최소 7일부터 최대 30일까지 가능합니다. 휴회 신청은 마이페이지 또는 센터 방문을 통해 가능합니다.',
  '환불': '환불은 이용 시작일 기준 7일 이내 전액 환불, 이후에는 이용일수 차감 후 잔여금액의 90%가 환불됩니다.',
  '양도': '회원권 양도는 가능합니다. 양도 수수료 10,000원이 발생하며, 센터 방문을 통해 신청 가능합니다.',
};

// AI 응답 생성 (실제로는 API 호출)
const generateAIResponse = async (userMessage: string): Promise<string> => {
  // 시뮬레이션을 위한 딜레이
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  const lowerMessage = userMessage.toLowerCase();

  // FAQ 키워드 매칭
  for (const [keyword, response] of Object.entries(faqResponses)) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      return response;
    }
  }

  // 운동 관련 질문
  if (lowerMessage.includes('운동') || lowerMessage.includes('헬스') || lowerMessage.includes('웨이트')) {
    return '운동에 관한 질문이시군요! 구체적인 운동 방법이나 루틴에 대해서는 저희 트레이너와 상담을 권장드립니다. PT 체험을 신청하시면 1:1 맞춤 상담을 받으실 수 있습니다.';
  }

  // 다이어트 관련
  if (lowerMessage.includes('다이어트') || lowerMessage.includes('살') || lowerMessage.includes('체중')) {
    return '다이어트에 관심이 있으시군요! 효과적인 체중 관리를 위해서는 운동과 식단 관리가 함께 이루어져야 합니다. 인바디 측정 후 트레이너와 상담을 통해 맞춤 프로그램을 추천받아 보세요.';
  }

  // 식단 관련
  if (lowerMessage.includes('식단') || lowerMessage.includes('단백질') || lowerMessage.includes('영양')) {
    return '영양과 식단에 관한 질문이시네요! 일반적으로 체중 1kg당 1.5~2g의 단백질 섭취를 권장합니다. 더 자세한 식단 상담은 트레이너에게 문의해주세요.';
  }

  // 부상/통증 관련
  if (lowerMessage.includes('통증') || lowerMessage.includes('아프') || lowerMessage.includes('부상')) {
    return '운동 중 통증이 있으시다면 무리하지 마시고, 필요시 전문의 상담을 권장드립니다. 센터 내 트레이너에게 말씀해주시면 대체 운동을 안내해 드릴 수 있습니다.';
  }

  // 기본 응답
  return '문의해 주셔서 감사합니다! 해당 질문에 대해서는 센터로 직접 문의해 주시면 더 정확한 안내를 받으실 수 있습니다.\n\n📞 전화: 02-1234-5678\n📧 이메일: info@itnfitness.com\n\n자주 묻는 질문: 운영시간, 회원권, PT, 인바디, 락커, 주차, 샤워, 휴회, 환불, 양도';
};

const quickQuestions = [
  '운영시간이 어떻게 되나요?',
  '회원권 종류와 가격이 궁금해요',
  'PT 이용 방법을 알려주세요',
  '인바디 측정은 어떻게 하나요?',
];

export default function QnAPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '안녕하세요! ITN FITNESS 챗봇입니다.\n\n운동, 회원권, 시설 이용 등 궁금한 점을 물어보세요!\n\n자주 묻는 질문: 운영시간, 회원권, PT, 인바디, 락커, 주차 등',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(userMessage.content);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">ITN FITNESS 챗봇</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  온라인
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={cn(
                  'text-[10px] mt-1',
                  message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                )}>
                  {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">답변 작성 중...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div className="max-w-lg mx-auto px-4 pb-2 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">자주 묻는 질문</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-xs bg-card border border-border rounded-full px-3 py-1.5 hover:bg-muted transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-card border-t border-border sticky bottom-0">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                input.trim() && !isLoading
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            AI 챗봇의 답변은 참고용이며, 정확한 정보는 센터에 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
