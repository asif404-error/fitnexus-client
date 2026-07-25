"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Heart,
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import api from "@/lib/api";
import Image from "next/image";

const roleBadgeColors = {
  user: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  trainer: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  admin: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
};

function StatCard({ icon: Icon, label, value, color, delay }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10",
      icon: "bg-emerald-500/20 text-emerald-400",
      border: "border-emerald-500/20",
      hover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    },
    blue: {
      bg: "bg-blue-500/10",
      icon: "bg-blue-500/20 text-blue-400",
      border: "border-blue-500/20",
      hover: "hover:border-blue-500/40 hover:shadow-blue-500/10",
    },
    purple: {
      bg: "bg-purple-500/10",
      icon: "bg-purple-500/20 text-purple-400",
      border: "border-purple-500/20",
      hover: "hover:border-purple-500/40 hover:shadow-purple-500/10",
    },
    amber: {
      bg: "bg-amber-500/10",
      icon: "bg-amber-500/20 text-amber-400",
      border: "border-amber-500/20",
      hover: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    },
  };

  const c = colorMap[color] || colorMap.emerald;
  const cardBg = isDark ? "bg-[#1e293b]" : "bg-white";
  const labelColor = isDark ? "text-gray-400" : "text-gray-500";
  const valueColor = isDark ? "text-white" : "text-gray-900";
  const shimmer = isDark ? "bg-white/5" : "bg-gray-200";

  return (
    <div
      className={`${cardBg} rounded-2xl border ${c.border} p-6 transition-all duration-300 hover:shadow-xl ${c.hover} hover:-translate-y-0.5`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`${labelColor} text-sm font-medium`}>{label}</p>
          <p className={`text-3xl font-bold ${valueColor} mt-2`}>
            {value !== null ? (
              value
            ) : (
              <span
                className={`inline-block w-8 h-8 ${shimmer} rounded-lg animate-pulse`}
              />
            )}
          </p>
        </div>
        <div
          className={`w-14 h-14 rounded-2xl ${c.icon} flex items-center justify-center`}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ user, extra }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const role = (user.role || "user").toLowerCase();
  const cardBg = isDark ? "bg-[#1e293b]" : "bg-white";
  const cardBorder = isDark ? "border-white/5" : "border-gray-200";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const dividerBorder = isDark ? "border-white/5" : "border-gray-200";

  return (
    <div className={`${cardBg} rounded-2xl border ${cardBorder} p-6`}>
      <div className="flex items-center gap-4 mb-6">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-400/50"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-emerald-400">
              {user.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h2 className={`text-xl font-bold ${headingColor}`}>{user.name}</h2>
          <p className={`${textColor} text-sm`}>{user.email}</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              roleBadgeColors[role] || roleBadgeColors.user
            }`}
          >
            {role}
          </span>
        </div>
      </div>

      {extra && <div className={`border-t ${dividerBorder} pt-5`}>{extra}</div>}
    </div>
  );
}

function TrainerApplicationStatus({ application }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const subtleBg = isDark ? "bg-white/5" : "bg-gray-100";
  const subtleBorder = isDark ? "border-white/5" : "border-gray-200";
  const feedbackBg = isDark ? "bg-red-500/5" : "bg-red-50";
  const feedbackBorder = isDark ? "border-red-500/10" : "border-red-200";
  const feedbackTextColor = isDark ? "text-gray-300" : "text-gray-600";
  const feedbackLabelColor = isDark ? "text-gray-400" : "text-gray-500";

  if (!application || application.status === "none") {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${subtleBg} border ${subtleBorder}`}
      >
        <div className="w-2 h-2 rounded-full bg-gray-500" />
        <p className={`${textColor} text-sm`}>
          No trainer application submitted
        </p>
      </div>
    );
  }

  if (application.status === "pending") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <p className="text-amber-400 text-sm font-medium">
          Trainer application is pending review
        </p>
      </div>
    );
  }

  if (application.status === "rejected") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm font-medium">
            Trainer application was rejected
          </p>
        </div>
        {application.feedback && (
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl ${feedbackBg} border ${feedbackBorder}`}
          >
            <AlertCircle className="w-4 h-4 text-red-400/70 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`${feedbackLabelColor} text-xs font-medium mb-1`}>
                Admin Feedback
              </p>
              <p className={`${feedbackTextColor} text-sm`}>
                {application.feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function UserOverview({ user }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const [stats, setStats] = useState({ bookings: null, favorites: null });
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, favsRes] = await Promise.all([
          api.get("/bookings/my-bookings").catch(() => ({ data: [] })),
          api.get("/favorites/my-favorites").catch(() => ({ data: [] })),
        ]);
        const bookings = Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : bookingsRes.data.bookings || [];
        const favs = Array.isArray(favsRes.data)
          ? favsRes.data
          : favsRes.data.favorites || [];
        setStats({ bookings: bookings.length, favorites: favs.length });
      } catch {
        setStats({ bookings: 0, favorites: 0 });
      }
    };

    const fetchApplication = async () => {
      try {
        const res = await api.get("/users/trainer-applications/my-application");
        setApplication(res.data.application || res.data);
      } catch {
        setApplication({ status: "none" });
      }
    };

    fetchStats();
    fetchApplication();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-2xl font-bold mb-1 ${headingColor}`}>
          Welcome back, {user.name?.split(" ")[0]}!
        </h1>
        <p className={textColor}>
          Here&apos;s an overview of your fitness journey.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        <StatCard
          icon={Calendar}
          label="Booked Classes"
          value={stats.bookings}
          color="emerald"
          delay={0}
        />
        <StatCard
          icon={Heart}
          label="Favorite Classes"
          value={stats.favorites}
          color="blue"
          delay={100}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCard user={user}>
            <div>
              <p
                className={`text-xs font-semibold ${isDark ? "text-gray-500" : "text-gray-400"} uppercase tracking-wider mb-3`}
              >
                Trainer Application
              </p>
              <TrainerApplicationStatus application={application} />
            </div>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
}

function TrainerOverview({ user }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const [stats, setStats] = useState({ classes: null, students: null });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/classes/my-classes");
        const classes = Array.isArray(res.data)
          ? res.data
          : res.data.classes || [];
        const totalStudents = classes.reduce(
          (sum, cls) => sum + (cls.bookingCount || cls.bookingsCount || 0),
          0,
        );
        setStats({ classes: classes.length, students: totalStudents });
      } catch {
        setStats({ classes: 0, students: 0 });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-2xl font-bold mb-1 ${headingColor}`}>
          Trainer Dashboard
        </h1>
        <p className={textColor}>
          Manage your classes and track your students.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        <StatCard
          icon={BookOpen}
          label="Classes Created"
          value={stats.classes}
          color="emerald"
          delay={0}
        />
        <StatCard
          icon={Users}
          label="Students Enrolled"
          value={stats.students}
          color="blue"
          delay={100}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
}

function AdminOverview({ user }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const [stats, setStats] = useState({
    users: null,
    classes: null,
    bookings: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, classesRes, bookingsRes] = await Promise.all([
          api.get("/users/stats").catch(() => ({ data: {} })),
          api.get("/classes/stats").catch(() => ({ data: {} })),
          api.get("/bookings/stats").catch(() => ({ data: {} })),
        ]);
        setStats({
          users:
            usersRes.data.totalUsers ??
            usersRes.data.total ??
            usersRes.data.count ??
            0,
          classes:
            classesRes.data.totalClasses ??
            classesRes.data.total ??
            classesRes.data.count ??
            0,
          bookings:
            bookingsRes.data.totalBookings ??
            bookingsRes.data.total ??
            bookingsRes.data.count ??
            0,
        });
      } catch {
        setStats({ users: 0, classes: 0, bookings: 0 });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-2xl font-bold mb-1 ${headingColor}`}>
          Admin Dashboard
        </h1>
        <p className={textColor}>Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users}
          color="emerald"
          delay={0}
        />
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          value={stats.classes}
          color="blue"
          delay={100}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Bookings"
          value={stats.bookings}
          color="purple"
          delay={200}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const role = (user.role || "user").toLowerCase();

  if (role === "admin") return <AdminOverview user={user} />;
  if (role === "trainer") return <TrainerOverview user={user} />;
  return <UserOverview user={user} />;
}
