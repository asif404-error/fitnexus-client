"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, ChevronLeft, ChevronRight, User } from "lucide-react";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";

export default function CommunityForumPage() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get("/forum-posts", {
        params: { page, limit: 6 },
      })
      .then((res) => {
        setPosts(res.data.posts || res.data.data || res.data || []);
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page]);

  const pageNumbers = [];
  for (
    let i = Math.max(1, page - 2);
    i <= Math.min(totalPages, page + 2);
    i++
  ) {
    pageNumbers.push(i);
  }

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#1e293b]" : "bg-white";
  const cardBorder = isDark ? "border-white/5" : "border-gray-200";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const skeletonShimmer = isDark ? "bg-white/5" : "bg-gray-200";
  const emptyIconColor = isDark ? "text-gray-600" : "text-gray-300";
  const readMoreBg = isDark ? "bg-white/5" : "bg-gray-100";
  const inputBorder = isDark ? "border-white/10" : "border-gray-200";
  const authorNameColor = isDark ? "text-white" : "text-gray-900";
  const timeColor = isDark ? "text-gray-500" : "text-gray-400";

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${headingColor}`}>
            Community Forum
          </h1>
          <p className={`${textColor} text-lg`}>
            Connect, share, and inspire with fellow fitness enthusiasts
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`${cardBg} rounded-2xl overflow-hidden animate-pulse`}
              >
                <div className={`h-44 ${skeletonShimmer}`} />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${skeletonShimmer}`}
                    />
                    <div className={`h-4 ${skeletonShimmer} rounded w-24`} />
                  </div>
                  <div className={`h-6 ${skeletonShimmer} rounded w-3/4`} />
                  <div className={`h-4 ${skeletonShimmer} rounded w-full`} />
                  <div className={`h-4 ${skeletonShimmer} rounded w-2/3`} />
                  <div className={`h-10 ${skeletonShimmer} rounded w-28`} />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare
              className={`w-16 h-16 ${emptyIconColor} mx-auto mb-4`}
            />
            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>
              No posts yet
            </h3>
            <p className={textColor}>Be the first to start a conversation!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {posts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`group ${cardBg} rounded-2xl overflow-hidden border ${cardBorder} hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5`}
              >
                <div className="relative h-44 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={500}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 flex items-center justify-center">
                      <MessageSquare className="w-12 h-12 text-emerald-400/50" />
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${cardBg} via-transparent to-transparent`}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {post.author?.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-400/30"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    )}
                    <div>
                      <span
                        className={`text-xs font-medium ${authorNameColor}`}
                      >
                        {post.author?.name || "Anonymous"}
                      </span>
                      {post.createdAt && (
                        <span className={`text-[10px] ${timeColor} ml-2`}>
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors ${headingColor}`}
                  >
                    {post.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-3 ${textColor}`}>
                    {post.description?.slice(0, 150) || ""}
                  </p>
                  <Link
                    href={`/forum-post/${post._id}`}
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl ${readMoreBg} text-emerald-400 text-sm font-medium hover:bg-emerald-500 hover:text-white transition-all duration-300`}
                  >
                    Read More
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`p-2 rounded-lg ${cardBg} border ${inputBorder} ${textColor} hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
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
                    : `${cardBg} border ${inputBorder} ${textColor} hover:text-white hover:bg-white/10`
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`p-2 rounded-lg ${cardBg} border ${inputBorder} ${textColor} hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
