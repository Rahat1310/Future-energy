import { Zap } from "lucide-react";

export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer spinning ring */}
      <div className="absolute inset-0 animate-[spin_2s_linear_infinite] rounded-full border-2 border-transparent border-t-brand/30 border-r-brand/30" />
      {/* Inner pulsing power icon */}
      <Zap className="size-5 animate-pulse text-brand" />
    </div>
  );
}
