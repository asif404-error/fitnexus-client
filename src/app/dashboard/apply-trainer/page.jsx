'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { GraduationCap, Loader2, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

const specialties = [
  'Yoga',
  'Cardio',
  'Strength',
  'HIIT',
  'Pilates',
  'Dance',
  'Boxing',
  'CrossFit',
  'Weight Training',
  'Functional Training',
];

export default function ApplyTrainerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      experience: '',
      specialty: '',
      additionalInfo: '',
    },
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    if (user.role === 'trainer' || user.role === 'admin') {
      setApplicationStatus('already-trainer');
      setLoading(false);
      return;
    }

    if (user.trainerApplicationStatus && user.trainerApplicationStatus !== 'none') {
      setApplicationStatus(user.trainerApplicationStatus);
    }
    setLoading(false);
  }, [user, authLoading]);

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await api.patch('/users/apply-trainer', {
        experience: Number(data.experience),
        specialty: data.specialty,
        additionalInfo: data.additionalInfo || undefined,
      });
      toast.success('Application submitted successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (applicationStatus === 'already-trainer') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Already a Trainer</h2>
          <p className="text-gray-400 mb-6">You already have trainer privileges on FitNexus.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  if (applicationStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Pending</h2>
          <p className="text-gray-400 mb-6">Your application is pending. Please wait for admin review.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
          >
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  const showReapplication = applicationStatus === 'rejected';

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {showReapplication && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-red-400 font-semibold text-sm">Application Rejected</h3>
                  <p className="text-red-400/80 text-sm mt-1">
                    Your application was rejected. Admin feedback:{' '}
                    <span className="font-medium text-red-300">
                      {user?.trainerFeedback || 'No feedback provided.'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Apply as Trainer</h1>
            </div>
            <p className="text-gray-400 text-sm mb-8 ml-13">
              Fill out the form below to apply as a trainer on FitNexus
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Years of Experience <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  placeholder="e.g. 5"
                  className={`w-full px-4 py-3 bg-[#0f172a] border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${
                    errors.experience ? 'border-red-500' : 'border-white/10'
                  }`}
                  {...register('experience', {
                    required: 'Years of experience is required',
                    min: { value: 0, message: 'Experience must be at least 0' },
                    max: { value: 50, message: 'Experience cannot exceed 50 years' },
                  })}
                />
                {errors.experience && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Specialty <span className="text-red-400">*</span>
                </label>
                <select
                  className={`w-full px-4 py-3 bg-[#0f172a] border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none cursor-pointer ${
                    errors.specialty ? 'border-red-500' : 'border-white/10'
                  }`}
                  {...register('specialty', {
                    required: 'Please select a specialty',
                  })}
                >
                  <option value="" className="bg-[#0f172a] text-gray-500">
                    Select a specialty
                  </option>
                  {specialties.map((s) => (
                    <option key={s} value={s} className="bg-[#0f172a] text-white">
                      {s}
                    </option>
                  ))}
                </select>
                {errors.specialty && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.specialty.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Info <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us more about your certifications, achievements, training philosophy..."
                  className="w-full px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                  {...register('additionalInfo')}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
