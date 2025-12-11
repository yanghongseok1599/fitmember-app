'use client';

import { useState, useMemo } from 'react';
import { AdminGuard, useAdmin } from '@/components/auth/admin-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  Calendar,
  Crown,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';

// 회원 데이터 타입
interface UserTableData {
  id: string;
  name: string; // 표시 이름 (소셜 로그인 시 계정 이름)
  realName: string; // 실제 실명 (가입 시 입력)
  nickname: string;
  email: string;
  phone: string;
  role: 'user' | 'staff' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  membershipGrade: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: string;
  lastLoginAt?: string;
  authProvider?: 'email' | 'google' | 'kakao';
}

// 더미 회원 데이터
const mockUsers: UserTableData[] = [
  {
    id: 'user-1',
    name: '김민수',
    realName: '김민수',
    nickname: '헬린이민수',
    email: 'minsu@example.com',
    phone: '010-1234-5678',
    role: 'user',
    status: 'active',
    membershipGrade: 'gold',
    createdAt: '2023-06-15',
    lastLoginAt: '2024-01-15',
    authProvider: 'email',
  },
  {
    id: 'user-2',
    name: 'ITN FITNESS KOREA', // 구글 계정 이름 예시
    realName: '이영희', // 실제 실명
    nickname: '운동천재',
    email: 'younghee@example.com',
    phone: '010-2345-6789',
    role: 'user',
    status: 'active',
    membershipGrade: 'platinum',
    createdAt: '2023-03-20',
    lastLoginAt: '2024-01-14',
    authProvider: 'google',
  },
  {
    id: 'user-3',
    name: '박철수',
    realName: '박철수',
    nickname: '근육맨',
    email: 'cheolsu@example.com',
    phone: '010-3456-7890',
    role: 'user',
    status: 'suspended',
    membershipGrade: 'silver',
    createdAt: '2023-09-10',
    lastLoginAt: '2024-01-10',
    authProvider: 'email',
  },
  {
    id: 'user-4',
    name: '카카오유저', // 카카오 계정 이름 예시
    realName: '정미라', // 실제 실명
    nickname: '다이어터',
    email: 'mira@example.com',
    phone: '010-4567-8901',
    role: 'user',
    status: 'active',
    membershipGrade: 'bronze',
    createdAt: '2024-01-05',
    lastLoginAt: '2024-01-15',
    authProvider: 'kakao',
  },
  {
    id: 'user-5',
    name: '최준영',
    realName: '최준영',
    nickname: '헬스왕',
    email: 'junyoung@example.com',
    phone: '010-5678-9012',
    role: 'user',
    status: 'inactive',
    membershipGrade: 'gold',
    createdAt: '2023-07-22',
    lastLoginAt: '2023-12-01',
    authProvider: 'email',
  },
  {
    id: 'admin-1',
    name: '관리자',
    realName: '관리자',
    nickname: '관리자',
    email: 'admin@fitmember.com',
    phone: '010-0000-0000',
    role: 'admin',
    status: 'active',
    membershipGrade: 'platinum',
    createdAt: '2023-01-01',
    lastLoginAt: '2024-01-15',
    authProvider: 'email',
  },
  {
    id: 'staff-1',
    name: '직원1',
    realName: '홍직원',
    nickname: '직원홍',
    email: 'staff@fitmember.com',
    phone: '010-1111-1111',
    role: 'staff',
    status: 'active',
    membershipGrade: 'gold',
    createdAt: '2023-06-01',
    lastLoginAt: '2024-01-15',
    authProvider: 'email',
  },
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `user-${i + 6}`,
    name: `회원${i + 6}`,
    realName: `회원${i + 6}`,
    nickname: `닉네임${i + 6}`,
    email: `user${i + 6}@example.com`,
    phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    role: 'user' as const,
    status: ['active', 'active', 'active', 'inactive', 'suspended'][Math.floor(Math.random() * 5)] as 'active' | 'inactive' | 'suspended',
    membershipGrade: ['bronze', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 4)] as 'bronze' | 'silver' | 'gold' | 'platinum',
    createdAt: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    lastLoginAt: `2024-01-${String(Math.floor(Math.random() * 15) + 1).padStart(2, '0')}`,
    authProvider: 'email' as const,
  })),
];

const ITEMS_PER_PAGE = 20;

function UsersPageContent() {
  const { handleLogout } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'staff' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editGrade, setEditGrade] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('bronze');
  const [editRole, setEditRole] = useState<'user' | 'staff' | 'admin'>('user');
  const [users, setUsers] = useState<UserTableData[]>(mockUsers);

  // 필터링된 사용자 목록
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.realName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, roleFilter, statusFilter, users]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const gradeColors: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-700',
    silver: 'bg-gray-200 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-purple-100 text-purple-700',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    suspended: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    active: '활성',
    inactive: '비활성',
    suspended: '정지',
  };

  const handleUserClick = (user: UserTableData) => {
    setSelectedUser(user);
    setEditGrade(user.membershipGrade);
    setEditRole(user.role);
    setIsEditing(false);
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;

    setUsers(prev => prev.map(u =>
      u.id === selectedUser.id
        ? { ...u, membershipGrade: editGrade, role: editRole }
        : u
    ));
    setSelectedUser({ ...selectedUser, membershipGrade: editGrade, role: editRole });
    setIsEditing(false);
  };

  const roleLabels: Record<string, string> = {
    user: '사용자',
    staff: '직원',
    admin: '관리자',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">회원 관리</h1>
                <p className="text-sm text-gray-500">총 {filteredUsers.length}명</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-500"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* 검색 및 필터 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 검색 */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="이름, 이메일, 닉네임으로 검색"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>

              {/* 필터 */}
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value as 'all' | 'user' | 'staff' | 'admin');
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="all">전체 역할</option>
                  <option value="user">사용자</option>
                  <option value="staff">직원</option>
                  <option value="admin">관리자</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'suspended');
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="all">전체 상태</option>
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="suspended">정지</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사용자 테이블 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">회원</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">이메일</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden lg:table-cell">가입일</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">등급</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">상태</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">역할</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.realName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.realName}</p>
                            <p className="text-xs text-gray-500">@{user.nickname}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                        {user.createdAt}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${gradeColors[user.membershipGrade]}`}>
                          {user.membershipGrade}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${statusColors[user.status]}`}>
                          {statusLabels[user.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={user.role === 'admin' ? 'default' : user.role === 'staff' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {roleLabels[user.role]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user);
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-gray-500">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} / {filteredUsers.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;
                    if (page < 1 || page > totalPages) return null;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* 사용자 상세 모달 */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">회원 상세정보</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowUserModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 프로필 */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.realName}</h3>
                  <p className="text-sm text-gray-500">@{selectedUser.nickname}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className={`text-xs ${gradeColors[selectedUser.membershipGrade]}`}>
                      {selectedUser.membershipGrade}
                    </Badge>
                    <Badge className={`text-xs ${statusColors[selectedUser.status]}`}>
                      {statusLabels[selectedUser.status]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 실명 확인 영역 - 관리자용 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium mb-1">가입 시 입력한 실명</p>
                <p className="text-base font-semibold text-blue-900">{selectedUser.realName}</p>
                {selectedUser.authProvider && selectedUser.authProvider !== 'email' && selectedUser.name !== selectedUser.realName && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-xs text-blue-600">소셜 계정 이름: {selectedUser.name}</p>
                    <p className="text-xs text-blue-500 mt-1">
                      ({selectedUser.authProvider === 'google' ? 'Google' : 'Kakao'} 계정으로 가입)
                    </p>
                  </div>
                )}
              </div>

              {/* 상세 정보 */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{selectedUser.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">가입일: {selectedUser.createdAt}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Crown className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    역할: {roleLabels[selectedUser.role]}
                  </span>
                </div>
                {selectedUser.lastLoginAt && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">최근 로그인: {selectedUser.lastLoginAt}</span>
                  </div>
                )}
              </div>

              {/* 등급/역할 수정 폼 */}
              {isEditing ? (
                <div className="space-y-3 pt-2 border-t bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">등급 및 역할 수정</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">회원 등급</label>
                      <select
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value as typeof editGrade)}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      >
                        <option value="bronze">브론즈</option>
                        <option value="silver">실버</option>
                        <option value="gold">골드</option>
                        <option value="platinum">플래티넘</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">역할</label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as typeof editRole)}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      >
                        <option value="user">사용자</option>
                        <option value="staff">직원 (관리자 접근 가능)</option>
                        <option value="admin">관리자</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsEditing(false)}
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary"
                      onClick={handleSaveUser}
                    >
                      저장
                    </Button>
                  </div>
                </div>
              ) : (
                /* 액션 버튼들 */
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    수정
                  </Button>
                  {selectedUser.status === 'active' ? (
                    <Button variant="outline" className="flex-1 text-orange-600" size="sm">
                      <Ban className="h-4 w-4 mr-1" />
                      정지
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1 text-green-600" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      활성화
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 text-red-600" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    삭제
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <UsersPageContent />
    </AdminGuard>
  );
}
