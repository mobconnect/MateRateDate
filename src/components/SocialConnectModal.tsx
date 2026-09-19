import React, { useState } from "react";
import {
  Instagram,
  MessageCircle,
  Share2,
  Check,
  Music,
  ExternalLink,
  Copy,
  X,
  Sparkles,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { ConnectedSocial, SocialPlatform, ActionType } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSocial: ConnectedSocial;
  onSaveSocial: (social: ConnectedSocial) => void;
  pendingAction?: ActionType | null;
  onContinueAction?: () => void;
}

const PLATFORMS: { id: SocialPlatform; name: string; icon: any; color: string; prefix: string; placeholder: string }[] = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-400 border-pink-500/40 bg-pink-500/10", prefix: "@", placeholder: "your_insta_tag" },
  { id: "tiktok", name: "TikTok", icon: Music, color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10", prefix: "@", placeholder: "your_tiktok" },
  { id: "snapchat", name: "Snapchat", icon: MessageCircle, color: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10", prefix: "@", placeholder: "snap_handle" },
  { id: "discord", name: "Discord", icon: Share2, color: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10", prefix: "", placeholder: "username#1234" },
  { id: "x", name: "X / Twitter", icon: Share2, color: "text-neutral-200 border-neutral-600 bg-neutral-800/40", prefix: "@", placeholder: "twitter_handle" },
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10", prefix: "", placeholder: "+1 555 0192" },
  { id: "spotify", name: "Spotify", icon: Music, color: "text-green-400 border-green-500/40 bg-green-500/10", prefix: "", placeholder: "profile-name" },
];

export const SocialConnectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSocial,
  onSaveSocial,
  pendingAction,
  onContinueAction,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(currentSocial.platform || "instagram");
  const [handle, setHandle] = useState<string>(currentSocial.handle || "");
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const currentMeta = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.trim().replace(/^@/, "");
    if (!cleanHandle) return;

    let url = "";
    if (selectedPlatform === "instagram") url = `https://instagram.com/${cleanHandle}`;
    else if (selectedPlatform === "tiktok") url = `https://tiktok.com/@${cleanHandle}`;
    else if (selectedPlatform === "snapchat") url = `https://snapchat.com/add/${cleanHandle}`;
    else if (selectedPlatform === "x") url = `https://x.com/${cleanHandle}`;
    else if (selectedPlatform === "whatsapp") url = `https://wa.me/${cleanHandle.replace(/\D/g, "")}`;
    else url = `https://${selectedPlatform}.com/${cleanHandle}`;

    const newSocial: ConnectedSocial = {
      platform: selectedPlatform,
      handle: cleanHandle,
      url,
      isPrimary: true,
    };

    onSaveSocial(newSocial);
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
      onClose();
      if (onContinueAction) {
        onContinueAction();
      }
    }, 450);
  };

  return (
    <div
      id="modal-social-connect"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-modal-title"
    >
      <div className="relative w-full max-w-md bg-neutral-900 border-2 border-neutral-700 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Street wall texture accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          id="btn-close-social-modal"
          type="button"
          onClick={onClose}
          aria-label="Close social connection dialog"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <span className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 id="social-modal-title" className="font-graffiti text-2xl text-white tracking-wide">
              {pendingAction
                ? `Connect Social to ${pendingAction.toUpperCase()}!`
                : "Connect Your Social"}
            </h2>
            <p className="text-xs text-neutral-400">
              Pick your platform so mates and crushes can connect with you.
            </p>
          </div>
        </div>

        {pendingAction && (
          <div className="my-3 px-3 py-2 bg-neutral-800/80 border border-neutral-700/80 rounded-xl text-xs text-neutral-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              Your connected social is shared when you cast a <strong>{pendingAction.toUpperCase()}</strong>!
            </span>
          </div>
        )}

        {/* Platform Selector Grid */}
        <div className="my-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
            Choose Your Platform
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {PLATFORMS.map((p) => {
              const isSelected = selectedPlatform === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  id={`btn-select-platform-${p.id}`}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition text-xs font-medium cursor-pointer ${
                    isSelected
                      ? `${p.color} border-current ring-2 ring-current shadow-lg scale-105`
                      : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="truncate w-full text-center">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Handle Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="social-handle-input"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5"
            >
              Your {currentMeta.name} Handle or Tag
            </label>
            <div className="relative flex items-center">
              {currentMeta.prefix && (
                <span className="absolute left-3.5 text-neutral-500 font-bold text-sm">
                  {currentMeta.prefix}
                </span>
              )}
              <input
                id="social-handle-input"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder={currentMeta.placeholder}
                required
                className={`w-full bg-neutral-950 border border-neutral-700 rounded-xl py-2.5 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition ${
                  currentMeta.prefix ? "pl-8" : "pl-4"
                }`}
              />
            </div>
          </div>

          {/* Privacy & Security Safe Guard */}
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-2.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-300 block">Individual Profile Privacy Protection</span>
              <span>
                Your handle is only shared when you cast a rating or connect. We never broadcast your personal email, phone numbers, or passwords.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              id="btn-save-social-submit"
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-graffiti text-lg tracking-wider shadow-lg shadow-pink-500/25 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-5 h-5" /> Saved & Connected!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {pendingAction ? `Save & Cast ${pendingAction.toUpperCase()}` : "Save Social"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
