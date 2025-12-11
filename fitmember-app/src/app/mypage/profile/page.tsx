'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Camera,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Lock,
  AtSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authStore } from '@/lib/auth-store';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [localUser, setLocalUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '',
    phone: '',
    birthDate: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = authStore.getUser();
    setLocalUser(currentUser);
    if (currentUser) {
      setEditForm({
        nickname: currentUser.nickname || '',
        phone: currentUser.phone,
        birthDate: currentUser.birthDate || '',
      });
    }

    const unsubscribe = authStore.subscribe(() => {
      const updated = authStore.getUser();
      setLocalUser(updated);
    });

    return () => unsubscribe();
  }, []);

  // Combine NextAuth session user and local user
  const user = session?.user ? {
    id: (session.user as any).id || 'google-user',
    name: session.user.name || '사용자', // Google 계정 이름
    realName: localUser?.realName || '', // 가입 시 입력한 실명
    nickname: localUser?.nickname || session.user.name || '사용자',
    email: session.user.email || '',
    phone: localUser?.phone || '',
    profileImage: session.user.image || null,
    membershipGrade: 'bronze' as const,
    joinDate: new Date().toISOString(),
    birthDate: localUser?.birthDate || '',
    authProvider: 'google' as const,
  } : localUser;

  // Update editForm when session user changes
  useEffect(() => {
    if (session?.user) {
      setEditForm({
        nickname: localUser?.nickname || session.user.name || '',
        phone: localUser?.phone || '',
        birthDate: localUser?.birthDate || '',
      });
    }
  }, [session, localUser]);

  const handleSaveProfile = () => {
    authStore.updateProfile({
      nickname: editForm.nickname,
      phone: editForm.phone,
      birthDate: editForm.birthDate,
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        authStore.updateProfile({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">로그인이 필요합니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div>
        <p className="watermark-text mb-1">Profile</p>
        <h1 className="text-xl font-light">내 정보 관리</h1>
      </div>

      {/* Profile Image Section */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">프로필 사진</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {user.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="text-sm text-gray-500">
            <p>JPG, PNG 파일만 업로드 가능</p>
            <p className="mt-1">최대 5MB</p>
          </div>
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="bg-white border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-gray-900">기본 정보</h2>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              수정
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProfile}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                저장
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* 실명 - 고정 (수정 불가) */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">실명</label>
            <div className="flex items-center gap-2 h-10">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{user.realName || user.name}</span>
              <span className="text-xs text-gray-400 ml-2">(변경 불가)</span>
            </div>
            {user.authProvider !== 'email' && user.name && user.realName && user.name !== user.realName && (
              <p className="text-xs text-gray-400 mt-1">소셜 계정: {user.name}</p>
            )}
          </div>

          {/* 닉네임 - 수정 가능 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">닉네임</label>
            {isEditing ? (
              <Input
                value={editForm.nickname}
                onChange={(e) =>
                  setEditForm({ ...editForm, nickname: e.target.value })
                }
                className="h-10"
                placeholder="커뮤니티에서 표시될 이름"
              />
            ) : (
              <div className="flex items-center gap-2 h-10">
                <AtSign className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{user.nickname || '미설정'}</span>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">커뮤니티, 명예의 전당 등에서 표시되는 이름입니다.</p>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">전화번호</label>
            {isEditing ? (
              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="h-10"
                placeholder="010-0000-0000"
              />
            ) : (
              <div className="flex items-center gap-2 h-10">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{user.phone || '미설정'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">생년월일</label>
            {isEditing ? (
              <Input
                type="date"
                value={editForm.birthDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, birthDate: e.target.value })
                }
                className="h-10"
              />
            ) : (
              <div className="flex items-center gap-2 h-10">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{user.birthDate || '미설정'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">계정 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">이메일</label>
            <div className="flex items-center gap-2 h-10">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{user.email}</span>
              <span className="text-xs text-gray-400 ml-2">(변경 불가)</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">비밀번호</label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 h-10">
                <Lock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">••••••••</span>
              </div>
              <Button variant="outline" size="sm">
                비밀번호 변경
              </Button>
            </div>
          </div>

          {user.authProvider && user.authProvider !== 'email' && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">연결된 계정</label>
              <div className="flex items-center gap-2 h-10">
                {user.authProvider === 'google' && (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-gray-900">Google 계정으로 로그인</span>
                  </>
                )}
                {user.authProvider === 'kakao' && (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#191919" d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.15.53-.54 1.9-.62 2.2-.1.37.14.37.29.27.12-.08 1.88-1.28 2.64-1.8.63.09 1.29.14 1.98.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                    </svg>
                    <span className="text-gray-900">카카오 계정으로 로그인</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
