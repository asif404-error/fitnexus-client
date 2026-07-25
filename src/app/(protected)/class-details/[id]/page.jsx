"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  Star,
  Heart,
  BadgeCheck,
  Zap,
  Tag,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/api";
import Image from "next/image";

const difficultyColors = {
  Beginner: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border border-red-500/30",
};

export default function ClassDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [cls, setClass] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !id) return;

    const fetchClass = async () => {
      setLoading(true);
      try {
        const [classRes, bookingRes, favRes] = await Promise.all([
          api.get(`/classes/${id}`),
          api
            .get(`/bookings/check/${id}`)
            .catch(() => ({ data: { booked: false } })),
          api
            .get(`/favorites/check/${id}`)
            .catch(() => ({ data: { favorited: false } })),
        ]);

        setClass(classRes.data.class || classRes.data);
        setIsBooked(
          bookingRes.data.booked || bookingRes.data.isBooked || false,
        );
        setIsFavorited(
          favRes.data.isFavorite || favRes.data.favorited || false,
        );
      } catch (err) {
        toast.error("Failed to load class details");
        router.push("/all-classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id, user, router]);

  const handleBooking = () => {
    if (user?.isBlocked) {
      toast.error("Action restricted by Admin");
      return;
    }
    router.push(`/payment/${id}`);
  };

  const handleFavoriteToggle = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      if (isFavorited) {
        await api.delete(`/favorites/${id}`);
        setIsFavorited(false);
        toast.success("Removed from favorites");
      } else {
        await api.post("/favorites", { classId: id });
        setIsFavorited(true);
        toast.success("Added to favorites");
      }
    } catch {
      toast.error("Failed to update favorites");
    } finally {
      setFavLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!cls) return null;
  console.log(cls, "test");
  const scheduleDays =
    cls.schedule?.days?.join(", ") || cls.days?.join(", ") || "TBA";
  const scheduleTime = cls.schedule?.time || cls.time || "TBA";
  const trainerName = cls.trainer?.name || cls.trainerName || "TBA";
  const categoryName =
    cls.category?.name || cls.categoryName || cls.category || "General";
  const difficulty = cls.difficulty || "Beginner";
  const price = Number(cls.price) || 0;
  const bookingCount = cls.bookingCount || cls.bookingsCount || 0;

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <div className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
        {cls.image ? (
          <Image
            src={cls?.image || "/placeholder-image.jpg"}
            alt={cls?.name || "Class Image"}
            width={600}
            height={400}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600/30 via-[#0f172a] to-[#1e293b]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/60 to-transparent" />
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/all-classes"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-gray-200 hover:text-white hover:bg-black/60 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Classes
          </Link>
        </div>
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {cls.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-medium">
              {categoryName}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                difficultyColors[difficulty] || difficultyColors.Beginner
              }`}
            >
              {difficulty}
            </span>
            <span className="flex items-center gap-1.5 text-gray-300 text-sm">
              <Users className="w-4 h-4" />
              {bookingCount} booked
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Trainer</span>
                </div>
                <p className="text-white font-semibold">{trainerName}</p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Duration</span>
                </div>
                <p className="text-white font-semibold">
                  {cls.duration || "TBA"}
                </p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Schedule</span>
                </div>
                <p className="text-white font-semibold text-sm">
                  {scheduleDays}
                </p>
                <p className="text-gray-400 text-xs mt-1">{scheduleTime}</p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Difficulty</span>
                </div>
                <p className="text-white font-semibold">{difficulty}</p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Category</span>
                </div>
                <p className="text-white font-semibold">{categoryName}</p>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Bookings</span>
                </div>
                <p className="text-white font-semibold">{bookingCount}</p>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-xl p-6 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-4">
                About This Class
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {cls.description || "No description available for this class."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm mb-1">Class Price</p>
                <p className="text-4xl font-bold text-emerald-400">
                  ${price.toFixed(2)}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Trainer</span>
                  <span className="text-white font-medium">{trainerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-medium">
                    {cls.duration || "TBA"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Difficulty</span>
                  <span className="text-white font-medium">{difficulty}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Schedule</span>
                  <span className="text-white font-medium text-right">
                    {scheduleDays}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {isBooked ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl bg-gray-600/50 text-gray-400 font-semibold cursor-not-allowed border border-white/5"
                  >
                    Already Booked
                  </button>
                ) : (
                  <button
                    onClick={handleBooking}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
                  >
                    Book Now
                  </button>
                )}

                <button
                  onClick={handleFavoriteToggle}
                  disabled={favLoading}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] border flex items-center justify-center gap-2 ${
                    isFavorited
                      ? "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25"
                      : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {favLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          isFavorited ? "fill-red-400 text-red-400" : ""
                        }`}
                      />
                      {isFavorited ? "Remove Favorite" : "Add to Favorites"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
