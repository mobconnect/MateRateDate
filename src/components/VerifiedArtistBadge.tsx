import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface Props {
  size?: "xs" | "sm" | "md" | "lg";
  showLabel?: boolean;
  customLabel?: string;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export function VerifiedArtistBadge({
  size = "sm",
  showLabel = false,
  customLabel = "Verified Artist",
  className = "",
  onClick,
  title = "Verified Artist (Phone Linked via Firebase Auth)",
}: Props) {
  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    xs: "text-[9px] px-1.5 py-0.5",
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1",
  };

  if (!showLabel) {
    return (
      <span
        title={title}
        onClick={onClick}
        className={`inline-flex items-center justify-center text-cyan-400 align-middle ${
          onClick ? "cursor-pointer hover:scale-110 transition-transform" : ""
        } ${className}`}
        style={{ filter: "drop-shadow(0 0 5px rgba(0, 247, 255, 0.6))" }}
      >
        <span className="relative flex items-center justify-center">
          <CheckCircle2
            className={`${iconSizes[size]} fill-cyan-950 text-cyan-400 stroke-[2.4]`}
          />
        </span>
      </span>
    );
  }

  return (
    <span
      title={title}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wider uppercase border border-cyan-400/80 bg-gradient-to-r from-cyan-950/90 to-[#0f1b2b] text-cyan-300 shadow-[0_0_10px_rgba(0,247,255,0.25)] ${
        textSizes[size]
      } ${
        onClick ? "cursor-pointer hover:border-cyan-300 hover:shadow-[0_0_14px_rgba(0,247,255,0.45)] transition-all" : ""
      } ${className}`}
    >
      <CheckCircle2
        className={`${iconSizes[size]} fill-cyan-400 text-black stroke-[2.2] flex-shrink-0`}
      />
      <span className="font-mono text-cyan-200 tracking-tight font-extrabold whitespace-nowrap">
        {customLabel}
      </span>
    </span>
  );
}
