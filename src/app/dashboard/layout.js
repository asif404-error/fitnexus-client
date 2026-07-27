"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Dumbbell } from "lucide-react";
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlinePlusCircle,
  HiOutlineCollection,
  HiOutlineDocumentText,
  HiOutlineDocumentDuplicate,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineBadgeCheck,
  HiOutlineClipboardList,
  HiOutlineDocumentReport,
  HiOutlineCurrencyDollar,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUser,
} from "react-icons/hi";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

const navConfig = {
  user: [
    { href: "/dashboard", label: "Overview", icon: HiOutlineHome },
    {
      href: "/dashboard/booked-classes",
      label: "Booked Classes",
      icon: HiOutlineCalendar,
    },
    {
      href: "/dashboard/apply-trainer",
      label: "Apply as Trainer",
      icon: HiOutlineAcademicCap,
    },
    {
      href: "/dashboard/favorite-classes",
      label: "Favorite Classes",
      icon: HiOutlineHeart,
    },
  ],
  trainer: [
    { href: "/dashboard", label: "Overview", icon: HiOutlineHome },
    {
      href: "/dashboard/add-class",
      label: "Add Class",
      icon: HiOutlinePlusCircle,
    },
    {
      href: "/dashboard/my-classes",
      label: "My Classes",
      icon: HiOutlineCollection,
    },
    {
      href: "/dashboard/add-forum-post",
      label: "Add Forum Post",
      icon: HiOutlineDocumentText,
    },
    {
      href: "/dashboard/my-forum-posts",
      label: "My Forum Posts",
      icon: HiOutlineDocumentDuplicate,
    },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: HiOutlineHome },
    {
      href: "/dashboard/manage-users",
      label: "Manage Users",
      icon: HiOutlineUsers,
    },
    {
      href: "/dashboard/applied-trainers",
      label: "Applied Trainers",
      icon: HiOutlineUserAdd,
    },
    {
      href: "/dashboard/manage-trainers",
      label: "Manage Trainers",
      icon: HiOutlineBadgeCheck,
    },
    {
      href: "/dashboard/manage-classes",
      label: "Manage Classes",
      icon: HiOutlineClipboardList,
    },
    {
      href: "/dashboard/add-forum-post",
      label: "Add Forum Post",
      icon: HiOutlineDocumentText,
    },
    {
      href: "/dashboard/forum-post-manage",
      label: "Forum Post Manage",
      icon: HiOutlineDocumentReport,
    },
    {
      href: "/dashboard/transactions",
      label: "Transactions",
      icon: HiOutlineCurrencyDollar,
    },
  ],
};

const roleBadgeColors = {
  user: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  trainer: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  admin: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
};

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="w-10 h-10 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const role = (user.role || "user").toLowerCase();
  const links = navConfig[role] || navConfig.user;
  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Dumbbell className="w-7 h-7 text-emerald-400" />
          <span className="text-xl font-bold text-white tracking-tight">
            Fit<span className="text-emerald-400">Nexus</span>
          </span>
        </Link>
      </div>

      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400/50"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <HiOutlineUser className="w-6 h-6 text-emerald-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">
              {user.name}
            </p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                roleBadgeColors[role] || roleBadgeColors.user
              }`}
            >
              {role}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "dark:bg-emerald-500/20 bg-gray-300 dark:text-emerald-400"
                  : "dark:text-gray-400 text-white hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${active ? "dark:text-emerald-500 text-black" : "dark:text-gray-500 text-white"}`}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium dark:text-gray-400 text-white hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
        >
          <HiOutlineLogout className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen dark:bg-[#0a0f1a] flex">
      <div className="hidden lg:block fixed inset-y-0 left-0 w-[280px] dark:bg-[#0f172a] bg-sky-900 border-r border-white/5 z-40">
        <SidebarContent />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-[280px] bg-[#0f172a] border-r border-white/5 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>
        <SidebarContent />
      </div>

      <div className="flex-1 lg:ml-[280px] min-h-screen">
        <div className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 lg:px-8 h-16 bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/5 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <HiOutlineMenu className="w-6 h-6" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
            <span className="text-lg font-bold text-white">
              Fit<span className="text-emerald-400">Nexus</span>
            </span>
          </Link>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
