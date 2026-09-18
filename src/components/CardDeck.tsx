import React, { useState, useRef } from "react";
import {
  MapPin,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Paintbrush,
  Instagram,
  Music,
  MessageCircle,
  Share2,
} from "lucide-react";
import { PhotoCard, ActionType, ConnectedSocial, SoundSettings } from "../types";
import { playUISwipe, playStamp, playSpray } from "../utils/audio";
import { INITIAL_PHOTO_CARDS } from "../data/mockProfiles";

export interface CardDeckProps {
  cards?: PhotoCard[];
  currentIndex?: number;
  onAction?: (action: ActionType, score?: number, compliment?: string) => void;
  onResetDeck?: () => void;
  userSocial?: ConnectedSocial;
  onOpenSocialModal?: (action?: ActionType) => void;
  onOpenGraffitiStudio?: (imageUrl: string) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  soundSettings?: SoundSettings;
  onOpenSoundSettings?: () => void;
}

export function CardDeck({
  cards: propCards,
  currentIndex: propIndex,
  onAction,
  onResetDeck,
  userSocial = { platform: "instagram", handle: "graffiti_writer", isPrimary: true },
  onOpenSocialModal,
  onOpenGraffitiStudio,
  soundEnabled = true,
  onToggleSound,
  soundSettings,
  onOpenSoundSettings,
}: CardDeckProps = {}) {
  // Local fallback if used standalone without props
  const [localIndex, setLocalIndex] = useState(0);
  const cards = propCards && propCards.length > 0 ? propCards : INITIAL_PHOTO_CARDS;
  const index = propIndex !== undefined ? propIndex : localIndex;
  const current = cards[index];

  const [activeStamp, setActiveStamp] = useState<ActionType | null>(null);

  // Swipe gesture tracking (touch & mouse)
  const startX = useRef(0);
  const dx = useRef(0);
  const isDragging = useRef(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Handle action dispatch
  const triggerAction = (action: ActionType, score?: number, compliment?: string) => {
    setActiveStamp(action);
    if (action === "mate" || action === "date") {
      playStamp();
    } else if (action === "rate") {
      playStamp();
    } else {
      playSpray();
    }

    setTimeout(() => {
      setActiveStamp(null);
      if (onAction) {
        onAction(action, score, compliment);
      } else {
        setLocalIndex((i) => i + 1);
      }
    }, 280);
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    dx.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].clientX;
    dx.current = x - startX.current;
    if (cardRef.current) {
      const rotate = dx.current * 0.05;
      cardRef.current.style.transform = `translateX(${dx.current}px) rotate(${rotate}deg)`;
      cardRef.current.style.opacity = String(1 - Math.min(Math.abs(dx.current) / 300, 0.35));
    }
  };

  const onTouchEnd = () => {
    const threshold = 80;
    if (dx.current > threshold) {
      // Swipe right -> Mate
      playUISwipe(); // graffiti swipe sound
      playStamp();   // tag impact for button-style action
      triggerAction("mate");
    } else if (dx.current < -threshold) {
      // Swipe left -> Pass
      playUISwipe(); // graffiti swipe sound
      triggerAction("pass");
    }

    // Reset transform
    if (cardRef.current) {
      cardRef.current.style.transform = "";
      cardRef.current.style.opacity = "";
    }
    dx.current = 0;
  };

  // Mouse drag handlers for desktop browsers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    dx.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    dx.current = e.clientX - startX.current;
    if (cardRef.current) {
      const rotate = dx.current * 0.05;
      cardRef.current.style.transform = `translateX(${dx.current}px) rotate(${rotate}deg)`;
      cardRef.current.style.opacity = String(1 - Math.min(Math.abs(dx.current) / 300, 0.35));
    }
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const threshold = 80;
    if (dx.current > threshold) {
      playUISwipe();
      playStamp();
      triggerAction("mate");
    } else if (dx.current < -threshold) {
      playUISwipe();
      triggerAction("pass");
    }

    if (cardRef.current) {
      cardRef.current.style.transform = "";
      cardRef.current.style.opacity = "";
    }
    dx.current = 0;
  };

  const onMouseLeave = () => {
    if (isDragging.current) {
      onMouseUp();
    }
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case "instagram": return <Instagram className="w-3 h-3" />;
      case "tiktok": return <Music className="w-3 h-3" />;
      case "snapchat": return <MessageCircle className="w-3 h-3" />;
      case "whatsapp": return <MessageCircle className="w-3 h-3" />;
      default: return <Share2 className="w-3 h-3" />;
    }
  };

  if (!current || index >= cards.length) {
    return (
      <div className="mrd-deck text-center py-10 px-4">
        <div className="p-7 bg-[#11131f] border border-[#1f2230] rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-graffiti text-2xl text-white mb-2">Wall Cleared!</h3>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            All passed photos have disappeared from your content. Check your Mates &amp; Dates connections or reload your active deck.
          </p>
          <button
            id="btn-reset-deck"
            type="button"
            onClick={() => {
              if (onResetDeck) onResetDeck();
              setLocalIndex(0);
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-graffiti text-base tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reload Active Wall
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = current.imageUrl || (current as any).photoUrl || "https://picsum.photos/600/800";

  return (
    <div className="mrd-deck">
      {/* Top Status Strip */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1 text-xs">
        {onOpenSocialModal && (
          <button
            id="btn-active-social-pill"
            type="button"
            onClick={() => onOpenSocialModal()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f1220] border border-[#334155] hover:border-pink-500/60 text-neutral-300 transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-[11px] text-neutral-400">Sharing:</span>
            <span className="font-mono font-semibold text-pink-400">
              @{userSocial.handle || "connect_social"}
            </span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <span className="font-mono text-xs text-neutral-400 font-semibold">
            {index + 1}/{cards.length}
          </span>
          {onToggleSound && (
            <button
              id="btn-toggle-deck-sound"
              type="button"
              onClick={onToggleSound}
              aria-label="Toggle graffiti sound"
              className="p-1 rounded-lg bg-[#0f1220] border border-[#334155] text-neutral-400 hover:text-white transition cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              )}
            </button>
          )}
          {onOpenSoundSettings && (
            <button
              id="btn-open-deck-sound-settings"
              type="button"
              onClick={onOpenSoundSettings}
              aria-label="Open sound settings"
              className="p-1 rounded-lg bg-[#0f1220] border border-[#334155] text-neutral-400 hover:text-cyan-400 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Swipable Card */}
      <div
        ref={cardRef}
        className="mrd-card cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <img
          src={imageUrl}
          alt={current.name || "Photo"}
          className="mrd-card-img"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges overlay: rating + spray studio */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur border border-neutral-700 text-[11px] font-graffiti text-amber-300">
              ★ {current.averageRating ? current.averageRating.toFixed(1) : "5.0"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur border border-neutral-700 text-[11px] font-graffiti text-cyan-300">
              {current.matesCount || 0} Mates
            </span>
          </div>

          {onOpenGraffitiStudio && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onOpenGraffitiStudio(imageUrl)}
              className="pointer-events-auto px-3 py-1 rounded-full bg-black/80 backdrop-blur border border-pink-500/60 text-pink-300 hover:bg-pink-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Spray Tag</span>
            </button>
          )}
        </div>

        {/* Active Stamp Overlay */}
        {activeStamp && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div
              className={`animate-ping font-graffiti text-5xl px-6 py-3 rounded-2xl border-4 transform rotate-[-8deg] shadow-2xl ${
                activeStamp === "mate"
                  ? "text-cyan-300 bg-cyan-950/80 border-cyan-400 graffiti-shadow-cyan"
                  : activeStamp === "date"
                  ? "text-pink-300 bg-pink-950/80 border-pink-400 graffiti-shadow-pink"
                  : activeStamp === "rate"
                  ? "text-amber-300 bg-amber-950/80 border-amber-400 graffiti-shadow-yellow"
                  : "text-neutral-300 bg-neutral-950/80 border-neutral-400"
              }`}
            >
              {activeStamp.toUpperCase()}!
            </div>
          </div>
        )}

        {/* Card Overlay with Details & Signature Action Buttons */}
        <div className="mrd-card-overlay">
          <div className="w-full mb-3 text-left pointer-events-none">
            {/* Interest Tags */}
            {current.tags && current.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {current.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur border border-neutral-700/80 text-[10px] font-medium text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Name & Age */}
            <div className="flex items-baseline gap-2 mb-0.5">
              <h3 className="font-graffiti text-2xl font-bold text-white tracking-wide">
                {current.name}
              </h3>
              {current.age && (
                <span className="font-mono text-base text-neutral-300 font-semibold">
                  {current.age}
                </span>
              )}
            </div>

            {/* Location */}
            {current.location && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 mb-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{current.location}</span>
              </div>
            )}

            {/* Tagline */}
            {current.tagline && (
              <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed mb-2 drop-shadow">
                {current.tagline}
              </p>
            )}

            {/* Connected Socials */}
            {current.socials && current.socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-800/80 pointer-events-auto">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">Socials:</span>
                {current.socials.map((s: ConnectedSocial, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-neutral-700 text-[10px] font-mono text-neutral-200"
                  >
                    {getPlatformIcon(s.platform)}
                    <span>@{s.handle}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Signature Action Buttons */}
          <div className="mrd-actions">
            <button
              id="btn-deck-pass"
              type="button"
              className="mrd-btn pass"
              onClick={() => {
                playUISwipe();
                triggerAction("pass");
              }}
            >
              PASS
            </button>
            <button
              id="btn-deck-mate"
              type="button"
              className="mrd-btn mate"
              onClick={() => {
                playUISwipe();
                playStamp();
                triggerAction("mate");
              }}
            >
              MATE
            </button>
            <button
              id="btn-deck-rate"
              type="button"
              className="mrd-btn rate"
              onClick={() => {
                playStamp();
                triggerAction("rate");
              }}
            >
              RATE
            </button>
            <button
              id="btn-deck-date"
              type="button"
              className="mrd-btn date"
              onClick={() => {
                playStamp();
                triggerAction("date");
              }}
            >
              DATE
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Hint Cue */}
      <div className="mrd-swipe-hint">
        Swipe left to Pass • right to Mate
      </div>
    </div>
  );
}
