"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Image from "next/image";

export default function ForumPostManagePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPosts = (pageNum) => {
    setLoading(true);
    api
      .get("/forum-posts", {
        params: { page: pageNum, limit: 12 },
      })
      .then((res) => {
        setPosts(res.data.posts || res.data.data || res.data || []);
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      })
      .catch(() => {
        toast.error("Failed to fetch posts");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleDelete = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    )
      return;
    setActionLoading(postId);
    try {
      await api.delete(`/forum-posts/${postId}`);
      toast.success("Post deleted");
      fetchPosts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    } finally {
      setActionLoading(null);
    }
  };

  const pageNumbers = [];
  for (
    let i = Math.max(1, page - 2);
    i <= Math.min(totalPages, page + 2);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-3">
            Forum Post Management
          </h1>
          <p className="text-gray-400 text-lg">
            Manage all community forum posts
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1e293b] rounded-xl p-5 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-1/4" />
                  </div>
                  <div className="h-8 bg-white/5 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-400">
              No forum posts have been created yet
            </p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="hidden md:block bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden"
            >
              <table className="w-full bg-sky-900 dark:bg-black">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Title
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Author
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Date
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt=""
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-emerald-400" />
                            </div>
                          )}
                          <span className="text-white font-medium line-clamp-1">
                            {post.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 dark:text-gray-400 text-white">
                        {post.authorName || "Anonymous"}
                      </td>
                      <td className="px-6 py-4 dark:text-gray-400 text-white text-sm">
                        {post.createdAt
                          ? format(new Date(post.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={actionLoading === post._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === post._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="md:hidden space-y-4">
              {posts.map((post, idx) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#1e293b] rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white font-medium line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {post.author?.name || "Anonymous"}
                      </p>
                    </div>
                  </div>
                  {post.createdAt && (
                    <p className="text-xs text-gray-500 mb-3">
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </p>
                  )}
                  <button
                    onClick={() => handleDelete(post._id)}
                    disabled={actionLoading === post._id}
                    className="w-full py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === post._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-[#1e293b] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      page === num
                        ? "bg-emerald-500 text-white"
                        : "bg-[#1e293b] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-[#1e293b] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
