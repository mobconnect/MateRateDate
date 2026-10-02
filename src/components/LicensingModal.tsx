import React, { useState } from "react";
import {
  Shield,
  FileText,
  Copy,
  Check,
  Download,
  X,
  ExternalLink,
  Globe,
  Building,
  Scale,
  Award,
} from "lucide-react";
import { APP_STRINGS } from "../data/strings";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  domain?: string;
  duns?: string;
  abn?: string;
}

export const LicensingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  domain = APP_STRINGS.meta.domain,
  duns = APP_STRINGS.meta.dunsNumber,
  abn = APP_STRINGS.meta.abnNumber,
}) => {
  const [activeTab, setActiveTab] = useState<"commercial" | "opensource" | "corporate" | "accessibility">("commercial");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullLicenseText = `
COMMERCIAL & COMMUNITY OPEN SOURCE DUAL LICENSE
Application: ${APP_STRINGS.meta.appName}
Package: ${APP_STRINGS.meta.packageName}
Entity: ${APP_STRINGS.meta.company}
Official Domain: https://${domain}
ABN: ${abn}
D-U-N-S® Number: ${duns}
Copyright: ${APP_STRINGS.meta.copyright}
Accessibility: ${APP_STRINGS.meta.accessibilityStandard}

1. JUST BE YOU COMMERCIAL & COMMUNITY LICENSE
Permission is hereby granted to authorized users to compile, test, distribute, and execute the application across Web, Android, and iOS platforms. Commercial redistribution, re-branding, or proprietary reverse-engineering without prior written authorization from Just Be You is strictly prohibited.

2. OPEN SOURCE INTEGRATIONS & THIRD-PARTY ATTRIBUTION
- React (MIT) - Copyright (c) Meta Platforms, Inc.
- Lucide React (ISC) - Copyright (c) Lucide Contributors.
- Tailwind CSS (MIT) - Copyright (c) Tailwind Labs, Inc.
- Canvas-Confetti (MIT) - Copyright (c) 2020 Kiril Vatev.
- jsPDF (MIT) - Copyright (c) 2010-2021 James Hall.
- Vitest (MIT) - Copyright (c) 2021-Present Anthony Fu.
- Google GenAI TypeScript SDK (Apache 2.0) - Copyright 2025 Google LLC.

3. GOVERNING LAW & JURISDICTION
Governed by the laws of the Commonwealth of Australia and New South Wales. Fully adheres to Privacy Act 1988 (Cth), Australian Privacy Principles (APPs), and WCAG 2.2 Level AA accessibility specifications.
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLicenseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadLicense = () => {
    const blob = new Blob([fullLicenseText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LICENSE_MATE_RATE_DATE.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="licensing-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="licensing-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {APP_STRINGS.licensing.title}
              </h2>
              <p className="text-xs text-neutral-400">
                {APP_STRINGS.licensing.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/50 px-5 gap-2 overflow-x-auto text-xs py-2">
          <button
            type="button"
            onClick={() => setActiveTab("commercial")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              activeTab === "commercial"
                ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Application License
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("opensource")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              activeTab === "opensource"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Open Source Packages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("corporate")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              activeTab === "corporate"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Corporate & DUNS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("accessibility")}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              activeTab === "accessibility"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            WCAG 2.2 Accessibility
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {activeTab === "commercial" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <h3 className="font-semibold text-white text-sm">
                  {APP_STRINGS.licensing.sections.overview.heading}
                </h3>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  {APP_STRINGS.licensing.sections.overview.body}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <h3 className="font-semibold text-white text-sm">
                  {APP_STRINGS.licensing.sections.commercial.heading}
                </h3>
                <p className="text-neutral-300 text-xs leading-relaxed font-mono whitespace-pre-line bg-neutral-900/90 p-3 rounded-lg border border-neutral-800">
                  {APP_STRINGS.licensing.sections.commercial.body}
                </p>
              </div>
            </div>
          )}

          {activeTab === "opensource" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <h3 className="font-semibold text-white text-sm">
                  {APP_STRINGS.licensing.sections.openSource.heading}
                </h3>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  {APP_STRINGS.licensing.sections.openSource.body}
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-850">
                  {[
                    { name: "React & React DOM", license: "MIT License", creator: "Meta Platforms, Inc." },
                    { name: "Lucide React", license: "ISC License", creator: "Lucide Contributors" },
                    { name: "Tailwind CSS", license: "MIT License", creator: "Tailwind Labs, Inc." },
                    { name: "Canvas Confetti", license: "MIT License", creator: "Kiril Vatev" },
                    { name: "jsPDF", license: "MIT License", creator: "James Hall" },
                    { name: "Vitest", license: "MIT License", creator: "Anthony Fu & Vitest Team" },
                    { name: "Google GenAI SDK", license: "Apache 2.0", creator: "Google LLC" },
                  ].map((pkg, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800"
                    >
                      <div>
                        <span className="font-semibold text-white text-xs block">{pkg.name}</span>
                        <span className="text-[11px] text-neutral-400">{pkg.creator}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-cyan-300 border border-neutral-700">
                        {pkg.license}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "corporate" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>{APP_STRINGS.licensing.sections.australianLaw.heading}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Registered Entity</span>
                    <span className="font-semibold text-white">{APP_STRINGS.meta.company}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Official Domain</span>
                    <a
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      {domain}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">D-U-N-S® Registered Number</span>
                    <span className="font-mono text-emerald-400 font-bold">{duns}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Australian Business Number (ABN)</span>
                    <span className="font-mono text-neutral-200">{abn}</span>
                  </div>
                </div>

                <p className="text-neutral-300 text-xs leading-relaxed pt-2 border-t border-neutral-850">
                  {APP_STRINGS.licensing.sections.australianLaw.body}
                </p>
              </div>
            </div>
          )}

          {activeTab === "accessibility" && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{APP_STRINGS.licensing.sections.accessibility.heading}</span>
                </h3>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  {APP_STRINGS.licensing.sections.accessibility.body}
                </p>
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1 text-xs">
                  <div className="text-neutral-300 font-medium">• Perceivable: 4.5:1 text-to-background contrast across dark-street theme.</div>
                  <div className="text-neutral-300 font-medium">• Operable: Fully navigable via keyboard without pointer trap.</div>
                  <div className="text-neutral-300 font-medium">• Understandable: Clear feedback chimes, audio synthesis volume controls, error explanations.</div>
                  <div className="text-neutral-300 font-medium">• Robust: Standard ARIA roles (dialog, status, alert) tested and verified.</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-medium transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">License Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy License Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadLicense}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download LICENSE.txt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
