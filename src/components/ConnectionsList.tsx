import React, { useState } from "react";
import {
  Heart,
  UserCheck,
  Star,
  ExternalLink,
  Instagram,
  Music,
  MessageCircle,
  Share2,
  Trash2,
  Sparkles,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { VoteEvent, PhotoCard } from "../types";
import { VerifiedArtistBadge } from "./VerifiedArtistBadge";
import { ActivityTimeline } from "./ActivityTimeline";

interface Props {
  votes: VoteEvent[];
  myCards: PhotoCard[];
  onDeleteMyCard?: (cardId: string) => void;
  onOpenUpload?: () => void;
  isUserVerified?: boolean;
  onOpenVerificationModal?: () => void;
  onArchiveVote?: (voteId: string) => void;
  onUnarchiveVote?: (voteId: string) => void;
  onDeleteVote?: (voteId: string) => void;
}

export const ConnectionsList: React.FC<Props> = ({
  votes,
  myCards,
  onDeleteMyCard,
  onOpenUpload,
  isUserVerified = false,
  onOpenVerificationModal,
  onArchiveVote,
  onUnarchiveVote,
  onDeleteVote,
}) => {
  const [filter, setFilter] = useState<"activity" | "all" | "mates" | "dates" | "ratings" | "my-deck">("activity");

  const filteredVotes = votes.filter((v) => {
    if (v.isArchived) return false;
    if (filter === "mates") return v.action === "mate";
    if (filter === "dates") return v.action === "date";
    if (filter === "ratings") return v.action === "rate";
    return v.action !== "pass";
  });

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case "instagram": return <Instagram className="w-3.5 h-3.5" />;
      case "tiktok": return <Music className="w-3.5 h-3.5" />;
      case "snapchat": return <MessageCircle className="w-3.5 h-3.5" />;
      case "whatsapp": return <MessageCircle className="w-3.5 h-3.5" />;
      default: return <Share2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-graffiti text-3xl text-white tracking-wide flex items-center gap-2.5">
            Connections & Wall Activity
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Your connected mates, crush dates, and graffiti ratings.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center flex-wrap gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setFilter("activity")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filter === "activity"
                ? "bg-gradient-to-r from-cyan-500/30 to-pink-500/30 text-white border border-cyan-400/50 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Activity</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
              {votes.filter((v) => !v.isArchived).length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filter === "all"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            All Connections
          </button>
          <button
            type="button"
            onClick={() => setFilter("mates")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filter === "mates"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-neutral-400 hover:text-cyan-300"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Mates
          </button>
          <button
            type="button"
            onClick={() => setFilter("dates")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filter === "dates"
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                : "text-neutral-400 hover:text-pink-300"
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> Dates
          </button>
          <button
            type="button"
            onClick={() => setFilter("ratings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filter === "ratings"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-neutral-400 hover:text-amber-300"
            }`}
          >
            <Star className="w-3.5 h-3.5" /> Ratings
          </button>
          <button
            type="button"
            onClick={() => setFilter("my-deck")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              filter === "my-deck"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-neutral-400 hover:text-purple-300"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> My Photos ({myCards.length})
          </button>
        </div>
      </div>

      {/* ACTIVITY TIMELINE VIEW (Chronological history with swipe actions) */}
      {filter === "activity" ? (
        <ActivityTimeline
          votes={votes}
          onArchiveVote={(id) => onArchiveVote?.(id)}
          onUnarchiveVote={(id) => onUnarchiveVote?.(id)}
          onDeleteVote={(id) => onDeleteVote?.(id)}
        />
      ) : filter === "my-deck" ? (
        <div>
          {myCards.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900/60 border-2 border-dashed border-neutral-800 rounded-3xl">
              <Camera className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="font-graffiti text-2xl text-white mb-1">Your Wall is Empty</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                Upload your photos with your connected social handle to start receiving Mates, Rates, and Dates!
              </p>
              {onOpenUpload && (
                <button
                  type="button"
                  onClick={onOpenUpload}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-graffiti text-sm tracking-wider shadow-lg transition cursor-pointer"
                >
                  Upload First Photo ⚡
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="relative aspect-[4/5] bg-black">
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      {(card.isVerified || isUserVerified) && (
                        <span
                          onClick={onOpenVerificationModal}
                          className="px-2 py-0.5 rounded-full bg-cyan-950/85 backdrop-blur border border-cyan-400/80 text-[10px] font-bold text-cyan-300 flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Verified Artist"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      {onDeleteMyCard && (
                        <button
                          type="button"
                          onClick={() => onDeleteMyCard(card.id)}
                          aria-label="Delete uploaded card"
                          className="p-2 rounded-xl bg-black/70 hover:bg-red-900/80 text-neutral-300 hover:text-red-300 backdrop-blur transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-white text-sm">{card.name}, {card.age}</h4>
                        {(card.isVerified || isUserVerified) && (
                          <VerifiedArtistBadge size="xs" showLabel={false} />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 truncate">{card.location}</p>
                    </div>
                  </div>

                  {/* Card stats */}
                  <div className="p-3 bg-neutral-950 border-t border-neutral-850 flex items-center justify-around text-center">
                    <div>
                      <span className="block font-graffiti text-cyan-400 text-sm">{card.matesCount}</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Mates</span>
                    </div>
                    <div className="w-px h-6 bg-neutral-800" />
                    <div>
                      <span className="block font-graffiti text-amber-400 text-sm">
                        {card.ratingsCount > 0 ? `${card.averageRating.toFixed(1)}★` : "–"}
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase">Rate</span>
                    </div>
                    <div className="w-px h-6 bg-neutral-800" />
                    <div>
                      <span className="block font-graffiti text-pink-400 text-sm">{card.datesCount}</span>
                      <span className="text-[10px] text-neutral-500 uppercase">Dates</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VOTES / CONNECTIONS VIEW */
        <div>
          {filteredVotes.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl">
              <Sparkles className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <h3 className="font-graffiti text-xl text-white mb-1">No Connections Yet</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Head back to the card deck and hit <strong>MATE</strong>, <strong>RATE</strong>, or <strong>DATE</strong> on photos to build your network!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredVotes.map((v) => {
                const targetSocial = v.targetSocials.find((s) => s.isPrimary) || v.targetSocials[0];
                return (
                  <div
                    key={v.id}
                    className="flex items-center gap-3.5 p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition"
                  >
                    <img
                      src={v.cardImage}
                      alt={v.cardName}
                      className="w-14 h-14 rounded-xl object-cover border border-neutral-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-white text-sm truncate">{v.cardName}</h4>
                        {v.action === "date" && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-graffiti">
                            DATE
                          </span>
                        )}
                        {v.action === "mate" && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-graffiti">
                            MATE
                          </span>
                        )}
                        {v.action === "rate" && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-graffiti">
                            {v.ratingScore}/10
                          </span>
                        )}
                      </div>

                      {v.ratingCompliment && (
                        <p className="text-xs text-amber-300/90 truncate mb-1">
                          &ldquo;{v.ratingCompliment}&rdquo;
                        </p>
                      )}

                      {/* Connected Social link */}
                      {targetSocial && (
                        <div className="flex items-center gap-2">
                          <a
                            href={targetSocial.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white group"
                          >
                            <span className="p-1 rounded-md bg-neutral-800 text-pink-400 group-hover:bg-neutral-700 transition">
                              {getPlatformIcon(targetSocial.platform)}
                            </span>
                            <span className="truncate max-w-[120px] font-mono font-medium">
                              @{targetSocial.handle}
                            </span>
                            <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
