import { Dumbbell } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f1a]">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin-slow" />
        <Dumbbell className="absolute inset-0 m-auto w-8 h-8 text-emerald-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        Fit<span className="text-emerald-400">Nexus</span>
      </h2>
      <p className="text-sm text-gray-400 animate-pulse">Loading your fitness world...</p>
    </div>
  );
}
