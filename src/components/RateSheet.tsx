import React, { useState } from "react";
import { Star, Sparkles, X, Check } from "lucide-react";
import { RATING_COMPLIMENTS } from "../data/mockProfiles";
import { sounds } from "../utils/audio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  onSubmitRating: (score: number, compliment: string) => void;
}

export const RateSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  targetName,
  onSubmitRating,
}) => {
  const [score, setScore] = useState<number>(10);
  const [selectedCompliment, setSelectedCompliment] = useState<string>(RATING_COMPLIMENTS[0]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    sounds.playSpray();
    sounds.playStamp();
    onSubmitRating(score, selectedCompliment);
    onClose();
  };

  return (
    <div
      id="modal-rate-sheet"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-neutral-900 border-t-2 sm:border-2 border-amber-500/60 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Street wall gold aura */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          id="btn-close-rate-sheet"
          type="button"
          onClick={onClose}
          aria-label="Close rating dialog"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
          </span>
          <div>
            <h2 className="font-graffiti text-2xl sm:text-3xl text-white tracking-wide">
              Rate {targetName}&apos;s Vibe
            </h2>
            <p className="text-xs text-neutral-400">
              Spray your official graffiti rating & aesthetic review!
            </p>
          </div>
        </div>

        {/* Big Score Visualizer */}
        <div className="my-5 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="font-graffiti text-5xl sm:text-6xl text-amber-400 graffiti-shadow-yellow font-bold">
              {score}
            </span>
            <span className="font-graffiti text-2xl text-neutral-500">/ 10</span>
          </div>

          {/* Quick star rating buttons */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  sounds.playRattle();
                  setScore(val);
                }}
                className={`w-7 h-8 sm:w-8 sm:h-9 rounded-lg font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                  val <= score
                    ? "bg-amber-400 text-black font-extrabold shadow-md scale-105"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Compliments / Graffiti Tags */}
        <div className="mb-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Select Graffiti Tag Compliment
          </label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
            {RATING_COMPLIMENTS.map((comp) => {
              const isSelected = selectedCompliment === comp;
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setSelectedCompliment(comp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-amber-400/20 border-amber-400 text-amber-300 ring-1 ring-amber-400"
                      : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="btn-submit-rate-vote"
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-graffiti text-xl tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Star className="w-5 h-5 fill-black text-black" />
          SPRAY OFFICIAL RATE {score}/10 ⚡
        </button>
      </div>
    </div>
  );
};
