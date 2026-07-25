"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchTrainers = (pageNum) => {
    setLoading(true);
    api
      .get("/users/trainers", { params: { page: pageNum, limit: 12, search } })
      .then((res) => {
        setTrainers(
          res.data.trainers ||
            res.data.users ||
            res.data.data ||
            res.data ||
            [],
        );
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      })
      .catch(() => {
        toast.error("Failed to fetch trainers");
        setTrainers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrainers(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTrainers(1);
  };

  const handleDemote = async (trainerId) => {
    if (
      !window.confirm(
        "Are you sure you want to demote this trainer to a regular user?",
      )
    )
      return;
    setActionLoading(trainerId);
    try {
      await api.patch(`/users/demote-trainer/${trainerId}`);
      toast.success("Trainer demoted to user");
      fetchTrainers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to demote trainer");
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Manage Trainers
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage all active trainers
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#1e293b] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-all duration-300 cursor-pointer"
          >
            Search
          </button>
        </form>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1e293b] rounded-xl p-5 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-20">
            <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No trainers
            </h3>
            <p className="text-gray-400">No trainers have been approved yet</p>
          </div>
        ) : (
          <>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="hidden md:block bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                      Specialty
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((t) => (
                    <tr
                      key={t._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {t.image ? (
                            <Image
                              src={t.image}
                              alt={t.name}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Dumbbell className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                          <span className="text-white font-medium">
                            {t.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{t.email}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {t.trainerSpecialty || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDemote(t._id)}
                          disabled={actionLoading === t._id}
                          className="px-4 py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === t._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            "Demote to User"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="md:hidden space-y-4">
              {trainers.map((t, idx) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#1e293b] rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-blue-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{t.name}</p>
                      <p className="text-gray-400 text-sm">{t.email}</p>
                    </div>
                  </div>
                  {t.trainerSpecialty && (
                    <p className="text-sm text-gray-500 mb-3">
                      Specialty: {t.trainerSpecialty}
                    </p>
                  )}
                  <button
                    onClick={() => handleDemote(t._id)}
                    disabled={actionLoading === t._id}
                    className="w-full py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === t._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                    ) : (
                      "Demote to User"
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
