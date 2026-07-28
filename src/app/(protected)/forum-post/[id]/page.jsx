"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Pencil,
  Trash2,
  ChevronLeft,
  User,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import api from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

function CommentItem({ comment, postId, user, onRefresh, depth = 0 }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(
    comment.content || comment.text || "",
  );
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOwner =
    user && (user._id === comment.author?._id || user._id === comment.author);
  const isAdmin = user?.role === "admin";
  const isBlocked = user?.isBlocked;

  const handleEdit = async () => {
    if (!editText.trim()) return;
    setSubmitting(true);
    try {
      await api.patch(`/comments/${comment._id}`, { text: editText });
      toast.success("Comment updated");
      setEditing(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${comment._id}`);
      toast.success("Comment deleted");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/comments/${postId}`, {
        text: replyText,
        parentCommentId: comment._id,
      });
      toast.success("Reply posted");
      setReplyText("");
      setShowReply(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${depth > 0 ? "ml-6 md:ml-10 pl-4 border-l-2 border-white/5" : ""}`}
    >
      <div className="bg-[#1e293b] rounded-xl p-4 border border-white/5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {comment.author?.image ? (
              <Image
                src={comment.author.image || "/default-avatar.png"}
                alt={comment.author.name || "User"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-white">
                {comment.authorName || "Anonymous"}
              </span>
              {comment.createdAt && (
                <span className="text-xs text-gray-500 ml-2">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          </div>
          {(isOwner || isAdmin) && !isBlocked && (
            <div className="flex items-center gap-1">
              {isOwner && (
                <button
                  onClick={() => {
                    setEditing(!editing);
                    setEditText(comment.content || comment.text || "");
                  }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
              {(isOwner || isAdmin) && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 dark:bg-[#0f172a] border border-white/10 rounded-lg dark:text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                disabled={submitting}
                className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-medium rounded-lg hover:bg-emerald-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 bg-white/5 text-gray-400 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed">
            {comment.content || comment.text}
          </p>
        )}

        {user && !isBlocked && depth === 0 && (
          <button
            onClick={() => setShowReply(!showReply)}
            className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Reply
          </button>
        )}
      </div>

      <AnimatePresence>
        {showReply && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 ml-6 md:ml-10"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReply()}
                className="flex-1 px-3 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
              <button
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              user={user}
              onRefresh={onRefresh}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ForumPostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to view this post");
      router.push(`/login?from=/forum-post/${id}`);
      return;
    }
  }, [user, authLoading, id, router]);

  const fetchPost = () => {
    api
      .get(`/forum-posts/${id}`)
      .then((res) => setPost(res.data.post || res.data))
      .catch(() => {
        toast.error("Post not found");
        router.push("/community-forum");
      })
      .finally(() => setLoading(false));
  };

  const fetchComments = () => {
    api
      .get(`/comments/${id}`)
      .then((res) => setComments(res.data.comments || res.data || []))
      .catch(() => setComments([]));
  };

  useEffect(() => {
    if (user) {
      fetchPost();
      fetchComments();
    }
  }, [id, user]);

  const handleLike = async () => {
    if (!user || user.isBlocked) {
      toast.error("You cannot perform this action");
      return;
    }
    setLiking(true);
    try {
      const res = await api.patch(`/forum-posts/${id}/like`);
      setPost((prev) => ({
        ...prev,
        likes: res.data.likes ?? prev.likes,
        dislikes: res.data.dislikes ?? prev.dislikes,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to like");
    } finally {
      setLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!user || user.isBlocked) {
      toast.error("You cannot perform this action");
      return;
    }
    setLiking(true);
    try {
      const res = await api.patch(`/forum-posts/${id}/dislike`);
      setPost((prev) => ({
        ...prev,
        likes: res.data.likes ?? prev.likes,
        dislikes: res.data.dislikes ?? prev.dislikes,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dislike");
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (user?.isBlocked) {
      toast.error("You are blocked from commenting");
      return;
    }
    setSubmittingComment(true);
    try {
      await api.post(`/comments/${id}`, { text: commentText });
      toast.success("Comment posted!");
      setCommentText("");
      fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !post) return null;

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/community-forum"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Forum
          </Link>

          <article className="bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden">
            {post.image && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={post.image || "/placeholder-image.jpg"}
                  alt={post.title || "Post image"}
                  width={1200}
                  height={630}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                {post.author?.image ? (
                  <Image
                    src={post.author.image || "/default-avatar.png"}
                    alt={post.author.name || "Author"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {post.authorName || "Anonymous"}
                  </p>
                  {post.createdAt && (
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {post.description || post.content || ""}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <button
                  onClick={handleLike}
                  disabled={liking || user.isBlocked}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {post.likes.length || 0}
                  </span>
                </button>
                <button
                  onClick={handleDislike}
                  disabled={liking || user.isBlocked}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {post.dislikes.length || 0}
                  </span>
                </button>
                {user.isBlocked && (
                  <span className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    You are blocked
                  </span>
                )}
              </div>
            </div>
          </article>

          <section className="mt-10">
            <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Comments ({comments.length})
            </h2>

            {user && !user.isBlocked && (
              <div className="mb-8">
                <div className="flex gap-3">
                  {user.image ? (
                    <Image
                      src={user.image || "/default-avatar.png"}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your thoughts..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 dark:bg-[#1e293b] bg-gray-200 border border-white/10 rounded-xl dark:text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition-all"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={submittingComment || !commentText.trim()}
                        className="flex items-center gap-2 px-5 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        {submittingComment ? "Posting..." : "Post Comment"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    postId={id}
                    user={user}
                    onRefresh={fetchComments}
                  />
                ))
              )}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
