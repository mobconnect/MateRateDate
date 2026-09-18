import React from "react";
import { UserCheck, Star, Heart, X } from "lucide-react";
import { sounds } from "../utils/audio";
import { ActionType } from "../types";

interface Props {
  action: ActionType;
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  subtext?: string;
}

export const GraffitiButton: React.FC<Props> = ({
  action,
  onClick,
  disabled = false,
  label,
  subtext,
}) => {
  const handleClick = () => {
    if (disabled) return;
    if (action === "mate") {
      sounds.playSpray();
      sounds.playStamp();
    } else if (action === "date") {
      sounds.playSpray();
      sounds.playMatchChime();
    } else if (action === "rate") {
      sounds.playRattle();
    } else if (action === "pass") {
      sounds.playPass();
    }
    onClick();
  };

  if (action === "pass") {
    return (
      <button
        id="btn-pass-action"
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-label="Pass to next photo"
        className="group relative flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900/90 border-2 border-neutral-700/80 hover:border-neutral-500 text-neutral-400 hover:text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800/80 group-hover:bg-neutral-700 transition">
          <X className="w-5 h-5 text-neutral-300 group-hover:text-white" strokeWidth={3} />
        </div>
        <span className="font-graffiti text-xs tracking-wider uppercase mt-1 text-neutral-400 group-hover:text-neutral-200">
          {label || "PASS"}
        </span>
      </button>
    );
  }

  if (action === "mate") {
    return (
      <button
        id="btn-mate-action"
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-label="Mate connection"
        className="group relative flex-1 min-w-[100px] sm:min-w-[130px] h-16 sm:h-20 px-3 sm:px-4 rounded-2xl bg-gradient-to-b from-cyan-500/20 via-cyan-950/40 to-cyan-900/50 border-2 border-cyan-400/80 hover:border-cyan-300 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_28px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40"
      >
        {/* Graffiti Drip visual styling */}
        <div className="absolute -top-1.5 left-4 w-2 h-3 bg-cyan-400 rounded-b-full opacity-80 pointer-events-none" />
        <div className="absolute -top-1 right-8 w-1.5 h-2 bg-cyan-400 rounded-b-full opacity-60 pointer-events-none" />

        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <UserCheck className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition" strokeWidth={2.5} />
          <span className="font-graffiti text-xl sm:text-2xl font-bold tracking-wider text-cyan-300 group-hover:text-white graffiti-shadow-cyan">
            {label || "MATE"}
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-wide uppercase text-cyan-400/90 block mt-0.5">
          {subtext || "Crew & Friends"}
        </span>
      </button>
    );
  }

  if (action === "rate") {
    return (
      <button
        id="btn-rate-action"
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-label="Rate photo"
        className="group relative flex-1 min-w-[100px] sm:min-w-[130px] h-16 sm:h-20 px-3 sm:px-4 rounded-2xl bg-gradient-to-b from-amber-500/20 via-yellow-950/40 to-amber-900/50 border-2 border-amber-400/80 hover:border-amber-300 text-amber-300 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_28px_rgba(234,179,8,0.5)] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40"
      >
        <div className="absolute -top-1.5 left-6 w-2 h-2.5 bg-amber-400 rounded-b-full opacity-80 pointer-events-none" />

        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Star className="w-5 h-5 text-amber-300 fill-amber-300/40 group-hover:fill-amber-300 group-hover:scale-110 transition" strokeWidth={2.5} />
          <span className="font-graffiti text-xl sm:text-2xl font-bold tracking-wider text-amber-300 group-hover:text-white graffiti-shadow-yellow">
            {label || "RATE"}
          </span>
        </div>
        <span className="text-[10px] font-medium tracking-wide uppercase text-amber-400/90 block mt-0.5">
          {subtext || "Tags & Stars"}
        </span>
      </button>
    );
  }

  // DATE Action
  return (
    <button
      id="btn-date-action"
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-label="Date connection"
      className="group relative flex-1 min-w-[100px] sm:min-w-[130px] h-16 sm:h-20 px-3 sm:px-4 rounded-2xl bg-gradient-to-b from-pink-500/25 via-pink-950/40 to-rose-950/50 border-2 border-pink-400/90 hover:border-pink-300 text-pink-300 shadow-[0_0_24px_rgba(236,72,153,0.35)] hover:shadow-[0_0_32px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40"
    >
      <div className="absolute -top-1.5 left-5 w-2 h-3.5 bg-pink-400 rounded-b-full opacity-85 pointer-events-none" />
      <div className="absolute -top-1 right-5 w-1.5 h-2 bg-pink-400 rounded-b-full opacity-60 pointer-events-none" />

      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
        <Heart className="w-5 h-5 text-pink-300 fill-pink-400/30 group-hover:fill-pink-300 group-hover:scale-110 transition" strokeWidth={2.5} />
        <span className="font-graffiti text-xl sm:text-2xl font-bold tracking-wider text-pink-300 group-hover:text-white graffiti-shadow-pink">
          {label || "DATE"}
        </span>
      </div>
      <span className="text-[10px] font-medium tracking-wide uppercase text-pink-300/90 block mt-0.5">
        {subtext || "Romantic Crush"}
      </span>
    </button>
  );
};
