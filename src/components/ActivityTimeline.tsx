import React, { useState, useRef } from "react";
import {
  Heart,
  UserCheck,
  Star,
  Archive,
  Trash2,
  Undo2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Instagram,
  Music,
  MessageCircle,
  Share2,
  Sparkles,
  CheckCircle2,
  Flame,
  AlertCircle,
} from "lucide-react";
import { VoteEvent } from "../types";
import { playUISwipe, playStamp } from "../utils/audio";

interface Props {
  votes: VoteEvent[];
  onArchiveVote: (id: string) => void;
  onUnarchiveVote: (id: string) => void;
  onDeleteVote: (id: string) => void;
  onClearArchived?: () => void;
}

interface SwipeState {
  id: string | null;
  startX: number;
  currentX: number;
  swiping: boolean;
}

export function ActivityTimeline({
  votes,
  onArchiveVote,
  onUnarchiveVote,
  onDeleteVote,
  onClearArchived,
}: Props) {
  const [filter, setFilter] = useState<"all" | "mates" | "dates" | "ratings">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [swipeState, setSwipeState] = useState<SwipeState>({
    id: null,
    startX: 0,
    currentX: 0,
    swiping: false,
  });

  const [lastActionToast, setLastActionToast] = useState<{
    message: string;
    action: "archived" | "deleted" | "restored";
    item: VoteEvent;
  } | null>(null);

  const activeVotes = votes.filter((v) => (showArchived ? v.isArchived : !v.isArchived));

  const filteredVotes = activeVotes.filter((v) => {
    if (filter === "mates") return v.action === "mate";
    if (filter === "dates") return v.action === "date";
    if (filter === "ratings") return v.action === "rate";
    return v.action !== "pass";
  });

  const archivedCount = votes.filter((v) => v.isArchived).length;
  const activeCount = votes.filter((v) => !v.isArchived).length;

  const getPlatformIcon = (plat?: string) => {
    switch (plat) {
      case "instagram":
        return <Instagram className="w-3.5 h-3.5" />;
      case "tiktok":
        return <Music className="w-3.5 h-3.5" />;
      case "snapchat":
      case "whatsapp":
        return <MessageCircle className="w-3.5 h-3.5" />;
      default:
        return <Share2 className="w-3.5 h-3.5" />;
    }
  };

  const formatTimestamp = (raw: string) => {
    try {
      const date = new Date(raw);
      if (isNaN(date.getTime())) return "Recently";
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  // Touch / Pointer Swipe Handlers
  const handleTouchStart = (id: string, clientX: number) => {
    setSwipeState({
      id,
      startX: clientX,
      currentX: clientX,
      swiping: true,
    });
  };

  const handleTouchMove = (id: string, clientX: number) => {
    if (!swipeState.swiping || swipeState.id !== id) return;
    setSwipeState((prev) => ({
      ...prev,
      currentX: clientX,
    }));
  };

  const handleTouchEnd = (vote: VoteEvent) => {
    if (!swipeState.swiping || swipeState.id !== vote.id) {
      setSwipeState({ id: null, startX: 0, currentX: 0, swiping: false });
      return;
    }

    const deltaX = swipeState.currentX - swipeState.startX;
    const threshold = 75; // px to trigger swipe action

    if (deltaX < -threshold) {
      // SWIPED LEFT -> ARCHIVE
      playUISwipe();
      if (vote.isArchived) {
        onUnarchiveVote(vote.id);
        setLastActionToast({
          message: `Unarchived ${vote.cardName}'s interaction`,
          action: "restored",
          item: vote,
        });
      } else {
        onArchiveVote(vote.id);
        setLastActionToast({
          message: `Archived ${vote.cardName}'s interaction`,
          action: "archived",
          item: vote,
        });
      }
    } else if (deltaX > threshold) {
      // SWIPED RIGHT -> DELETE
      playStamp();
      onDeleteVote(vote.id);
      setLastActionToast({
        message: `Deleted ${vote.cardName}'s interaction`,
        action: "deleted",
        item: vote,
      });
    }

    setSwipeState({ id: null, startX: 0, currentX: 0, swiping: false });

    // Auto-dismiss toast
    setTimeout(() => {
      setLastActionToast((curr) => (curr?.item.id === vote.id ? null : curr));
    }, 4500);
  };

  return (
    <div className="space-y-4">
      {/* Activity Bar Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d0f17] p-3.5 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-graffiti text-lg text-white tracking-wide flex items-center gap-2">
              <span>Chronological Activity</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                {showArchived ? `${archivedCount} archived` : `${activeCount} total`}
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Interactive timeline of your ratings, dates, and mate linkups.
            </p>
          </div>
        </div>

        {/* View Toggle: Active vs Archived */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                !showArchived
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Active</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-neutral-300">
                {activeCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                showArchived
                  ? "bg-neutral-800 text-cyan-300 shadow-sm"
                  : "text-neutral-400 hover:text-cyan-300"
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive</span>
              {archivedCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  {archivedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Instruction Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5 text-red-400/90">
          <Trash2 className="w-3.5 h-3.5" />
          <span className="font-semibold">Swipe Right:</span>
          <span>Delete</span>
        </div>
        <div className="text-neutral-600 hidden xs:inline">•</div>
        <div className="flex items-center gap-1.5 text-cyan-400/90">
          <span>{showArchived ? "Unarchive" : "Archive"}</span>
          <span className="font-semibold">:Swipe Left</span>
          <Archive className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            filter === "all"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-white"
          }`}
        >
          All Activity
        </button>
        <button
          type="button"
          onClick={() => setFilter("mates")}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
            filter === "mates"
              ? "bg-cyan-950 text-cyan-300 border border-cyan-500/60"
              : "bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-cyan-300"
          }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>Mates</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter("dates")}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
            filter === "dates"
              ? "bg-pink-950 text-pink-300 border border-pink-500/60"
              : "bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-pink-300"
          }`}
        >
          <Heart className="w-3 h-3" />
          <span>Dates</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter("ratings")}
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
            filter === "ratings"
              ? "bg-amber-950 text-amber-300 border border-amber-500/60"
              : "bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-amber-300"
          }`}
        >
          <Star className="w-3 h-3" />
          <span>Ratings</span>
        </button>
      </div>

      {/* Undo / Feedback Toast Notification */}
      {lastActionToast && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-cyan-500/40 text-xs shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-white font-medium">{lastActionToast.message}</span>
          </div>
          <div className="flex items-center gap-2">
            {lastActionToast.action === "archived" && (
              <button
                type="button"
                onClick={() => {
                  onUnarchiveVote(lastActionToast.item.id);
                  setLastActionToast(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer text-xs flex items-center gap-1"
              >
                <Undo2 className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setLastActionToast(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Timeline List */}
      {filteredVotes.length === 0 ? (
        <div className="p-10 text-center bg-neutral-900/40 border border-neutral-800/80 rounded-2xl">
          <Clock className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
          <h4 className="font-graffiti text-lg text-white mb-1">
            {showArchived ? "No Archived Activity" : "No Activity Recorded Yet"}
          </h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {showArchived
              ? "Swipe left on any activity card to archive it and clean up your active timeline."
              : "Head to the card deck to Mate, Rate, or Date profiles. Every action will log into this chronological history!"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredVotes.map((vote) => {
            const isSwipingThis = swipeState.id === vote.id && swipeState.swiping;
            const deltaX = isSwipingThis ? swipeState.currentX - swipeState.startX : 0;
            const targetSocial =
              vote.targetSocials?.find((s) => s.isPrimary) || vote.targetSocials?.[0];

            return (
              <div
                key={vote.id}
                className="relative overflow-hidden rounded-2xl border border-neutral-800 select-none bg-neutral-950"
              >
                {/* Background Action Indicators (Revealed on swipe) */}
                <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold font-mono">
                  {/* Right Reveal: DELETE (red) */}
                  <div
                    className={`flex items-center gap-2 text-red-400 transition-opacity duration-150 ${
                      deltaX > 25 ? "opacity-100 scale-105" : "opacity-40"
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="uppercase tracking-wider">Delete</span>
                  </div>

                  {/* Left Reveal: ARCHIVE / UNARCHIVE (cyan) */}
                  <div
                    className={`flex items-center gap-2 text-cyan-400 transition-opacity duration-150 ${
                      deltaX < -25 ? "opacity-100 scale-105" : "opacity-40"
                    }`}
                  >
                    <span className="uppercase tracking-wider">
                      {vote.isArchived ? "Unarchive" : "Archive"}
                    </span>
                    <Archive className="w-5 h-5" />
                  </div>
                </div>

                {/* Foreground Interactive Card (translates horizontally) */}
                <div
                  onTouchStart={(e) => handleTouchStart(vote.id, e.touches[0].clientX)}
                  onTouchMove={(e) => handleTouchMove(vote.id, e.touches[0].clientX)}
                  onTouchEnd={() => handleTouchEnd(vote)}
                  onMouseDown={(e) => handleTouchStart(vote.id, e.clientX)}
                  onMouseMove={(e) => handleTouchMove(vote.id, e.clientX)}
                  onMouseUp={() => handleTouchEnd(vote)}
                  onMouseLeave={() => {
                    if (swipeState.id === vote.id) {
                      setSwipeState({ id: null, startX: 0, currentX: 0, swiping: false });
                    }
                  }}
                  style={{
                    transform: `translateX(${deltaX}px)`,
                    transition: isSwipingThis ? "none" : "transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)",
                  }}
                  className={`relative z-10 flex items-center gap-3.5 p-3.5 bg-neutral-900 hover:bg-[#151722] cursor-grab active:cursor-grabbing transition-colors`}
                >
                  {/* Image with action badge overlay */}
                  <div className="relative shrink-0">
                    <img
                      src={vote.cardImage}
                      alt={vote.cardName}
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-neutral-950 border border-neutral-700 shadow-sm">
                      {vote.action === "date" && <Heart className="w-3 h-3 text-pink-400 fill-pink-400/30" />}
                      {vote.action === "mate" && <UserCheck className="w-3 h-3 text-cyan-400" />}
                      {vote.action === "rate" && <Star className="w-3 h-3 text-amber-400 fill-amber-400/30" />}
                    </div>
                  </div>

                  {/* Main Content Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-2 truncate">
                        <h4 className="font-bold text-white text-sm truncate">{vote.cardName}</h4>
                        {vote.action === "date" && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-graffiti shrink-0">
                            DATE
                          </span>
                        )}
                        {vote.action === "mate" && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-graffiti shrink-0">
                            MATE
                          </span>
                        )}
                        {vote.action === "rate" && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-graffiti shrink-0">
                            {vote.ratingScore}/10
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                        {formatTimestamp(vote.timestamp)}
                      </span>
                    </div>

                    {/* Compliment / Feedback */}
                    {vote.ratingCompliment ? (
                      <p className="text-xs text-amber-300/90 truncate mb-1">
                        &ldquo;{vote.ratingCompliment}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-400 truncate mb-1">
                        {vote.action === "mate"
                          ? "Added to your Sydney street crew mates."
                          : vote.action === "date"
                          ? "Sent Date crush connection."
                          : `Rated graffiti drip aesthetic.`}
                      </p>
                    )}

                    {/* Social handle link & quick action triggers */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
                      {targetSocial && (
                        <a
                          href={targetSocial.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white group"
                        >
                          <span className="p-0.5 rounded bg-neutral-800 text-pink-400 group-hover:bg-neutral-700 transition">
                            {getPlatformIcon(targetSocial.platform)}
                          </span>
                          <span className="truncate max-w-[120px] font-mono">
                            @{targetSocial.handle}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 text-neutral-500 group-hover:text-neutral-300" />
                        </a>
                      )}

                      {/* Desktop Fallback Action Buttons */}
                      <div className="flex items-center gap-1.5 ml-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            if (vote.isArchived) {
                              onUnarchiveVote(vote.id);
                            } else {
                              onArchiveVote(vote.id);
                            }
                            playUISwipe();
                          }}
                          className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[10px] font-medium text-cyan-300 border border-neutral-700 transition flex items-center gap-1 cursor-pointer"
                          title={vote.isArchived ? "Unarchive" : "Archive (or swipe left)"}
                        >
                          <Archive className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {vote.isArchived ? "Restore" : "Archive"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteVote(vote.id);
                            playStamp();
                          }}
                          className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-red-950/80 text-[10px] font-medium text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-700/60 transition flex items-center gap-1 cursor-pointer"
                          title="Delete (or swipe right)"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
