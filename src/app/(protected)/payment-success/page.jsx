"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, LayoutDashboard, Loader2, XCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const sessionId = searchParams.get("sessionId");
    const classId = searchParams.get("classId");

    if (!sessionId || !classId) {
      setStatus("error");
      return;
    }

    const verifyAndBook = async () => {
      try {
        await api.post("/payments/verify-session", { sessionId, classId });
        setStatus("success");
        toast.success("Booking confirmed!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to confirm booking");
        setStatus("error");
      }
    };

    verifyAndBook();
  }, [user, searchParams]);

  if (authLoading || status === "loading") {
    return (
      <div className="min-h-screen dark:bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen dark:bg-[#0a0f1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-8">
            <XCircle className="w-14 h-14 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-sm mx-auto">
            We could not verify your payment. Please check your booked classes
            or contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/booked-classes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all"
            >
              View Booked Classes
            </Link>
            <Link
              href="/all-classes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-all border border-white/10"
            >
              Browse Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#0a0f1a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-slide-up">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse-emerald">
            <CheckCircle className="w-14 h-14 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="dark:text-gray-400 leading-relaxed mb-8 max-w-sm mx-auto">
          Your booking has been confirmed. You can view your booked classes in
          the dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/booked-classes"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
          >
            <LayoutDashboard className="w-5 h-5" />
            View Booked Classes
          </Link>
          <Link
            href="/all-classes"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl dark:bg-white/5 bg-gray-200 dark:text-gray-300 font-semibold hover:dark:bg-white/10 hover:bg-gray-300 transition-all duration-200 border border-white/10"
          >
            Browse More Classes
          </Link>
        </div>
      </div>
    </div>
  );
}
