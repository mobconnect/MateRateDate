import React, { useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Heart,
  Star,
  Smartphone,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  KeyRound,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { UserPrivacySettings } from "../types";
import { playUISwipe } from "../utils/audio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  privacySettings: UserPrivacySettings;
  onUpdatePrivacySettings: (settings: UserPrivacySettings) => void;
  userPhone?: string;
  isVerified?: boolean;
  onClearAllActivity?: () => void;
}

export const PrivacySecurityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  privacySettings,
  onUpdatePrivacySettings,
  userPhone,
  isVerified,
  onClearAllActivity,
}) => {
  const [settings, setSettings] = useState<UserPrivacySettings>(privacySettings);
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<"controls" | "notice">("controls");

  if (!isOpen) return null;

  const handleToggle = (key: keyof UserPrivacySettings) => {
    playUISwipe();
    const updated = {
      ...settings,
      [key]: typeof settings[key] === "boolean" ? !settings[key] : settings[key],
    };
    setSettings(updated);
    onUpdatePrivacySettings(updated);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2200);
  };

  return (
    <div
      id="modal-privacy-security"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-750 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          id="btn-close-privacy-modal"
          type="button"
          onClick={onClose}
          aria-label="Close privacy and security settings"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Title and Privacy Shield */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 id="privacy-modal-title" className="font-graffiti text-2xl text-white tracking-wide flex items-center gap-2">
              Privacy & Security
            </h2>
            <p className="text-xs text-neutral-400">
              Control your individual profile visibility and personal data protection.
            </p>
          </div>
        </div>

        {/* Saved confirmation toast */}
        {showSavedNotification && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Privacy preferences updated & saved locally.</span>
          </div>
        )}

        {/* Tabs: Controls vs Privacy Notice */}
        <div className="flex items-center gap-2 p-1 bg-neutral-950 border border-neutral-800 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("controls")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "controls"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            Profile Controls
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notice")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "notice"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-pink-400" />
            Privacy Policy & Rights
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-4 pr-1 text-xs">
          {activeTab === "controls" ? (
            <>
              {/* Profile Verification & Phone Protection Info */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white">Phone Authentication Privacy</span>
                  </div>
                  {isVerified ? (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px]">
                      Not linked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Your phone number is used exclusively for Firebase authentication and anti-bot verification. It is never sold, broadcast, or displayed on public photo cards.
                </p>
                {userPhone && (
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-850 text-[11px]">
                    <span className="text-neutral-400">Stored Phone Number:</span>
                    <span className="font-mono text-neutral-300">
                      {settings.hidePhoneNumber
                        ? `${userPhone.slice(0, 3)}••••••${userPhone.slice(-2)}`
                        : userPhone}
                    </span>
                  </div>
                )}
              </div>

              {/* Individual Toggle Switches */}
              <div className="space-y-2.5">
                <h3 className="font-semibold text-neutral-300 text-xs uppercase tracking-wider px-1">
                  Individual Profile Safeguards
                </h3>

                {/* Hide Phone Mask */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <div className="pr-3">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mask Phone Number in UI</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Always mask linked phone digits with bullet symbols across client interfaces.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.hidePhoneNumber}
                    onClick={() => handleToggle("hidePhoneNumber")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.hidePhoneNumber ? "bg-cyan-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.hidePhoneNumber ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Auto EXIF Metadata Scrubbing */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <div className="pr-3">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-pink-400" />
                      <span>Scrub EXIF & GPS Metadata on Upload</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Automatically strips camera make, timestamp, and device GPS geolocation tags from uploaded photos before saving to the deck.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.autoBlurExifData}
                    onClick={() => handleToggle("autoBlurExifData")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.autoBlurExifData ? "bg-pink-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.autoBlurExifData ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Ratings */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <div className="pr-3">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Allow Street Graffiti Ratings</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Permit community members to leave 1-10 scores and compliments on your uploaded cards.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.allowRatingsFromPublic}
                    onClick={() => handleToggle("allowRatingsFromPublic")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.allowRatingsFromPublic ? "bg-amber-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.allowRatingsFromPublic ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Date Crush Requests */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <div className="pr-3">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-pink-400" />
                      <span>Allow Date Crush Requests</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Allow users to send Date match invitations to your shared primary social handle.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.allowDateRequests}
                    onClick={() => handleToggle("allowDateRequests")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.allowDateRequests ? "bg-pink-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.allowDateRequests ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Mate Crew Invites */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <div className="pr-3">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Allow Mate Crew Invites</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Accept crew connection linkups and feed interactions from fellow urban creators.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.allowMateInvites}
                    onClick={() => handleToggle("allowMateInvites")}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.allowMateInvites ? "bg-cyan-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        settings.allowMateInvites ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Data Rights & Clearing */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Delete Local Activity & Clear Cache</span>
                    <span className="text-[11px] text-neutral-500">
                      Permanently wipes your ratings, votes history, and interaction state on this device.
                    </span>
                  </div>
                  {onClearAllActivity && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to wipe all local activity history and reset votes?")) {
                          onClearAllActivity();
                          onClose();
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 font-medium text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Wipe Data</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* PRIVACY POLICY & USER RIGHTS ACCORDION */
            <div className="space-y-3 leading-relaxed text-neutral-300">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                <h3 className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  Australian Privacy Principles (APP) & GDPR Compliance
                </h3>
                <p className="text-[11px] text-neutral-400">
                  MateRateDate is operated by <strong>Just Be You</strong> (ABN: 59 726 146 692, D-U-N-S®: 749068766) under the domain <strong>justbeyou.com.au</strong>. We are committed to protecting individual privacy and adhering to the Privacy Act 1988 (Cth) and international privacy frameworks.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <h4 className="font-semibold text-white text-xs mb-1">1. User Individual Profile Safety</h4>
                <p className="text-[11px] text-neutral-400">
                  Your uploaded cards and profile handle remain under your direct control at all times. You may delete any uploaded photo card instantly from the "My Photos" deck tab, which removes it from the active rotation and wipes its associations.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <h4 className="font-semibold text-white text-xs mb-1">2. No Unsolicited Third-Party Tracking</h4>
                <p className="text-[11px] text-neutral-400">
                  We do not sell personal data, profile handles, phone numbers, or uploaded media to third-party ad networks or brokers. Data is stored on your device and via secure Firebase Cloud services with restricted IAM rules.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <h4 className="font-semibold text-white text-xs mb-1">3. Right to Erasure & Access</h4>
                <p className="text-[11px] text-neutral-400">
                  You possess the complete right to request access, correction, or permanent erasure of any user data linked to your account by using the Wipe Data control or contacting <strong>privacy@justbeyou.com.au</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info notice */}
        <div className="pt-4 mt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Protected by AES-256 & Firebase Auth Security</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
