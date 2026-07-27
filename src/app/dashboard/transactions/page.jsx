"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, DollarSign } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/payments/transactions")
      .then((res) => {
        setTransactions(
          res.data.transactions || res.data.data || res.data || [],
        );
      })
      .catch(() => {
        toast.error("Failed to fetch transactions");
        setTransactions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0,
  );

  const truncateId = (id) => {
    if (!id) return "N/A";
    if (id.length <= 12) return id;
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
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
            Transactions
          </h1>
          <p className="text-gray-400 text-lg">View all payment transactions</p>
        </motion.div>

        {!loading && transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 bg-sky-900 dark:bg-black rounded-2xl border border-white/5 p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm dark:text-gray-400 text-white">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-emerald-400">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <>
            <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 mb-6 animate-pulse">
              <div className="h-8 bg-white/5 rounded w-40" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1e293b] rounded-xl p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/5 rounded w-1/4" />
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                    </div>
                    <div className="h-6 bg-white/5 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-400">
              Transactions will appear here once payments are made
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
                      User Email
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Class Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Transaction ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white dark:text-gray-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => (
                    <tr
                      key={t._id || idx}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-white dark:text-gray-400">
                        {t.user?.email || t.userEmail || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-white dark:text-gray-400">
                        {t.class?.name || t.className || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-400 font-semibold">
                          ${(t.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-white dark:text-gray-400 text-sm font-mono"
                          title={t.transactionId || t._id}
                        >
                          {truncateId(
                            t.transactionId || t.stripePaymentIntentId || t._id,
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white dark:text-gray-400text-sm">
                        {t.createdAt
                          ? format(new Date(t.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            <div className="md:hidden space-y-4">
              {transactions.map((t, idx) => (
                <motion.div
                  key={t._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-[#1e293b] rounded-xl p-5 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">
                        {t.class?.name || t.className || "N/A"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {t.user?.email || t.userEmail || "N/A"}
                      </p>
                    </div>
                    <span className="text-emerald-400 font-bold text-lg">
                      ${(t.amount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span
                      className="font-mono"
                      title={t.transactionId || t._id}
                    >
                      {truncateId(
                        t.transactionId || t.stripePaymentIntentId || t._id,
                      )}
                    </span>
                    <span>
                      {t.createdAt
                        ? format(new Date(t.createdAt), "MMM d, yyyy")
                        : "N/A"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
