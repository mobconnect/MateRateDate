import React, { useState } from "react";
import { UserCheck, X, Sparkles, MessageCircle, Instagram, Music, Share2 } from "lucide-react";
import type { SocialHandles } from "../types";
import { createMateConnection, createFeedPost } from "../firebase/firestore/content";
import { playMatch } from "../utils/audio";

interface Props {
  open: boolean;
  onClose: () => void;
  target: { id: string; name: string; photoUrl: string };
  userId: string;
  userHandle: string;
  isUserVerified?: boolean;
}

export function MateModal({ open, onClose, target, userId, userHandle, isUserVerified = false }: Props) {
  const [handles, setHandles] = useState<SocialHandles>({});
  const [showOnFeed, setShowOnFeed] = useState(true);
  const [shoutout, setShoutout] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const connId = await createMateConnection({
        userId,
        targetUserId: target.id,
        targetName: target.name,
        targetPhotoUrl: target.photoUrl,
        socialHandles: handles,
        showOnFeed,
        shoutout: shoutout.trim() || undefined,
      });

      if (showOnFeed) {
        await createFeedPost({
          mateConnectionId: connId,
          userHandle,
          targetName: target.name,
          targetPhotoUrl: target.photoUrl,
          shoutout: shoutout.trim() || undefined,
          reactions: { hi: 0, drip: 0, cheers: 0 },
          isUserVerified,
        });
      }

      playMatch();
      onClose();
    } catch (e) {
      console.error("Mate error", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="modal-mate-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mate-modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-750 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-mate-modal"
          type="button"
          onClick={onClose}
          aria-label="Close Mate dialog"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 id="mate-modal-heading" className="font-graffiti text-2xl text-white tracking-wide">
              Mate with {target.name}
            </h2>
            <p className="text-xs text-neutral-400">
              Exchange street contacts and invite them to your crew.
            </p>
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
              Share Your Social Handles (Optional)
            </label>
            <SocialHandlesEditor handles={handles} onChange={setHandles} />
          </div>

          {/* Shoutout input */}
          <div>
            <label htmlFor="mate-shoutout" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
              Crew Shoutout
            </label>
            <textarea
              id="mate-shoutout"
              value={shoutout}
              onChange={(e) => setShoutout(e.target.value)}
              rows={2}
              placeholder="e.g. Crew linkup! Let's hit the graffiti warehouse jam 🔥"
              className="w-full bg-neutral-950 border border-neutral-750 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Feed broadcast checkbox */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 cursor-pointer">
            <input
              id="chk-mate-show-feed"
              type="checkbox"
              checked={showOnFeed}
              onChange={(e) => setShowOnFeed(e.target.checked)}
              className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 accent-pink-500"
            />
            <div className="text-[11px]">
              <span className="font-semibold text-white block">Broadcast to Community Feed</span>
              <span className="text-neutral-400">Share this mate linkup to the public wall for cheers & reactions.</span>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-4 mt-2 border-t border-neutral-800">
          <button
            id="btn-cancel-mate-action"
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-mate-action"
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-graffiti text-xs tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Connecting..." : "Confirm Mate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SocialHandlesEditor({
  handles,
  onChange,
}: {
  handles: SocialHandles;
  onChange: (h: SocialHandles) => void;
}) {
  const fields: { key: keyof SocialHandles; label: string; icon: React.ReactNode }[] = [
    { key: "instagram", label: "Instagram (@tag)", icon: <Instagram className="w-3.5 h-3.5 text-pink-400" /> },
    { key: "tiktok", label: "TikTok (@tag)", icon: <Music className="w-3.5 h-3.5 text-cyan-400" /> },
    { key: "snapchat", label: "Snapchat (username)", icon: <MessageCircle className="w-3.5 h-3.5 text-yellow-400" /> },
    { key: "discord", label: "Discord (handle)", icon: <Share2 className="w-3.5 h-3.5 text-indigo-400" /> },
    { key: "whatsapp", label: "WhatsApp (phone)", icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  const setField = (key: keyof SocialHandles, value: string) => {
    onChange({ ...handles, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {fields.map((f) => (
        <div key={f.key} className="relative flex items-center">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {f.icon}
          </span>
          <input
            id={`input-mate-social-${f.key}`}
            type="text"
            placeholder={f.label}
            value={handles[f.key] || ""}
            onChange={(e) => setField(f.key, e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-750 focus:border-cyan-400 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 outline-none transition"
          />
        </div>
      ))}
    </div>
  );
}
