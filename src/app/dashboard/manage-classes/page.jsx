"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ManageClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchClasses = (pageNum) => {
    setLoading(true);
    api
      .get("/classes/all", { params: { page: pageNum, limit: 12, search } })
      .then((res) => {
        setClasses(res.data.classes || res.data.data || res.data || []);
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      })
      .catch(() => {
        toast.error("Failed to fetch classes");
        setClasses([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClasses(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchClasses(1);
  };

  const handleApprove = async (classId) => {
    setActionLoading(classId + "-approve");
    try {
      await api.patch(`/classes/approve/${classId}`);
      toast.success("Class approved");
      fetchClasses(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve class");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (classId) => {
    setActionLoading(classId + "-reject");
    try {
      await api.patch(`/classes/reject/${classId}`);
      toast.success("Class rejected");
      fetchClasses(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject class");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (classId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this class? This action cannot be undone.",
      )
    )
      return;
    setActionLoading(classId + "-delete");
    try {
      await api.delete(`/classes/${classId}`);
      toast.success("Class deleted");
      fetchClasses(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete class");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-500/20 text-green-400 border border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
      rejected: "bg-red-500/20 text-red-400 border border-red-500/30",
    };
    return styles[status] || styles.pending;
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
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-3">
            Manage Classes
          </h1>
          <p className="text-gray-400 text-lg">
            Review, approve, and manage all classes
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search by class name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 dark:bg-[#1e293b] bg-sky-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
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
            {[...Array(4)].map((_, i) => (
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
        ) : classes.length === 0 ? (
          <div className="text-center py-20">
            <Flame className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No classes found
            </h3>
            <p className="text-gray-400">No classes have been created yet</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="hidden md:block bg-[#1e293b] rounded-2xl border border-white/5 overflow-hidden"
            >
              <table className="w-full bg-sky-900 dark:bg-black">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Class Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Trainer
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Price
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr
                      key={cls._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {cls.image ? (
                            <Image
                              src={cls.image}
                              alt={cls.name}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                              <Flame className="w-4 h-4 text-emerald-400" />
                            </div>
                          )}
                          <span className="text-white font-medium">
                            {cls.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 dark:text-gray-400 text-white">
                        {cls.trainerName || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-gray-300 border border-white/5">
                          {cls.category || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-semibold">
                        {cls.price != null ? `$${cls.price}` : "Free"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(cls.status)}`}
                        >
                          {cls.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {cls.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(cls._id)}
                                disabled={
                                  actionLoading === cls._id + "-approve"
                                }
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === cls._id + "-approve" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  "Approve"
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(cls._id)}
                                disabled={actionLoading === cls._id + "-reject"}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === cls._id + "-reject" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  "Reject"
                                )}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(cls._id)}
                            disabled={actionLoading === cls._id + "-delete"}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400/70 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {actionLoading === cls._id + "-delete" ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              "Delete"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="md:hidden space-y-4">
              {classes.map((cls, idx) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#1e293b] rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {cls.image ? (
                        <Image
                          src={cls.image}
                          alt={cls.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Flame className="w-5 h-5 text-emerald-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{cls.name}</p>
                        <p className="text-gray-400 text-sm">
                          {cls.trainerName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(cls.status)}`}
                    >
                      {cls.status || "pending"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-xs">
                      {cls.category || "N/A"}
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {cls.price != null ? `$${cls.price}` : "Free"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {cls.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(cls._id)}
                          disabled={actionLoading === cls._id + "-approve"}
                          className="flex-1 py-2 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === cls._id + "-approve" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                          ) : (
                            "Approve"
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(cls._id)}
                          disabled={actionLoading === cls._id + "-reject"}
                          className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === cls._id + "-reject" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                          ) : (
                            "Reject"
                          )}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(cls._id)}
                      disabled={actionLoading === cls._id + "-delete"}
                      className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400/70 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading === cls._id + "-delete" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
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
