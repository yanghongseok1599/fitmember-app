'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Plus,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { postStore, Post, BoardType } from '@/lib/post-store';

export default function CommunityPage() {
  const [activeBoard, setActiveBoard] = useState<BoardType>('workout');
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    setPosts(postStore.getPosts(activeBoard));
    const unsubscribe = postStore.subscribe(() => {
      setPosts(postStore.getPosts(activeBoard));
    });
    return () => unsubscribe();
  }, [activeBoard]);

  const handleLike = (postId: string) => {
    postStore.toggleLike(postId);
  };

  const handleShare = async (post: Post) => {
    const shareData = {
      title: activeBoard === 'workout' ? 'ITN FITNESS 운동 인증' : 'ITN FITNESS 커뮤니티',
      text: post.content || '게시글을 확인해보세요!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch {
      // User cancelled or error
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const handleCommentSubmit = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    postStore.addComment(postId, content);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="py-6 border-b border-border">
        <p className="watermark-text mb-2">Community</p>
        <h1 className="text-xl font-light">커뮤니티</h1>
      </div>

      {/* Board Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveBoard('workout')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2",
            activeBoard === 'workout'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Dumbbell className="h-4 w-4" />
          운동 인증
        </button>
        <button
          onClick={() => setActiveBoard('free')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2",
            activeBoard === 'free'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          자유게시판
        </button>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-border pb-32">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">아직 게시글이 없습니다</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="py-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{post.userName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{post.userName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Post Images */}
              {post.images.length > 0 && (
                <div className={cn(
                  "mb-4 grid gap-2",
                  post.images.length === 1 && "grid-cols-1",
                  post.images.length === 2 && "grid-cols-2",
                  post.images.length >= 3 && "grid-cols-2"
                )}>
                  {post.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Post Content */}
              {post.content && (
                <p className="text-sm leading-relaxed mb-4">{post.content}</p>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-6 mb-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-sm transition-colors"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      post.isLiked ? "fill-primary text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className={cn(
                    post.isLiked ? "text-primary" : "text-muted-foreground"
                  )}>
                    {post.likes}
                  </span>
                </button>
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.commentList.length}</span>
                </button>
                <button
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Comments Section */}
              {post.commentList.length > 0 && (
                <div className="border-t border-border pt-4">
                  {/* Show preview or all comments */}
                  {!expandedComments.has(post.id) && post.commentList.length > 2 && (
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="text-sm text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1"
                    >
                      <ChevronDown className="h-4 w-4" />
                      댓글 {post.commentList.length}개 모두 보기
                    </button>
                  )}

                  <div className="space-y-3">
                    {(expandedComments.has(post.id) ? post.commentList : post.commentList.slice(-2)).map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">{comment.userName.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-foreground/90">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {expandedComments.has(post.id) && post.commentList.length > 2 && (
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="text-sm text-muted-foreground hover:text-foreground mt-3 flex items-center gap-1"
                    >
                      <ChevronUp className="h-4 w-4" />
                      댓글 접기
                    </button>
                  )}
                </div>
              )}

              {/* Comment Input */}
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="댓글을 입력하세요..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit(post.id);
                    }
                  }}
                  className="flex-1 h-9 text-sm rounded-none"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                  className="px-3 h-9 bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Create Post Button - Fixed */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          <Link href={`/community/create?board=${activeBoard}`}>
            <Button className="w-full btn-secondary flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              {activeBoard === 'workout' ? '인증글 작성' : '글 작성'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-2 rounded-sm text-sm animate-fade-in-up">
          링크가 복사되었습니다
        </div>
      )}
    </AppLayout>
  );
}
