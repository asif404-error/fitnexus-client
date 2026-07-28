"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, MessageSquare, Plus, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Image from "next/image";
import { useTheme } from "@/providers/ThemeProvider";

export default function MyForumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    api
      .get("/forum-posts/my-posts")
      .then((res) => {
        setPosts(res.data.posts || res.data.data || res.data || []);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/forum-posts/${id}`);
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const readMoreBg = isDark ? "bg-white/5" : "bg-gray-100";

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
            My Forum Posts
          </h1>
          <p className="text-gray-400 text-lg">Manage your published posts</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1e293b] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-24" />
                  <div className="h-6 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                  <div className="h-10 bg-white/5 rounded w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold dark:text-white text-gray-700 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-400 mb-6">
              Share your first post with the community
            </p>
            <Link
              href="/add-forum-post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </Link>
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
                className="group bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent" />
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-sm"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5">
                  {post.createdAt && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3 mb-4">
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
      </div>
    </div>
  );
}
