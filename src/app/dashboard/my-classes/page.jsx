"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  Users,
  X,
  Dumbbell,
  Clock,
  DollarSign,
  Tag,
  BarChart3,
  Image,
  FileText,
  Calendar,
  Loader2,
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

const statusBadge = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function MyClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updateModal, setUpdateModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [updateForm, setUpdateForm] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [updating, setUpdating] = useState(false);

  const [studentsModal, setStudentsModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsClassName, setStudentsClassName] = useState("");

  const fetchClasses = useCallback(() => {
    setLoading(true);
    api
      .get("/classes/my-classes")
      .then((res) => {
        setClasses(res.data.classes || res.data.data || res.data || []);
      })
      .catch(() => setClasses([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class deleted");
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete class");
    }
  };

  const openUpdateModal = (cls) => {
    setEditingClass(cls);
    setUpdateForm({
      name: cls.name || "",
      image: cls.image || "",
      category: cls.category || "",
      difficulty: cls.difficulty || "",
      duration: cls.duration || "",
      scheduleTime: cls.scheduleTime || "",
      price: cls.price ?? "",
      description: cls.description || "",
    });
    setSelectedDays(cls.scheduleDays || []);
    setUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch(`/classes/${editingClass._id}`, {
        ...updateForm,
        duration: Number(updateForm.duration),
        price: Number(updateForm.price),
        scheduleDays: selectedDays,
      });
      toast.success("Class updated successfully");
      setUpdateModal(false);
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update class");
    } finally {
      setUpdating(false);
    }
  };

  const openStudentsModal = async (cls) => {
    setStudentsClassName(cls.name);
    setStudentsModal(true);
    setStudentsLoading(true);
    setStudents([]);
    try {
      const res = await api.get(`/bookings/${cls._id}`);
      setStudents(res.data.bookings || res.data.data || res.data || []);
    } catch {
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleUpdateChange = (field, value) => {
    setUpdateForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all";

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
            My Classes
          </h1>
          <p className="text-gray-400 text-lg">Manage your fitness classes</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 animate-pulse"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="h-5 bg-white/5 rounded w-40" />
                  <div className="h-5 bg-white/5 rounded w-20" />
                  <div className="h-5 bg-white/5 rounded w-24" />
                  <div className="h-5 bg-white/5 rounded w-16" />
                  <div className="h-5 bg-white/5 rounded w-20" />
                  <div className="flex gap-2 md:ml-auto">
                    <div className="h-8 bg-white/5 rounded w-20" />
                    <div className="h-8 bg-white/5 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20">
            <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No classes yet
            </h3>
            <p className="text-gray-400">
              Start by adding your first fitness class
            </p>
          </div>
        ) : (
          <>

            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-sm font-semibold text-gray-400 px-6 py-4">
                          Class Name
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-400 px-6 py-4">
                          Category
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-400 px-6 py-4">
                          Difficulty
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-400 px-6 py-4">
                          Duration
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-400 px-6 py-4">
                          Price
                        </th>
                        <th className="text-left text-sm font-semibold text-gray-400 px-6 py-4">
                          Status
                        </th>
                        <th className="text-right text-sm font-semibold text-gray-400 px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((cls) => (
                        <tr
                          key={cls._id}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-medium text-white">
                              {cls.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-300">
                              {cls.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-300">
                              {cls.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-300">
                              {cls.duration} min
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-emerald-400 font-medium">
                              ${cls.price}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge[cls.status] || "bg-gray-500/20 text-gray-400"}`}
                            >
                              {cls.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openUpdateModal(cls)}
                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer"
                                title="Update"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(cls._id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openStudentsModal(cls)}
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                                title="View Students"
                              >
                                <Users className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            <div className="md:hidden space-y-4">
              {classes.map((cls, idx) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#1e293b] rounded-2xl border border-white/10 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white">{cls.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ml-2 ${statusBadge[cls.status] || "bg-gray-500/20 text-gray-400"}`}
                    >
                      {cls.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm text-gray-400 mb-4">
                    <p>
                      <span className="text-gray-500">Category:</span>{" "}
                      {cls.category}
                    </p>
                    <p>
                      <span className="text-gray-500">Difficulty:</span>{" "}
                      {cls.difficulty}
                    </p>
                    <p>
                      <span className="text-gray-500">Duration:</span>{" "}
                      {cls.duration} min
                    </p>
                    <p>
                      <span className="text-gray-500">Price:</span>{" "}
                      <span className="text-emerald-400 font-medium">
                        ${cls.price}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openUpdateModal(cls)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button
                      onClick={() => openStudentsModal(cls)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Users className="w-4 h-4" /> Students
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {updateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setUpdateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1e293b] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Update Class</h2>
                <button
                  onClick={() => setUpdateModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Class Name
                  </label>
                  <div className="relative">
                    <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={updateForm.name}
                      onChange={(e) =>
                        handleUpdateChange("name", e.target.value)
                      }
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      value={updateForm.image}
                      onChange={(e) =>
                        handleUpdateChange("image", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <select
                        value={updateForm.category}
                        onChange={(e) =>
                          handleUpdateChange("category", e.target.value)
                        }
                        required
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">Select</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <div className="relative">
                      <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <select
                        value={updateForm.difficulty}
                        onChange={(e) =>
                          handleUpdateChange("difficulty", e.target.value)
                        }
                        required
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">Select</option>
                        {difficulties.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration (min)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="number"
                        min="1"
                        value={updateForm.duration}
                        onChange={(e) =>
                          handleUpdateChange("duration", e.target.value)
                        }
                        required
                        className={inputClass}
                      />
                    </div>
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
                        value={updateForm.price}
                        onChange={(e) =>
                          handleUpdateChange("price", e.target.value)
                        }
                        required
                        className={inputClass}
                      />
                    </div>
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
                      value={updateForm.scheduleTime}
                      onChange={(e) =>
                        handleUpdateChange("scheduleTime", e.target.value)
                      }
                      required
                      className={inputClass}
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
                      rows={4}
                      value={updateForm.description}
                      onChange={(e) =>
                        handleUpdateChange("description", e.target.value)
                      }
                      required
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {studentsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setStudentsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#1e293b] rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Booked Students
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {studentsClassName}
                  </p>
                </div>
                <button
                  onClick={() => setStudentsModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                {studentsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No students yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.map((booking, idx) => {
                      const student = booking.student || booking.user || {};
                      return (
                        <div
                          key={booking._id || idx}
                          className="flex items-center gap-3 p-3 bg-[#0f172a] rounded-xl border border-white/5"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <span className="text-emerald-400 font-semibold text-sm">
                              {(student.name || "S").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {student.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.email || ""}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
