"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Users,
  Star,
  BookOpen,
  Flame,
  Trophy,
  Zap,
  Target,
} from "lucide-react";
import api from "@/lib/api";
import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";

const categories = [
  "Yoga",
  "Cardio",
  "Strength",
  "HIIT",
  "Pilates",
  "Dance",
  "Boxing",
  "CrossFit",
];

const categoryColors = {
  Yoga: "bg-purple-500/20 text-purple-400",
  Cardio: "bg-red-500/20 text-red-400",
  Strength: "bg-blue-500/20 text-blue-400",
  HIIT: "bg-orange-500/20 text-orange-400",
  Pilates: "bg-pink-500/20 text-pink-400",
  Dance: "bg-yellow-500/20 text-yellow-400",
  Boxing: "bg-rose-500/20 text-rose-400",
  CrossFit: "bg-cyan-500/20 text-cyan-400",
};

const stats = [
  { icon: Users, label: "Members", value: 500, suffix: "+" },
  { icon: BookOpen, label: "Classes", value: 50, suffix: "+" },
  { icon: Target, label: "Trainers", value: 100, suffix: "+" },
  { icon: Flame, label: "Bookings", value: 10000, suffix: "+" },
];

function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatted =
    count >= 1000
      ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
      : count;

  return (
    <span
      ref={ref}
      className="text-4xl md:text-5xl font-bold text-theme-primary"
    >
      {formatted}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const { theme } = useTheme();
  const [featuredClasses, setFeaturedClasses] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const featuredRef = useRef(null);
  const postsRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const featuredInView = useInView(featuredRef, {
    once: true,
    margin: "-100px",
  });
  const postsInView = useInView(postsRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  useEffect(() => {
    api
      .get("/classes/featured")
      .then((res) => setFeaturedClasses(res.data?.slice(0, 6) || []))
      .catch(() => {})
      .finally(() => setLoadingClasses(false));

    api
      .get("/forum-posts/latest")
      .then((res) => setLatestPosts(res.data?.slice(0, 4) || []))
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#1e293b]" : "bg-white";
  const cardFrom = isDark ? "from-[#1e293b]" : "from-white";
  const cardBorder = isDark ? "border-white/5" : "border-gray-200";
  const sectionAltBg = isDark ? "bg-[#0f172a]/50" : "bg-gray-50";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-400" : "text-gray-500";
  const skeletonShimmer = isDark ? "bg-white/5" : "bg-gray-200";
  const heroBottomFade = isDark ? "from-[#0a0f1a]" : "from-white";
  const gradientFrom = isDark ? "from-[#0a0f1a]" : "from-gray-50";
  const gradientVia = isDark ? "via-[#0f172a]" : "via-white";
  const btnOutlineBorder = isDark ? "border-white/20" : "border-gray-300";
  const btnOutlineText = isDark ? "text-white" : "text-gray-700";
  const btnOutlineHover = isDark ? "hover:bg-white/5" : "hover:bg-gray-100";
  const viewDetailsBg = isDark ? "bg-white/5" : "bg-gray-100";
  const viewDetailsText = isDark ? "text-white" : "text-gray-700";
  const viewDetailsHover = "hover:bg-emerald-500 hover:text-white";

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientVia} to-emerald-900/30 animate-hero-gradient`}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              Your Fitness Journey Starts Here
            </motion.div>

            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight ${headingColor}`}
            >
              Unleash Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-400">
                Inner Strength
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${textColor}`}
            >
              Join the ultimate fitness community. Book classes, connect with
              trainers, and transform your life.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/all-classes"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Explore Classes
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className={`inline-flex items-center gap-2 px-8 py-4 border ${btnOutlineBorder} ${btnOutlineText} font-semibold rounded-xl ${btnOutlineHover} transition-all duration-300`}
              >
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${heroBottomFade} to-transparent`}
        />
      </section>

      <section ref={featuredRef} className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${headingColor}`}
            >
              Featured Classes
            </h2>
            <p className={`${textColor} text-lg max-w-xl mx-auto`}>
              Discover our most popular classes curated for every fitness level
            </p>
          </motion.div>

          {loadingClasses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`${cardBg} rounded-2xl overflow-hidden animate-pulse`}
                >
                  <div className={`h-48 ${skeletonShimmer}`} />
                  <div className="p-5 space-y-3">
                    <div className={`h-4 ${skeletonShimmer} rounded w-1/3`} />
                    <div className={`h-6 ${skeletonShimmer} rounded w-2/3`} />
                    <div className={`h-4 ${skeletonShimmer} rounded w-1/2`} />
                    <div className={`h-10 ${skeletonShimmer} rounded`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={featuredInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredClasses.map((cls) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`group ${cardBg} rounded-2xl overflow-hidden border ${cardBorder} hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5`}
                >
                  <div className="relative h-48 overflow-hidden">
                    {cls.image ? (
                      <Image
                        src={cls.image}
                        alt={cls.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-600/30 to-emerald-900/30 flex items-center justify-center">
                        <Flame className="w-12 h-12 text-emerald-400/50" />
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${cardFrom} via-transparent to-transparent`}
                    />
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[cls.category] || "bg-emerald-500/20 text-emerald-400"}`}
                    >
                      {cls.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3
                      className={`text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors ${headingColor}`}
                    >
                      {cls.name}
                    </h3>
                    <p className={`text-sm mb-3 ${textColor}`}>
                      by{" "}
                      {cls.trainer?.name ||
                        cls.trainerName ||
                        "Unknown Trainer"}
                    </p>
                    <div
                      className={`flex items-center gap-4 text-sm mb-4 ${textColor}`}
                    >
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {cls.duration || "60"} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {cls.bookingCount || 0}
                      </span>
                      {cls.price != null && (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          ${cls.price}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/class-details/${cls._id}`}
                      className={`block w-full text-center py-2.5 rounded-xl ${viewDetailsBg} ${viewDetailsText} text-sm font-medium ${viewDetailsHover} transition-all duration-300`}
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loadingClasses && featuredClasses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={featuredInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-center mt-10"
            >
              <Link
                href="/all-classes"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                View All Classes <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <section ref={postsRef} className={`py-20 md:py-28 ${sectionAltBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={postsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${headingColor}`}
            >
              Community Highlights
            </h2>
            <p className={`${textColor} text-lg max-w-xl mx-auto`}>
              Stay connected with our vibrant fitness community
            </p>
          </motion.div>

          {loadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`${cardBg} rounded-2xl overflow-hidden animate-pulse`}
                >
                  <div className={`h-40 ${skeletonShimmer}`} />
                  <div className="p-5 space-y-3">
                    <div className={`h-5 ${skeletonShimmer} rounded w-3/4`} />
                    <div className={`h-4 ${skeletonShimmer} rounded w-full`} />
                    <div className={`h-4 ${skeletonShimmer} rounded w-2/3`} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={postsInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {latestPosts.map((post) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`group ${cardBg} rounded-2xl overflow-hidden border ${cardBorder} hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5`}
                >
                  <div className="relative h-40 overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 flex items-center justify-center">
                        <Star className="w-10 h-10 text-emerald-400/50" />
                      </div>
                    )}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${cardFrom} via-transparent to-transparent`}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {post.author?.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {(post.authorName || "U")[0]}
                          </span>
                        </div>
                      )}
                      <span className={`text-xs ${textColor}`}>
                        {post.authorName || "Anonymous"}
                      </span>
                    </div>
                    <h3
                      className={`text-base font-bold mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors ${headingColor}`}
                    >
                      {post.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${textColor}`}>
                      {post.description?.slice(0, 150) || ""}
                    </p>
                    <Link
                      href={`/forum-post/${post._id}`}
                      className="inline-flex items-center gap-1 text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
                    >
                      Read More <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loadingPosts && latestPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={postsInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="text-center mt-10"
            >
              <Link
                href="/community-forum"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Visit Community Forum <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <section ref={statsRef} className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className={`text-center p-6 md:p-8 rounded-2xl ${cardBg} border ${cardBorder}`}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 mb-4">
                  <stat.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className={`${textColor} mt-2 text-sm md:text-base`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={ctaRef} className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-10 md:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <Trophy className="w-12 h-12 text-emerald-200 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Fitness Journey?
              </h2>
              <p className="text-emerald-100/80 text-lg max-w-xl mx-auto mb-8">
                Join FitNexus today and get access to world-class trainers and
                facilities.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
