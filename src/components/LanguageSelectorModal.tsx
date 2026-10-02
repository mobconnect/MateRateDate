import React, { useState } from "react";
import { Globe, Search, Check, X, Compass } from "lucide-react";
import { useI18n } from "../i18n/i18nContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentLanguage, setLanguage, supportedLanguages, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredLanguages = supportedLanguages.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.region.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-selector-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 id="language-selector-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t("common.changeLanguage")}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-cyan-300 border border-neutral-700">
                  20 Languages
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Global internationalization covering all continents
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.searchLanguage")}
              className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-750 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh]">
          {filteredLanguages.map((lang) => {
            const isSelected = currentLanguage.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_10px_rgba(0,247,255,0.15)] text-white"
                    : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/50 text-neutral-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs sm:text-sm text-white">
                        {lang.nativeName}
                      </span>
                      {lang.direction === "rtl" && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-600/40 text-amber-300">
                          RTL
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {lang.name} • <span className="text-neutral-500">{lang.region}</span>
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-500 uppercase px-1.5 py-0.5 rounded bg-neutral-900">
                    {lang.code}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Automatic browser locale detection enabled</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-white font-medium text-xs transition cursor-pointer"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
