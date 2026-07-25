"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Plus,
  Dumbbell,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Image,
  Tag,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

const categories = [
  "Yoga",
  "Cardio",
  "Strength",
  "HIIT",
  "Pilates",
  "Dance",
  "Boxing",
  "CrossFit",
  "Weight Training",
];
const difficulties = ["Beginner", "Intermediate", "Advanced"];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const onSubmit = async (data) => {
    if (selectedDays.length === 0) {
      toast.error("Please select at least one schedule day");
      return;
    }
    setLoading(true);
    try {
      await api.post("/classes", {
        name: data.name,
        image: data.image,
        category: data.category,
        difficulty: data.difficulty,
        duration: Number(data.duration),
        scheduleDays: selectedDays,
        scheduleTime: data.scheduleTime,
        price: Number(data.price),
        description: data.description,
      });
      toast.success("Class submitted for review!");
      router.push("/dashboard/my-classes");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add class");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all";

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Add New Class
          </h1>
          <p className="text-gray-400 text-lg">
            Create a new fitness class for students to book
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#1e293b] rounded-2xl border border-white/10 p-6 md:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class Name
              </label>
              <div className="relative">
                <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g., Morning Power Yoga"
                  className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
                  {...register("name", { required: "Class name is required" })}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.name.message}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    className={`${inputClass} appearance-none cursor-pointer`}
                    {...register("category", {
                      required: "Category is required",
                    })}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <select
                    className={`${inputClass} appearance-none cursor-pointer`}
                    {...register("difficulty", {
                      required: "Difficulty is required",
                    })}
                  >
                    <option value="">Select difficulty</option>
                    {difficulties.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.difficulty && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    min="1"
                    placeholder="60"
                    className={`${inputClass} ${errors.duration ? "border-red-500" : ""}`}
                    {...register("duration", {
                      required: "Duration is required",
                      min: { value: 1, message: "Must be at least 1 minute" },
                    })}
                  />
                </div>
                {errors.duration && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    className={`${inputClass} ${errors.price ? "border-red-500" : ""}`}
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 0, message: "Price cannot be negative" },
                    })}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Schedule Days
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      selectedDays.includes(day)
                        ? "bg-emerald-500 text-white"
                        : "bg-[#0f172a] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Schedule Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder='e.g., "6:00 AM - 7:00 AM"'
                  className={`${inputClass} ${errors.scheduleTime ? "border-red-500" : ""}`}
                  {...register("scheduleTime", {
                    required: "Schedule time is required",
                  })}
                />
              </div>
              {errors.scheduleTime && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.scheduleTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <textarea
                  rows={5}
                  placeholder="Describe your class, what students can expect..."
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
                  Submitting...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Class
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
