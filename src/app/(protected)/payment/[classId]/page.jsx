"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShieldCheck,
  Tag,
  Clock,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/lib/api";

export default function PaymentPage() {
  const { classId } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [cls, setClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !classId) return;

    api
      .get(`/classes/${classId}`)
      .then((res) => {
        setClass(res.data.class || res.data);
      })
      .catch(() => {
        toast.error("Failed to load class details");
        router.push("/all-classes");
      })
      .finally(() => setLoading(false));
  }, [classId, user, router]);

  const handlePayment = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      const res = await api.post("/payments/create-checkout-session", {
        classId,
      });

      const sessionUrl = res.data.url || res.data.sessionUrl;

      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        toast.success("Payment processed successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Payment failed. Please try again.";
      toast.error(msg);
      setProcessing(false);
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

  const trainerName = cls.trainer?.name || cls.trainerName || "TBA";
  const categoryName =
    cls.category?.name || cls.categoryName || cls.category || "General";
  const price = Number(cls.price) || 0;

  return (
    <div className="min-h-screen dark:bg-[#0a0f1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href={`/class-details/${classId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Class Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="dark:bg-[#1e293b] bg-gray-200 rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-bold dark:text-white text-gray-700 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="dark:bg-[#0f172a] rounded-xl p-4 border border-white/5">
                  <h3 className="dark:text-white font-semibold text-lg mb-1">
                    {cls.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs dark:text-gray-400 dark:bg-white/5 px-2.5 py-1 rounded-full">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                      {trainerName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs dark:text-gray-400 dark:bg-white/5 px-2.5 py-1 rounded-full">
                      <Tag className="w-3.5 h-3.5 text-emerald-500" />
                      {categoryName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs dark:text-gray-400 dark:bg-white/5 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      {cls.duration || "TBA"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="dark:text-gray-400">Subtotal</span>
                  <span className="dark:text-white">${price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="dark:text-gray-400">Tax</span>
                  <span className="dark:text-white">$0.00</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                  <span className="dark:text-white font-semibold">Total</span>
                  <span className="text-emerald-500 text-2xl font-bold">
                    ${price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="dark:bg-[#1e293b] bg-gray-200 rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-bold darkLtext-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Payment Details
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm dark:text-gray-400 mb-2">
                    Cardholder Name
                  </label>
                  <div className="w-full dark:bg-[#0f172a] bg-gray-100 border border-white/10 rounded-xl px-4 py-3.5 dark:text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-colors">
                    {user?.name || "Cardholder Name"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm dark:text-gray-400 mb-2">
                    Card Details
                  </label>
                  <div className="w-full dark:bg-[#0f172a] bg-gray-100 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="dark:text-gray-500 text-gray-700">
                        **** **** **** ****
                      </span>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 dark:text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs dark:text-gray-500 mt-2">
                    You will be redirected to Stripe&apos;s secure checkout to
                    complete your payment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-500">
                  Your payment is secured with 256-bit SSL encryption via
                  Stripe.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ${price.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
