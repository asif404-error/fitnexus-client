"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Clock,
  ExternalLink,
  Trash2,
  Loader2,
  Flame,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

const categoryColors = {
  Yoga: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Cardio: "bg-red-500/20 text-red-400 border-red-500/30",
  Strength: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  HIIT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Pilates: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Dance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Boxing: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  CrossFit: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Weight Training": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "Functional Training": "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-[#1e293b] rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-white/5" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-white/5 rounded w-1/3" />
            <div className="h-6 bg-white/5 rounded w-2/3" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-white/5 rounded w-16" />
              <div className="h-6 bg-white/5 rounded w-16" />
            </div>
            <div className="h-10 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FavoriteClassesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    api
      .get("/favorites/my-favorites")
      .then((res) => {
        setFavorites(res.data.favorites || res.data.data || res.data || []);
      })
      .catch(() => {
        setFavorites([]);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleRemove = async (classId) => {
    if (!confirm("Remove this class from your favorites?")) return;
    if (removingId) return;

    setRemovingId(classId);
    try {
      await api.delete(`/favorites/${classId}`);
      setFavorites((prev) =>
        prev.filter((fav) => {
          const cls = fav.class || fav.classId || fav;
          const id = cls?._id || fav.classId?._id || fav.classId;
          return id !== classId;
        }),
      );
    } catch {
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            My Favorite Classes
          </h1>
          <p className="text-gray-400 text-lg">
            Your handpicked classes ready to book
          </p>
        </motion.div>

        {loading ? (
          <CardSkeleton />
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No favorite classes yet
            </h3>
            <p className="text-gray-400 mb-6">
              Browse classes and add your favorites to quickly find them here.
            </p>
            <Link
              href="/all-classes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300"
            >
              Browse Classes
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {favorites.map((fav, idx) => {
                const cls = fav.class || fav.classId || fav;
                const className = cls?.name || fav.className || "Unknown Class";
                const trainerName =
                  cls?.trainer?.name ||
                  cls?.trainerName ||
                  fav.trainerName ||
                  "TBA";
                const category =
                  cls?.category?.name ||
                  cls?.categoryName ||
                  cls?.category ||
                  "General";
                const price = Number(cls?.price ?? fav.price) || 0;
                const duration = cls?.duration || fav.duration || "60";
                const image = cls?.image || fav.image;
                const classId = cls?._id || fav.classId?._id || fav.classId;
                const catColor =
                  categoryColors[category] ||
                  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

                return (
                  <motion.div
                    key={classId || idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {image ? (
                        <Image
                          src={image}
                          alt={className}
                          width={500}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-600/30 to-emerald-900/30 flex items-center justify-center">
                          <Flame className="w-12 h-12 text-emerald-400/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent" />
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${catColor}`}
                      >
                        {category}
                      </span>
                      <button
                        onClick={() => handleRemove(classId)}
                        disabled={removingId === classId}
                        className="absolute top-3 right-3 p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all disabled:opacity-50 cursor-pointer backdrop-blur-sm"
                        title="Remove from favorites"
                      >
                        {removingId === classId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                        {className}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        by {trainerName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {duration} min
                        </span>
                        {price > 0 && (
                          <span className="text-emerald-400 font-semibold">
                            ${price}
                          </span>
                        )}
                      </div>
                      {classId ? (
                        <Link
                          href={`/class-details/${classId}`}
                          className="block w-full text-center py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-emerald-500 hover:text-white transition-all duration-300"
                        >
                          View Details
                        </Link>
                      ) : null}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
