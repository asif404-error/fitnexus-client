"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Users,
  Flame,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import api from "@/lib/api";
import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";

const categories = [
  "All",
  "Yoga",
  "Cardio",
  "Strength",
  "HIIT",
  "Pilates",
  "Dance",
  "Boxing",
  "CrossFit",
];

const categoryColors = {
  Yoga: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Cardio: "bg-red-500/20 text-red-400 border-red-500/30",
  Strength: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  HIIT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Pilates: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Dance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Boxing: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  CrossFit: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-400",
  Intermediate: "bg-yellow-500/20 text-yellow-400",
  Advanced: "bg-red-500/20 text-red-400",
};

export default function AllClassesPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  useEffect(() => {
    setLoading(true);
    api
      .get("/classes", {
        params: {
          page,
          limit: 12,
          search: search,
          category: category === "All" ? "" : category,
        },
      })
      .then((res) => {
        setClasses(res.data.classes || res.data.data || res.data || []);
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      })
      .catch(() => {
        setClasses([]);
      })
      .finally(() => setLoading(false));
  }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setLoading(true);
    api
      .get("/classes", {
        params: {
          page: 1,
          limit: 12,
          search,
          category: category === "All" ? "" : category,
        },
      })
      .then((res) => {
        setClasses(res.data.classes || res.data.data || res.data || []);
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      })
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

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
  const cardFrom = isDark ? "from-[#1e293b]" : "from-white";
  const cardBorder = isDark ? "border-white/5" : "border-gray-200";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark ? "bg-[#1e293b]" : "bg-white";
  const inputBorder = isDark ? "border-white/10" : "border-gray-200";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark
    ? "placeholder-gray-500"
    : "placeholder-gray-400";
  const iconColor = isDark ? "text-gray-500" : "text-gray-400";
  const inactiveBtnBg = isDark
    ? "bg-[#1e293b] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
    : "bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 border border-gray-200";
  const skeletonShimmer = isDark ? "bg-white/5" : "bg-gray-200";
  const viewDetailsBg = isDark ? "bg-white/5" : "bg-gray-100";
  const viewDetailsText = isDark ? "text-white" : "text-gray-700";
  const emptyIconColor = isDark ? "text-gray-600" : "text-gray-300";

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
            All Classes
          </h1>
          <p className={`${textColor} text-lg`}>
            Find the perfect class for your fitness goals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`}
              />
              <input
                type="text"
                placeholder="Search classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 ${inputBg} border ${inputBorder} rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-all duration-300 cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <SlidersHorizontal className={`w-4 h-4 ${iconColor} shrink-0`} />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  category === cat ? "bg-emerald-500 text-white" : inactiveBtnBg
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`${cardBg} rounded-2xl overflow-hidden animate-pulse`}
              >
                <div className={`h-48 ${skeletonShimmer}`} />
                <div className="p-5 space-y-3">
                  <div className={`h-4 ${skeletonShimmer} rounded w-1/3`} />
                  <div className={`h-6 ${skeletonShimmer} rounded w-2/3`} />
                  <div className={`h-4 ${skeletonShimmer} rounded w-1/2`} />
                  <div className="flex gap-2">
                    <div className={`h-6 ${skeletonShimmer} rounded w-16`} />
                    <div className={`h-6 ${skeletonShimmer} rounded w-16`} />
                  </div>
                  <div className={`h-10 ${skeletonShimmer} rounded`} />
                </div>
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20">
            <Flame className={`w-16 h-16 ${emptyIconColor} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold mb-2 ${headingColor}`}>
              No classes found
            </h3>
            <p className={textColor}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {classes.map((cls, idx) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`group ${cardBg} rounded-2xl overflow-hidden border ${cardBorder} hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5`}
              >
                <div className="relative h-48 overflow-hidden">
                  {cls.image ? (
                    <Image
                      src={cls.image}
                      alt={cls.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-600/30 to-emerald-900/30 flex items-center justify-center">
                      <Flame className="w-12 h-12 text-emerald-400/50" />
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${cardFrom}  to-transparent via-transparent h-66`}
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[cls.category] || "bg-emerald-500/20 text-emerald-400"}`}
                  >
                    {cls.category}
                  </span>
                  {cls.difficulty && (
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[cls.difficulty] || "bg-gray-500/20 text-gray-400"}`}
                    >
                      {cls.difficulty}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3
                    className={`text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors ${headingColor}`}
                  >
                    {cls.name}
                  </h3>
                  <p className={`text-sm mb-3 ${textColor}`}>
                    by{" "}
                    {cls.trainer?.name || cls.trainerName || "Unknown Trainer"}
                  </p>
                  <div
                    className={`flex items-center gap-4 text-sm mb-4 ${textColor}`}
                  >
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {cls.duration || "60"} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {cls.bookingCount || 0}
                    </span>
                    {cls.price != null && (
                      <span className="text-emerald-400 font-semibold">
                        ${cls.price}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/class-details/${cls._id}`}
                    className={`block w-full text-center py-2.5 rounded-xl ${viewDetailsBg} ${viewDetailsText} text-sm font-medium hover:bg-emerald-500 hover:text-white transition-all duration-300`}
                  >
                    View Details
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
