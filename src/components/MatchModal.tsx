import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  Instagram,
  Music,
  MessageCircle,
  Share2,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Heart,
  UserCheck,
  Globe,
  Edit2,
  Send,
} from "lucide-react";
import { PhotoCard, ConnectedSocial, ActionType } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  card: PhotoCard | null;
  action: ActionType;
  userSocial: ConnectedSocial;
  ratingScore?: number;
  ratingCompliment?: string;
  onShareToCommunityFeed?: (card: PhotoCard, customMessage?: string) => void;
  onOpenSocialModal?: () => void;
}

export const MatchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  card,
  action,
  userSocial,
  ratingScore,
  ratingCompliment,
  onShareToCommunityFeed,
  onOpenSocialModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareToCommunity, setShareToCommunity] = useState(true);
  const [communityMessage, setCommunityMessage] = useState("Crew linkup! Hit us up on our socials ⚡");
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (isOpen && (action === "date" || action === "mate")) {
      confetti({
        particleCount: action === "date" ? 75 : 55,
        spread: 80,
        origin: { y: 0.6 },
        colors: action === "date" ? ["#ec4899", "#f43f5e", "#fb7185", "#ffd1dc"] : ["#06b6d4", "#3b82f6", "#10b981", "#a855f7"],
      });
      setIsShared(false);
    }
  }, [isOpen, action]);

  if (!isOpen || !card) return null;

  const primarySocial = card.socials.find((s) => s.isPrimary) || card.socials[0];

  const handleCopy = () => {
    if (primarySocial) {
      navigator.clipboard.writeText(primarySocial.handle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmAction = () => {
    if (action === "mate" && shareToCommunity && onShareToCommunityFeed && !isShared) {
      onShareToCommunityFeed(card, communityMessage);
      setIsShared(true);
    }
    onClose();
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "tiktok": return <Music className="w-4 h-4" />;
      case "snapchat": return <MessageCircle className="w-4 h-4" />;
      case "whatsapp": return <MessageCircle className="w-4 h-4" />;
      default: return <Share2 className="w-4 h-4" />;
    }
  };

  return (
    <div
      id="modal-match-success"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-neutral-900 border-2 border-neutral-750 rounded-3xl p-5 sm:p-6 shadow-2xl text-center overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
        {/* Street glow elements */}
        {action === "date" && (
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        )}
        {action === "mate" && (
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        )}

        <button
          id="btn-close-match-modal"
          type="button"
          onClick={onClose}
          aria-label="Close match notification"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-2 border text-xs font-bold uppercase tracking-wider">
          {action === "date" && (
            <span className="text-pink-400 border-pink-500/50 bg-pink-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-400" /> DATE CONNECTION UNLOCKED!
            </span>
          )}
          {action === "mate" && (
            <span className="text-cyan-400 border-cyan-500/50 bg-cyan-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" /> CREW MATE LINKED!
            </span>
          )}
          {action === "rate" && (
            <span className="text-amber-400 border-amber-500/50 bg-amber-500/10 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> RATE VOTE DELIVERED!
            </span>
          )}
        </div>

        {/* Title in graffiti font */}
        <h2 className="font-graffiti text-3xl sm:text-4xl text-white tracking-wide mb-1">
          {action === "date" ? "CRUSH CONFIRMED!" : action === "mate" ? "YOU GOT A MATE!" : "RATING SUBMITTED!"}
        </h2>

        <p className="text-xs sm:text-sm text-neutral-300 mb-4">
          {action === "date"
            ? `You and ${card.name} are ready to connect!`
            : action === "mate"
            ? `Squad vibes! Link your socials with ${card.name} and share with the crew.`
            : `You rated ${card.name} ${ratingScore}/10 with "${ratingCompliment}".`}
        </p>

        {/* Profile Card Preview */}
        <div className="flex items-center gap-3 p-2.5 bg-neutral-950/80 border border-neutral-800 rounded-2xl mb-4 text-left">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-14 h-14 rounded-xl object-cover border border-neutral-700 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm truncate">{card.name}, {card.age}</h3>
            <p className="text-[11px] text-neutral-400 truncate">{card.location}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[11px] font-graffiti text-cyan-400">
                {card.matesCount + (action === "mate" ? 1 : 0)} Mates
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-[11px] font-graffiti text-pink-400">
                {card.datesCount + (action === "date" ? 1 : 0)} Dates
              </span>
            </div>
          </div>
        </div>

        {/* Target's Connected Social Channel Card */}
        {primarySocial && (
          <div className="p-3 bg-neutral-800/60 border border-neutral-700/80 rounded-2xl mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between">
              <span>{card.name}&apos;s Connected Social</span>
              <span className="text-pink-400 flex items-center gap-1">
                {getPlatformIcon(primarySocial.platform)} {primarySocial.platform.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 bg-neutral-900 border border-neutral-700 rounded-xl">
              <span className="font-mono text-xs sm:text-sm text-white font-semibold truncate">
                @{primarySocial.handle}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id="btn-copy-social-handle"
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                {primarySocial.url && (
                  <a
                    id="btn-open-target-social"
                    href={primarySocial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User's Own Linked Social Channel & Link-More Button */}
        <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl mb-4 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase font-semibold text-neutral-400">
              Your Linked Social:
            </span>
            {onOpenSocialModal && (
              <button
                type="button"
                onClick={onOpenSocialModal}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" /> Change / Link
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-1.5">
              {getPlatformIcon(userSocial.platform)}
              <span>@{userSocial.handle || "unlinked"}</span>
            </span>
            <span className="text-[11px] text-neutral-400">
              Shared on this Mate link
            </span>
          </div>
        </div>

        {/* MATE OPTION: POST TO COMMUNITY FEED FOR INTERACTIONS IF USER CHOOSES */}
        {action === "mate" && (
          <div className="p-3 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/40 rounded-2xl mb-4 text-left">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={shareToCommunity}
                onChange={(e) => setShareToCommunity(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-cyan-500 bg-neutral-900 border-neutral-750 focus:ring-cyan-400"
              />
              <div className="flex-1">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Show on Community Feed for Interactions
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                  Allows crew members to see your linked Mate connection, say hi, send reactions, and link socials.
                </p>
              </div>
            </label>

            {shareToCommunity && (
              <div className="mt-2.5 pt-2 border-t border-cyan-900/50">
                <input
                  type="text"
                  value={communityMessage}
                  onChange={(e) => setCommunityMessage(e.target.value)}
                  placeholder="Optional shoutout for the crew..."
                  className="w-full bg-neutral-900 border border-cyan-700/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}
          </div>
        )}

        <button
          id="btn-continue-swiping"
          type="button"
          onClick={handleConfirmAction}
          className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-graffiti text-lg tracking-wider transition active:scale-95 shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          {action === "mate" && shareToCommunity ? (
            <>
              <Send className="w-4 h-4" /> Share to Community & Continue
            </>
          ) : (
            "Keep Swiping ⚡"
          )}
        </button>
      </div>
    </div>
  );
};

