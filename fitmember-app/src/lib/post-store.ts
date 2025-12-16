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

// In-memory store - 빈 배열로 초기화
let posts: Post[] = [];
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
