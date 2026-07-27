"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dumbbell, Menu, X, LogOut, User, Sun, Moon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/all-classes", label: "All Classes" },
  { href: "/community-forum", label: "Community Forum" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => pathname === href;

  const navBg = theme === "dark" ? "bg-[#0f172a]/95" : "bg-white/95";
  const navBorder = theme === "dark" ? "border-white/10" : "border-gray-200";
  const mobileBg = theme === "dark" ? "bg-[#0f172a]" : "bg-white";
  const mobileBorder = theme === "dark" ? "border-white/10" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const hoverBg = theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100";
  const activeBg = "bg-emerald-500/20 text-emerald-400";
  const inactiveText =
    theme === "dark"
      ? "text-gray-300 hover:text-white"
      : "text-gray-600 hover:text-gray-900";
  const iconBtnBg =
    theme === "dark"
      ? "text-gray-300 hover:text-white hover:bg-white/10"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

  return (
    <nav
      className={`sticky top-0 z-50 ${navBg} backdrop-blur-md border-b ${navBorder} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Dumbbell className="w-7 h-7 text-emerald-500 transition-transform group-hover:rotate-12" />
            <span className={`text-xl font-bold tracking-tight ${textColor}`}>
              Fit<span className="text-emerald-500">Nexus</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href) ? `${activeBg} text-green-600` : `${inactiveText} ${hoverBg}`
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? activeBg
                    : `${inactiveText} ${hoverBg}`
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${iconBtnBg}`}
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      {user.image ? (
                        <Image
                          src={user?.image || "/default-avatar.png"}
                          alt={user?.name || "User"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400/50"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      <span
                        className={`text-sm max-w-[120px] truncate ${textSecondary}`}
                      >
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${inactiveText} ${hoverBg}`}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${inactiveText} ${hoverBg}`}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${iconBtnBg}`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${iconBtnBg}`}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className={`md:hidden border-t ${mobileBorder} ${mobileBg} transition-colors duration-300`}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href) ? activeBg : `${inactiveText} ${hoverBg}`
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? activeBg
                    : `${inactiveText} ${hoverBg}`
                }`}
              >
                Dashboard
              </Link>
            )}
            <div className={`border-t ${mobileBorder} my-2`} />
            {!loading && (
              <>
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2">
                      {user.image ? (
                        <Image
                          src={user?.image || "/default-avatar.png"}
                          alt={user?.name || "User"}
                          width={32}
                          height={32}
                          className="rounded-full object-cover ring-2 ring-emerald-400/50"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      <span className={`text-sm ${textSecondary}`}>
                        {user.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${inactiveText} ${hoverBg}`}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${inactiveText} ${hoverBg}`}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
