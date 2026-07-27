"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, X, Loader2, Briefcase, Mail, Calendar } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Image from "next/image";

export default function AppliedTrainersPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplications = () => {
    setLoading(true);
    api
      .get("/users/trainer-applications")
      .then((res) => {
        setApplications(
          res.data.applications ||
            res.data.users ||
            res.data.data ||
            res.data ||
            [],
        );
      })
      .catch(() => {
        toast.error("Failed to fetch applications");
        setApplications([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openModal = (app) => {
    setSelected(app);
    setFeedback("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setFeedback("");
  };

  const handleApprove = async () => {
    setActionLoading("approve");
    try {
      await api.patch(`/users/approve-trainer/${selected._id}`);
      toast.success("Trainer application approved");
      closeModal();
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    setActionLoading("reject");
    try {
      await api.patch(`/users/reject-trainer/${selected._id}`, { feedback });
      toast.success("Trainer application rejected");
      closeModal();
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

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
            Trainer Applications
          </h1>
          <p className="text-gray-400 text-lg">
            Review and manage pending trainer applications
          </p>
        </motion.div>

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
                  <div className="h-8 bg-white/5 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <UserCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No pending applications
            </h3>
            <p className="text-gray-400">
              All trainer applications have been reviewed
            </p>
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
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Applied Date
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {app.image ? (
                            <Image
                              src={app.image}
                              alt={app.name}
                              width={36}
                              height={36}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <UserCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                          )}
                          <span className="text-white font-medium">
                            {app.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white dark:text-gray-400">{app.email}</td>
                      <td className="px-6 py-4 text-white dark:text-gray-400">
                        {app.createdAt
                          ? format(new Date(app.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openModal(app)}
                          className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="md:hidden space-y-4">
              {applications.map((app, idx) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#1e293b] rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {app.image ? (
                      <Image
                        src={app.image}
                        alt={app.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{app.name}</p>
                      <p className="text-gray-400 text-sm">{app.email}</p>
                    </div>
                  </div>
                  {app.createdAt && (
                    <p className="text-xs text-gray-500 mb-3">
                      Applied: {format(new Date(app.createdAt), "MMM d, yyyy")}
                    </p>
                  )}
                  <button
                    onClick={() => openModal(app)}
                    className="w-full py-2 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1e293b] rounded-2xl border border-white/10 w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Application Details
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{selected.name}</p>
                    <p className="text-gray-400 text-sm">{selected.email}</p>
                  </div>
                </div>

                {selected.trainerExperience != null && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-white">
                      {selected.trainerExperience} years
                    </span>
                  </div>
                )}

                {selected.trainerSpecialty && (
                  <div className="flex items-center gap-2 text-sm">
                    <UserCheck className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Specialty:</span>
                    <span className="text-white">
                      {selected.trainerSpecialty}
                    </span>
                  </div>
                )}

                {selected.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Applied:</span>
                    <span className="text-white">
                      {format(new Date(selected.createdAt), "MMMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Admin Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="Optional feedback for the applicant..."
                  className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading === "approve"}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === "approve" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading === "reject"}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === "reject" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
