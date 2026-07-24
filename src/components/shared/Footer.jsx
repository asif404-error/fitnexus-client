"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";
import { useTheme } from "@/providers/ThemeProvider";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/all-classes", label: "All Classes" },
  { href: "/community-forum", label: "Community Forum" },
];

const socialLinks = [
  { href: "#", icon: FaXTwitter, label: "Twitter" },
  { href: "#", icon: FaFacebookF, label: "Facebook" },
  { href: "#", icon: FaInstagram, label: "Instagram" },
  { href: "#", icon: FaYoutube, label: "YouTube" },
];

export default function Footer() {
  const { theme } = useTheme();
  const bg = theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-100';
  const border = theme === 'dark' ? 'border-white/10' : 'border-gray-200';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const mutedText = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  const iconBg = theme === 'dark' ? 'bg-white/5' : 'bg-gray-200';
  const iconText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  return (
    <footer className={`${bg} border-t ${border} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-7 h-7 text-emerald-400" />
              <span className={`text-xl font-bold tracking-tight ${headingColor}`}>
                Fit<span className="text-emerald-400">Nexus</span>
              </span>
            </Link>
            <p className={`${textColor} text-sm leading-relaxed`}>
              Your all-in-one fitness and gym management platform. Track workouts,
              join classes, and connect with the community.
            </p>
          </div>

          <div>
            <h3 className={`${headingColor} font-semibold mb-4`}>Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${textColor} text-sm hover:text-emerald-400 transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`${headingColor} font-semibold mb-4`}>Contact Us</h3>
            <ul className={`space-y-2 text-sm ${textColor}`}>
              <li>
                <a href="mailto:support@fitnexus.com" className="hover:text-emerald-400 transition-colors">
                  support@fitnexus.com
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="hover:text-emerald-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center ${iconText} hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={`border-t ${border} mt-10 pt-6 text-center text-sm ${mutedText}`}>
          &copy; 2024 FitNexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
