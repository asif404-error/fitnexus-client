import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="mb-8 text-8xl">🏋️</div>
      <h1 className="text-4xl font-bold text-white mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track with your fitness journey.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
