"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Image, Send, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminAddPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", image: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/forum-posts", {
        title: form.title.trim(),
        image: form.image.trim() || undefined,
        description: form.description.trim(),
      });
      toast.success("Post published successfully");
      router.push("/dashboard/forum-post-manage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Create Forum Post
          </h1>
          <p className="text-gray-400 text-lg">
            Share updates, tips, or announcements with the community
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 md:p-8 space-y-6"
        >
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <FileText className="w-4 h-4" /> Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <Image className="w-4 h-4" /> Image URL{" "}
              <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {form.image && (
              <div className="mt-3 rounded-xl overflow-hidden border border-white/5">
                <Image
                  src={form.image}
                  alt="Preview"
                  width={500}
                  height={192}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={8}
              placeholder="Write your post content here..."
              className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
