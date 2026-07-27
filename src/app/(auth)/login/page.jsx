"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Dumbbell, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import api from "@/lib/api";

export default function LoginPage() {
  const { setUser } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#1e293b]" : "bg-white";
  const cardBorder = isDark ? "border-white/10" : "border-gray-200";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const labelColor = isDark ? "text-gray-300" : "text-gray-600";
  const inputBg = isDark ? "bg-[#0f172a]" : "bg-gray-50";
  const inputBorder = isDark ? "border-white/10" : "border-gray-200";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark
    ? "placeholder-gray-500"
    : "placeholder-gray-400";
  const iconColor = isDark ? "text-gray-500" : "text-gray-400";
  const dividerBorder = isDark ? "border-white/10" : "border-gray-200";
  const dividerBg = isDark ? "bg-[#1e293b]" : "bg-white";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const shadowStyle = isDark ? "shadow-black/20" : "shadow-gray-200/50";

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }

      await new Promise((r) => setTimeout(r, 300));

      const res = await api.get("/me");
      setUser(res.data.user);
      toast.success("Welcome back!");
      router.push(redirectTo);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "https://fitnexus-client-flame.vercel.app/",
      });
      if (result?.error) {
        toast.error(
          "Google login is not configured yet. Please use email/password.",
        );
      }
    } catch {
      toast.error(
        "Google login is not configured yet. Please use email/password.",
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div
          className={`${cardBg} rounded-2xl border ${cardBorder} shadow-2xl ${shadowStyle} p-8`}
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Dumbbell className="w-8 h-8 text-emerald-400" />
              <span className={`text-2xl font-bold ${headingColor}`}>
                Fit<span className="text-emerald-400">Nexus</span>
              </span>
            </Link>
            <h1 className={`text-2xl font-bold ${headingColor}`}>
              Welcome Back
            </h1>
            <p className={`${textColor} mt-2 text-sm`}>
              Sign in to continue your fitness journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`}
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 ${inputBg} border rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
                    errors.email ? "border-red-500" : inputBorder
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 ${inputBg} border rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
                    errors.password ? "border-red-500" : inputBorder
                  }`}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} hover:text-gray-300 transition-colors cursor-pointer`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${dividerBorder}`} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-3 ${dividerBg} ${mutedText}`}>or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          >
            <FcGoogle className="w-5 h-5" />
            Login with Google
          </button>

          <p className={`text-center text-sm ${mutedText} mt-8`}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
