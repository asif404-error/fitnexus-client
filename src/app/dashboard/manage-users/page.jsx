"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchUsers = (pageNum) => {
    setLoading(true);
    api
      .get("/users", { params: { page: pageNum, limit: 12, search } })
      .then((res) => {
        setUsers(res.data.users || res.data.data || res.data || []);
        setTotalPages(res.data.totalPages || res.data.pages || 1);
      })
      .catch(() => {
        toast.error("Failed to fetch users");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1);
  };

  const handleBlockToggle = async (userId) => {
    setActionLoading(userId + "-block");
    try {
      await api.patch(`/users/block/${userId}`);
      toast.success("User status updated");
      fetchUsers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm("Are you sure you want to make this user an admin?"))
      return;
    setActionLoading(userId + "-admin");
    try {
      await api.patch(`/users/make-admin/${userId}`);
      toast.success("User promoted to admin");
      fetchUsers(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      trainer: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      user: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    };
    return styles[role] || styles.user;
  };

  const getStatusBadge = (status) => {
    if (status === "blocked")
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    return "bg-green-500/20 text-green-400 border border-green-500/30";
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
            Manage Users
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage all registered users
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 dark:bg-[#1e293b] bg-sky-900  border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
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
            {[...Array(5)].map((_, i) => (
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
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-400">No users have registered yet</p>
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
                    <th className="text-left px-6 py-4 text-sm font-semibold dark:text-gray-400 text-white">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold dark:text-gray-400 text-white">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold dark:text-gray-400 text-white">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold dark:text-gray-400 text-white">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold dark:text-gray-400 text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <Image
                              src={u.image}
                              alt={u.name}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <Users className="w-4 h-4 text-emerald-400" />
                            </div>
                          )}
                          <span className="text-white font-medium">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 dark:text-gray-400 text-white">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadge(u.role)}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(u.status)}`}
                        >
                          {u.status || "active"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u._id === currentUser?._id ? (
                          <span className="text-xs text-gray-500 italic">
                            Current admin
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleBlockToggle(u._id)}
                              disabled={actionLoading === u._id + "-block"}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50 ${
                                u.status === "blocked"
                                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              }`}
                            >
                              {actionLoading === u._id + "-block" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : u.status === "blocked" ? (
                                "Unblock"
                              ) : (
                                "Block"
                              )}
                            </button>
                            {u.role !== "admin" && (
                              <button
                                onClick={() => handleMakeAdmin(u._id)}
                                disabled={actionLoading === u._id + "-admin"}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                              >
                                {actionLoading === u._id + "-admin" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  "Make Admin"
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="md:hidden space-y-4">
              {users.map((u, idx) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#1e293b] rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {u.image ? (
                      <Image
                        src={u.image}
                        alt={u.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{u.name}</p>
                      <p className="text-gray-400 text-sm">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleBadge(u.role)}`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(u.status)}`}
                    >
                      {u.status || "active"}
                    </span>
                  </div>
                  {u._id !== currentUser?._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBlockToggle(u._id)}
                        disabled={actionLoading === u._id + "-block"}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50 ${
                          u.status === "blocked"
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        }`}
                      >
                        {actionLoading === u._id + "-block" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                        ) : u.status === "blocked" ? (
                          "Unblock"
                        ) : (
                          "Block"
                        )}
                      </button>
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleMakeAdmin(u._id)}
                          disabled={actionLoading === u._id + "-admin"}
                          className="flex-1 py-2 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading === u._id + "-admin" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                          ) : (
                            "Make Admin"
                          )}
                        </button>
                      )}
                    </div>
                  )}
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
