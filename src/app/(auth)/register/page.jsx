'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { signUp } from '@/lib/auth-client';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import api from '@/lib/api';

function PasswordRequirement({ label, met }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <X className="w-3.5 h-3.5 text-gray-500" />
      )}
      <span className={met ? 'text-emerald-400' : 'text-gray-500'}>{label}</span>
    </div>
  );
}

export default function RegisterPage() {
  const { setUser } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');

  const passwordChecks = {
    minLength: password.length >= 6,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image || undefined,
      });

      if (error) {
        toast.error(error.message || 'Registration failed');
        return;
      }

      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-[#1e293b]' : 'bg-white';
  const cardBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const headingColor = isDark ? 'text-white' : 'text-gray-900';
  const textColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const labelColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDark ? 'bg-[#0f172a]' : 'bg-gray-50';
  const inputBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const inputText = isDark ? 'text-white' : 'text-gray-900';
  const placeholderColor = isDark ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const iconColor = isDark ? 'text-gray-500' : 'text-gray-400';
  const shadowStyle = isDark ? 'shadow-black/20' : 'shadow-gray-200/50';

  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className={`${cardBg} rounded-2xl border ${cardBorder} shadow-2xl ${shadowStyle} p-8`}>
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Dumbbell className="w-8 h-8 text-emerald-400" />
              <span className={`text-2xl font-bold ${headingColor}`}>
                Fit<span className="text-emerald-400">Nexus</span>
              </span>
            </Link>
            <h1 className={`text-2xl font-bold ${headingColor}`}>Create Account</h1>
            <p className={`${textColor} mt-2 text-sm`}>Start your fitness transformation today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>Name</label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input
                  type="text"
                  placeholder="Your full name"
                  className={`w-full pl-11 pr-4 py-3 ${inputBg} border rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
                    errors.name ? 'border-red-500' : inputBorder
                  }`}
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-11 pr-4 py-3 ${inputBg} border rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
                    errors.email ? 'border-red-500' : inputBorder
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>
                Image URL <span className={textColor}>(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
                {...register('image')}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className={`w-full pl-11 pr-12 py-3 ${inputBg} border rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
                    errors.password ? 'border-red-500' : inputBorder
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    validate: {
                      hasUppercase: (v) => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
                      hasLowercase: (v) => /[a-z]/.test(v) || 'Must contain a lowercase letter',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} hover:text-gray-300 transition-colors cursor-pointer`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
              )}
              <div className="mt-2 space-y-1">
                <PasswordRequirement label="At least 6 characters" met={passwordChecks.minLength} />
                <PasswordRequirement label="One uppercase letter" met={passwordChecks.hasUppercase} />
                <PasswordRequirement label="One lowercase letter" met={passwordChecks.hasLowercase} />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${labelColor} mb-2`}>Confirm Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColor}`} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`w-full pl-11 pr-12 py-3 ${inputBg} border rounded-xl ${inputText} ${placeholderColor} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : inputBorder
                  }`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} hover:text-gray-300 transition-colors cursor-pointer`}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p className={`text-center text-sm ${textColor} mt-8`}>
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
