import React from "react";
import { Volume2, VolumeX, X, Sliders, RotateCcw } from "lucide-react";

type SoundCategory = "spray" | "stamp" | "match" | "ui";

interface SoundSettings {
  master: boolean;
  categories: Record<SoundCategory, boolean>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  settings: SoundSettings;
  onChange: (next: SoundSettings) => void;
}

const CATEGORY_DETAILS: Record<SoundCategory, { name: string; desc: string }> = {
  spray: { name: "Aerosol Spray", desc: "Graffiti can hiss on swipe & card reload" },
  stamp: { name: "Tag Impact Stamp", desc: "Tactile boom on votes & submissions" },
  match: { name: "Linkup Match Fanfare", desc: "Synthesizer celebration when cards connect" },
  ui: { name: "UI Micro-Interactions", desc: "Haptic feedback clicks on toggles and filters" },
};

export function SoundSettingsSheet({ open, onClose, settings, onChange }: Props) {
  if (!open) return null;

  const toggleCategory = (cat: SoundCategory) => {
    onChange({
      ...settings,
      categories: {
        ...settings.categories,
        [cat]: !settings.categories[cat],
      },
    });
  };

  const toggleMaster = () => {
    const nextMaster = !settings.master;
    onChange({
      ...settings,
      master: nextMaster,
    });
  };

  return (
    <div
      id="sheet-sound-settings"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sound-sheet-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-neutral-900 border-t-2 sm:border-2 border-neutral-750 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          id="btn-close-sound-sheet"
          type="button"
          onClick={onClose}
          aria-label="Close sound settings dialog"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Sliders className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 id="sound-sheet-title" className="font-graffiti text-2xl text-white tracking-wide">
              Audio & Sound Effects
            </h2>
            <p className="text-xs text-neutral-400">
              Customize real-time synthesized graffiti acoustics.
            </p>
          </div>
        </div>

        {/* Master audio switch */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 mb-3">
          <div className="flex items-center gap-2.5">
            {settings.master ? (
              <Volume2 className="w-5 h-5 text-cyan-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-neutral-500" />
            )}
            <div>
              <span className="font-semibold text-white block text-sm">Master Audio</span>
              <span className="text-[11px] text-neutral-400">Enable synthesized effects engine</span>
            </div>
          </div>
          <button
            id="btn-toggle-master-audio"
            type="button"
            role="switch"
            aria-checked={settings.master}
            onClick={toggleMaster}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.master ? "bg-cyan-500" : "bg-neutral-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.master ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Category channels */}
        <div className="space-y-2">
          {(Object.keys(CATEGORY_DETAILS) as SoundCategory[]).map((cat) => {
            const isEnabled = settings.master && settings.categories[cat];
            return (
              <div
                key={cat}
                className={`flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-850 transition ${
                  settings.master ? "opacity-100" : "opacity-40"
                }`}
              >
                <div className="pr-3">
                  <span className="font-medium text-white block text-xs">
                    {CATEGORY_DETAILS[cat].name}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {CATEGORY_DETAILS[cat].desc}
                  </span>
                </div>
                <button
                  id={`btn-toggle-sound-${cat}`}
                  type="button"
                  role="switch"
                  disabled={!settings.master}
                  aria-checked={isEnabled}
                  onClick={() => toggleCategory(cat)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed ${
                    isEnabled ? "bg-pink-500" : "bg-neutral-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5 pt-4 mt-3 border-t border-neutral-800">
          <button
            id="btn-reset-sound-defaults"
            type="button"
            onClick={() =>
              onChange({
                master: true,
                categories: { spray: true, stamp: true, match: true, ui: true },
              })
            }
            className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            id="btn-done-sound-settings"
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-graffiti text-xs tracking-wider font-extrabold transition cursor-pointer shadow-md text-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
