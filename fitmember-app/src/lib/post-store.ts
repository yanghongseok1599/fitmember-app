// Simple in-memory store for posts (will reset on page refresh)
// In production, this would be replaced with a proper backend/database

import { authStore } from './auth-store';

export type BoardType = 'workout' | 'free';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  boardType: BoardType;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  images: string[];
  likes: number;
  commentList: Comment[];
  isLiked: boolean;
  createdAt: string;
}

// Initial mock comments
const initialComments: Comment[] = [
  { id: 'comment-1', postId: 'post-1', userId: 'user-5', userName: '최**', content: '대박! 100kg 축하드려요!', createdAt: '2024-01-20T15:00:00Z' },
  { id: 'comment-2', postId: 'post-1', userId: 'user-6', userName: '정**', content: '저도 목표가 100kg인데 화이팅입니다', createdAt: '2024-01-20T15:30:00Z' },
  { id: 'comment-3', postId: 'post-2', userId: 'user-7', userName: '강**', content: '30일 개근 대단하세요!', createdAt: '2024-01-20T11:00:00Z' },
  { id: 'comment-4', postId: 'post-2', userId: 'user-8', userName: '윤**', content: '다음 달도 화이팅!', createdAt: '2024-01-20T12:00:00Z' },
  { id: 'comment-5', postId: 'post-3', userId: 'user-9', userName: '장**', content: '등 운동 루틴 좋네요', createdAt: '2024-01-19T19:00:00Z' },
  { id: 'comment-6', postId: 'free-1', userId: 'user-10', userName: '한**', content: '저도 궁금했어요!', createdAt: '2024-01-20T09:00:00Z' },
  { id: 'comment-7', postId: 'free-2', userId: 'user-11', userName: '오**', content: '정보 감사합니다', createdAt: '2024-01-19T16:00:00Z' },
];

// Initial mock posts - Workout board
const initialWorkoutPosts: Post[] = [
  {
    id: 'post-1',
    boardType: 'workout',
    userId: 'user-2',
    userName: '김**',
    content: '오늘 하체 루틴 완료! 스쿼트 100kg 5세트 성공했습니다. 꾸준히 하니까 확실히 느는 것 같아요.',
    images: [],
    likes: 24,
    commentList: initialComments.filter(c => c.postId === 'post-1'),
    isLiked: false,
    createdAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 'post-2',
    boardType: 'workout',
    userId: 'user-3',
    userName: '이**',
    content: '30일 출석 챌린지 달성! 한 달 동안 빠지지 않고 나왔네요. 다음 달도 화이팅!',
    images: [],
    likes: 45,
    commentList: initialComments.filter(c => c.postId === 'post-2'),
    isLiked: true,
    createdAt: '2024-01-20T10:15:00Z',
  },
  {
    id: 'post-3',
    boardType: 'workout',
    userId: 'user-4',
    userName: '박**',
    content: '오늘의 등 운동 인증합니다. 렛풀다운, 시티드로우, 바벨로우 3종 세트!',
    images: [],
    likes: 18,
    commentList: initialComments.filter(c => c.postId === 'post-3'),
    isLiked: false,
    createdAt: '2024-01-19T18:45:00Z',
  },
];

// Initial mock posts - Free board
const initialFreePosts: Post[] = [
  {
    id: 'free-1',
    boardType: 'free',
    userId: 'user-5',
    userName: '최**',
    content: '헬스장 운영시간 문의드립니다. 설 연휴에도 정상 운영하나요?',
    images: [],
    likes: 8,
    commentList: initialComments.filter(c => c.postId === 'free-1'),
    isLiked: false,
    createdAt: '2024-01-20T08:30:00Z',
  },
  {
    id: 'free-2',
    boardType: 'free',
    userId: 'user-6',
    userName: '정**',
    content: '단백질 보충제 추천 부탁드려요! 초보라서 뭘 먹어야 할지 모르겠어요.',
    images: [],
    likes: 15,
    commentList: initialComments.filter(c => c.postId === 'free-2'),
    isLiked: true,
    createdAt: '2024-01-19T15:20:00Z',
  },
  {
    id: 'free-3',
    boardType: 'free',
    userId: 'user-7',
    userName: '강**',
    content: '같이 운동하실 분 구합니다! 저녁 7시 이후에 오시는 분들 중에 운동 파트너 구해요.',
    images: [],
    likes: 22,
    commentList: [],
    isLiked: false,
    createdAt: '2024-01-18T20:00:00Z',
  },
];

// In-memory store
let posts: Post[] = [...initialWorkoutPosts, ...initialFreePosts];
let listeners: (() => void)[] = [];

export const postStore = {
  getPosts: (boardType?: BoardType): Post[] => {
    if (boardType) {
      return posts.filter(p => p.boardType === boardType).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return [...posts].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getPost: (postId: string): Post | undefined => {
    return posts.find(p => p.id === postId);
  },

  addPost: (content: string, images: string[], boardType: BoardType = 'workout'): Post => {
    const currentUser = authStore.getUser();
    const newPost: Post = {
      id: `${boardType}-${Date.now()}`,
      boardType,
      userId: currentUser?.id || 'user-1',
      userName: currentUser?.nickname || currentUser?.name || '익명',
      content,
      images,
      likes: 0,
      commentList: [],
      isLiked: false,
      createdAt: new Date().toISOString(),
    };
    posts = [newPost, ...posts];
    listeners.forEach(listener => listener());
    return newPost;
  },

  toggleLike: (postId: string): void => {
    posts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    listeners.forEach(listener => listener());
  },

  addComment: (postId: string, content: string): Comment | null => {
    const currentUser = authStore.getUser();
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: currentUser?.id || 'user-1',
      userName: currentUser?.nickname || currentUser?.name || '익명',
      content,
      createdAt: new Date().toISOString(),
    };

    posts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentList: [...post.commentList, newComment],
        };
      }
      return post;
    });

    listeners.forEach(listener => listener());
    return newComment;
  },

  deleteComment: (postId: string, commentId: string): void => {
    posts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentList: post.commentList.filter(c => c.id !== commentId),
        };
      }
      return post;
    });
    listeners.forEach(listener => listener());
  },

  subscribe: (listener: () => void): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};
