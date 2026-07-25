"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { PenSquare, Image, FileText, Send } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Image from "next/image";

export default function AddForumPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchTitle = watch("title", "");
  const watchDescription = watch("description", "");
  const watchImage = watch("image", "");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/forum-posts", {
        title: data.title,
        image: data.image,
        description: data.description,
      });
      toast.success("Post published successfully!");
      router.push("/dashboard/my-forum-posts");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all";

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Publish Forum Post
          </h1>
          <p className="text-gray-400 text-lg">
            Share knowledge and tips with the community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 bg-[#1e293b] rounded-2xl border border-white/10 p-6 md:p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <div className="relative">
                  <PenSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="e.g., 5 Tips for Better Posture"
                    className={`${inputClass} ${errors.title ? "border-red-500" : ""}`}
                    {...register("title", { required: "Title is required" })}
                  />
                </div>
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className={inputClass}
                    {...register("image")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <textarea
                    rows={10}
                    placeholder="Write your post content here..."
                    className={`${inputClass} resize-none ${errors.description ? "border-red-500" : ""}`}
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publish Post
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden sticky top-10">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Preview
                </h3>
              </div>

              {watchImage ? (
                <div className="h-40 overflow-hidden">
                  <Image
                    src={watchImage}
                    alt="Preview"
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 flex items-center justify-center">
                  <Image className="w-10 h-10 text-emerald-400/30" />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {watchTitle || "Your post title"}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-6 whitespace-pre-wrap">
                  {watchDescription ||
                    "Your post description will appear here..."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
