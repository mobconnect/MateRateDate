import React, { useState, useEffect } from "react";
import {
  FileText,
  Globe,
  ShieldCheck,
  Smartphone,
  Check,
  ExternalLink,
  Edit2,
  X,
  Building,
  Lock,
} from "lucide-react";
import { generateAppCodePDF } from "../utils/pdfGenerator";

interface Props {
  dunsNumber?: string;
  domain?: string;
  abnNumber?: string;
  onUpdateCredentials?: (domain: string, duns: string, abn: string) => void;
  onOpenPrivacy?: () => void;
}

export const MobConnectFooter: React.FC<Props> = ({
  dunsNumber = "749068766",
  domain = "justbeyou.com.au",
  abnNumber = "59 726 146 692",
  onUpdateCredentials,
  onOpenPrivacy,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentDomain, setCurrentDomain] = useState(() => {
    return localStorage.getItem("mrd_domain") || domain;
  });
  const [currentDuns, setCurrentDuns] = useState(() => {
    const saved = localStorage.getItem("mrd_duns");
    if (saved && !saved.includes("59-726") && !saved.includes("59726")) {
      return saved;
    }
    return dunsNumber;
  });
  const [currentAbn, setCurrentAbn] = useState(() => {
    return localStorage.getItem("mrd_abn") || abnNumber;
  });
  const [currentCopyright, setCurrentCopyright] = useState(() => {
    return (
      localStorage.getItem("mrd_copyright") ||
      "© 2026 MateRateDate • Just Be You (justbeyou.com.au). All rights reserved."
    );
  });
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  useEffect(() => {
    localStorage.setItem("mrd_domain", currentDomain);
  }, [currentDomain]);

  useEffect(() => {
    localStorage.setItem("mrd_duns", currentDuns);
  }, [currentDuns]);

  useEffect(() => {
    localStorage.setItem("mrd_abn", currentAbn);
  }, [currentAbn]);

  useEffect(() => {
    localStorage.setItem("mrd_copyright", currentCopyright);
  }, [currentCopyright]);

  const handleDownloadPDF = () => {
    generateAppCodePDF();
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCredentials) {
      onUpdateCredentials(currentDomain, currentDuns, currentAbn);
    }
    setIsEditing(false);
  };

  return (
    <footer className="w-full border-t border-neutral-800/80 bg-neutral-950/95 text-neutral-400 py-6 px-4 mt-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-4 text-xs">
        {/* Brand, Domain, DUNS, and ABN Information Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 border-b border-neutral-850">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            <div className="flex items-center gap-2">
              <span className="font-graffiti text-lg text-white tracking-wider">
                MateRateDate
              </span>
              <span className="text-neutral-600">•</span>
              <span className="font-medium text-neutral-300">Just Be You</span>
            </div>

            {/* Domain badge */}
            <a
              href={`https://${currentDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-750 hover:border-cyan-500 text-[11px] text-cyan-300 transition"
              title="Official Registered Domain"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono">{currentDomain}</span>
              <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
            </a>

            {/* D-U-N-S badge */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-750 text-[11px] text-neutral-300"
              title="D-U-N-S® Number"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>D-U-N-S® <span className="font-mono text-emerald-300">{currentDuns}</span></span>
            </span>

            {/* ABN badge with active green indicator */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-750 text-[11px] text-neutral-300"
              title="Australian Business Register ABN"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ABN <span className="font-mono text-neutral-200">{currentAbn}</span></span>
            </span>

            {/* Edit credentials button */}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label="Edit domain, DUNS & ABN"
              className="p-1.5 hover:text-white rounded-lg hover:bg-neutral-800 transition cursor-pointer"
              title="Configure Domain & DUNS credentials"
            >
              <Edit2 className="w-3.5 h-3.5 text-neutral-400 hover:text-cyan-400" />
            </button>
          </div>

          {/* Cross-Platform Badges: Web, Android, iOS & PDF Generator */}
          <div className="flex items-center flex-wrap gap-2.5 justify-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-300 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
              <Smartphone className="w-3.5 h-3.5 text-pink-400" />
              <span>Cross-Platform (Web • Android • iOS)</span>
            </div>

            {/* Download PDF of All Code & Specs */}
            <button
              id="btn-download-code-pdf"
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-pink-500/50 hover:border-pink-400 text-neutral-200 hover:text-white font-medium text-xs transition cursor-pointer shadow-sm"
            >
              {pdfDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-300">PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-pink-400" />
                  <span>Export Code & Architecture PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Legal Copyright Line & Privacy Protection */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 text-neutral-400 text-[11px]">
          <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2">
            <span className="font-semibold text-neutral-300">
              {currentCopyright}
            </span>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <button
              id="btn-footer-privacy-security"
              type="button"
              onClick={onOpenPrivacy}
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition cursor-pointer font-medium"
              title="Individual User Privacy, Security Controls & Australian Privacy Act Compliance"
            >
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Privacy & Security Protection</span>
            </button>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <span>Urban Street Art Photo Evaluation</span>
            <span>•</span>
            <a
              href={`https://${currentDomain}`}
              className="hover:text-cyan-400 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {currentDomain}
            </a>
          </div>
        </div>
      </div>

      {/* Edit Domain, DUNS & ABN Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-2xl p-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-semibold text-white text-sm mb-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              Corporate Identity & Credentials
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Configure your registered domain, D-U-N-S® identity, and copyright statement.
            </p>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-neutral-400 uppercase block mb-1">
                  Active Domain
                </label>
                <input
                  type="text"
                  value={currentDomain}
                  onChange={(e) => setCurrentDomain(e.target.value)}
                  placeholder="justbeyou.com.au"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 uppercase block mb-1">
                  D-U-N-S® Registered Number
                </label>
                <input
                  type="text"
                  value={currentDuns}
                  onChange={(e) => setCurrentDuns(e.target.value)}
                  placeholder="749068766"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 uppercase block mb-1">
                  ABN (Australian Business Number)
                </label>
                <input
                  type="text"
                  value={currentAbn}
                  onChange={(e) => setCurrentAbn(e.target.value)}
                  placeholder="59 726 146 692"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 uppercase block mb-1">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  value={currentCopyright}
                  onChange={(e) => setCurrentCopyright(e.target.value)}
                  placeholder="© 2026 MateRateDate • Just Be You (justbeyou.com.au). All rights reserved."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold rounded-lg text-xs transition shadow-md"
              >
                Save Identity & Credentials
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};
