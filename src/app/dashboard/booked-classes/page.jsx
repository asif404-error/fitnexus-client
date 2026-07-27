'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

function TableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-[#1e293b] rounded-xl animate-pulse flex items-center px-6 gap-4">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-4 bg-white/5 rounded w-1/6" />
          <div className="h-4 bg-white/5 rounded w-1/5" />
          <div className="h-4 bg-white/5 rounded w-1/12" />
          <div className="h-4 bg-white/5 rounded w-1/5" />
          <div className="h-4 bg-white/5 rounded w-1/6" />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[#1e293b] rounded-xl p-5 animate-pulse space-y-3">
          <div className="h-5 bg-white/5 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-1/2" />
          <div className="h-4 bg-white/5 rounded w-2/3" />
          <div className="h-4 bg-white/5 rounded w-1/3" />
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-10 bg-white/5 rounded w-full mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function BookedClassesPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    api.get('/bookings/my-bookings')
      .then((res) => {
        setBookings(res.data.bookings || res.data.data || res.data || []);
      })
      .catch(() => {
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-3">My Booked Classes</h1>
          <p className="text-gray-400 text-lg">Manage and view your upcoming class bookings</p>
        </motion.div>

        {loading ? (
          <>
            <div className="hidden md:block">
              <TableSkeleton />
            </div>
            <div className="md:hidden">
              <CardSkeleton />
            </div>
          </>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <CalendarCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No booked classes yet</h3>
            <p className="text-gray-400 mb-6">Explore our classes and book your first session!</p>
            <Link
              href="/all-classes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300"
            >
              Browse Classes
            </Link>
          </motion.div>
        ) : (
          <>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:block"
            >
              <div className="dark:bg-[#1e293b] bg-sky-900 rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-sm font-semibold dark:text-gray-400 text-gray-200 px-6 py-4">Class Name</th>
                        <th className="text-left text-sm font-semibold dark:text-gray-400 text-gray-200 px-6 py-4">Trainer</th>
                        <th className="text-left text-sm font-semibold dark:text-gray-400 text-gray-200  px-6 py-4">Schedule</th>
                        <th className="text-left text-sm font-semibold dark:text-gray-400 text-gray-200 px-6 py-4">Price</th>
                        <th className="text-left text-sm font-semibold dark:text-gray-400 text-gray-200  px-6 py-4">Booked Date</th>
                        <th className="text-left text-sm font-semibold dark:text-gray-400 text-gray-200  px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((booking, idx) => {
                        const cls = booking.class || booking.classId || booking;
                        const className = cls?.name || booking.className || 'Unknown Class';
                        const trainerName = cls?.trainer?.name || cls?.trainerName || booking.trainerName || 'TBA';
                        const scheduleDays = cls?.schedule?.days?.join(', ') || cls?.days?.join(', ') || 'TBA';
                        const scheduleTime = cls?.schedule?.time || cls?.time || '';
                        const schedule = scheduleTime ? `${scheduleDays} - ${scheduleTime}` : scheduleDays;
                        const price = Number(cls?.price ?? booking.price) || 0;
                        const bookedDate = booking.createdAt || booking.bookedAt;
                        const classId = cls?._id || booking.classId?._id || booking.classId;

                        return (
                          <motion.tr
                            key={booking._id || idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.03 }}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="text-white font-medium">{className}</span>
                            </td>
                            <td className="px-6 py-4 dark:text-gray-300 text-white text-sm">{trainerName}</td>
                            <td className="px-6 py-4 dark:text-gray-300 text-white  text-sm">{schedule}</td>
                            <td className="px-6 py-4 text-emerald-400 font-semibold text-sm">
                              ${price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 dark:text-gray-300 text-white  text-sm">
                              {bookedDate ? format(new Date(bookedDate), 'MMM d, yyyy') : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              {classId ? (
                                <Link
                                  href={`/class-details/${classId}`}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 hover:text-white transition-all duration-300"
                                >
                                  View Details
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              ) : (
                                <span className="text-gray-500 text-sm">N/A</span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            <div className="md:hidden space-y-4">
              {bookings.map((booking, idx) => {
                const cls = booking.class || booking.classId || booking;
                const className = cls?.name || booking.className || 'Unknown Class';
                const trainerName = cls?.trainer?.name || cls?.trainerName || booking.trainerName || 'TBA';
                const scheduleDays = cls?.schedule?.days?.join(', ') || cls?.days?.join(', ') || 'TBA';
                const scheduleTime = cls?.schedule?.time || cls?.time || '';
                const schedule = scheduleTime ? `${scheduleDays} - ${scheduleTime}` : scheduleDays;
                const price = Number(cls?.price ?? booking.price) || 0;
                const bookedDate = booking.createdAt || booking.bookedAt;
                const classId = cls?._id || booking.classId?._id || booking.classId;

                return (
                  <motion.div
                    key={booking._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="bg-[#1e293b] rounded-xl p-5 border border-white/5"
                  >
                    <h3 className="text-white font-semibold mb-3">{className}</h3>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trainer</span>
                        <span className="text-gray-200">{trainerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Schedule</span>
                        <span className="text-gray-200 text-right">{schedule}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span className="text-emerald-400 font-semibold">${price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Booked</span>
                        <span className="text-gray-200">
                          {bookedDate ? format(new Date(bookedDate), 'MMM d, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </div>
                    {classId ? (
                      <Link
                        href={`/class-details/${classId}`}
                        className="block w-full text-center py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-emerald-500 hover:text-white transition-all duration-300"
                      >
                        View Details
                      </Link>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
