import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  KeyRound,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Lock,
} from "lucide-react";
import type { ArtistVerification } from "../types";
import {
  sendPhoneVerification,
  confirmPhoneVerificationCode,
  removeArtistVerification,
  SendCodeResult,
} from "../firebase/phoneVerification";
import { playMatch, playSpray, playStamp } from "../utils/audio";
import { VerifiedArtistBadge } from "./VerifiedArtistBadge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentVerification: ArtistVerification;
  onVerificationSuccess: (verification: ArtistVerification) => void;
  onUnlink: () => void;
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  currentVerification,
  onVerificationSuccess,
  onUnlink,
}: Props) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneNumber, setPhoneNumber] = useState(
    currentVerification.phoneNumber || "+1 555 839 2011"
  );
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<SendCodeResult | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      setCode("");
      setStep("phone");
      if (currentVerification.phoneNumber) {
        setPhoneNumber(currentVerification.phoneNumber);
      }
    }
  }, [isOpen, currentVerification]);

  if (!isOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await sendPhoneVerification(phoneNumber, "recaptcha-container");
      if (result.success) {
        setSendResult(result);
        setStep("code");
        playSpray();
        if (result.simulatedCode) {
          // Pre-fill or make easy for preview test
          setCode(result.simulatedCode);
        }
      } else {
        setError(result.error || "Failed to send SMS code. Please verify the phone number format.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while sending code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the 6-digit confirmation code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await confirmPhoneVerificationCode(
        code,
        phoneNumber,
        sendResult?.confirmationResult,
        sendResult?.simulatedCode
      );

      if (response.success && response.verification) {
        playMatch();
        setSuccessMessage("Artist verified! Your profile and cards are now authenticated.");
        onVerificationSuccess(response.verification);
        setTimeout(() => {
          onClose();
        }, 1400);
      } else {
        setError(response.error || "Invalid verification code entered.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify phone code.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkNumber = () => {
    removeArtistVerification();
    playStamp();
    onUnlink();
    onClose();
  };

  const maskPhone = (num: string) => {
    if (num.length < 7) return num;
    const end = num.slice(-4);
    return `${num.slice(0, 4)} ••• ••${end}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      id="modal-phone-verification"
      className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0b0b0f] border border-[#1f2230] rounded-2xl p-5 sm:p-6 shadow-2xl text-[#e6f7ff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-verification-modal"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-[#0f1220] border border-[#334155] text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,247,255,0.3)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-graffiti text-xl text-white tracking-wide flex items-center gap-2">
              Verified Artist Badge
            </h2>
            <p className="text-[11px] text-neutral-400">
              Firebase Phone Authentication
            </p>
          </div>
        </div>

        {/* Content Container */}
        {currentVerification.isVerified ? (
          /* ALREADY VERIFIED STATE */
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-xl bg-[#11131f] border border-cyan-500/40 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex justify-center mb-2">
                <VerifiedArtistBadge size="lg" showLabel customLabel="Verified Artist" />
              </div>

              <p className="text-xs text-neutral-300 mb-1">
                Your profile is officially verified via Firebase Phone Authentication.
              </p>
              <div className="font-mono text-cyan-300 font-bold text-sm">
                {maskPhone(currentVerification.phoneNumber || "+1 555 •••")}
              </div>
              {currentVerification.verifiedAt && (
                <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                  Verified: {new Date(currentVerification.verifiedAt).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Glowing 'Verified Artist' badge displays on your cards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Verified badge shown next to your handle on feed posts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Enhanced reputation on the community wall</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                id="btn-unlink-phone"
                type="button"
                onClick={handleUnlinkNumber}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500/60 text-xs font-semibold text-neutral-300 hover:text-red-400 transition cursor-pointer"
              >
                Unlink Phone Number
              </button>
              <button
                id="btn-done-verified"
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-graffiti text-xs tracking-wider font-bold transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        ) : (
          /* NOT YET VERIFIED FLOW */
          <div className="mt-3 space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed">
              Verify your phone number with Firebase to unlock the official{" "}
              <span className="text-cyan-300 font-semibold">Verified Artist</span> checkmark across all your cards and community feed interactions.
            </p>

            {error && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/60 text-cyan-300 text-xs animate-pulse">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {step === "phone" ? (
              <form onSubmit={handleSendCode} className="space-y-3">
                <div>
                  <label
                    htmlFor="input-phone-number"
                    className="block text-xs font-semibold text-neutral-300 mb-1"
                  >
                    Mobile Phone Number (E.164 Format)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="input-phone-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 555 123 4567 or +61 412 345 678"
                      className="w-full bg-[#11131f] border border-[#334155] focus:border-cyan-400 rounded-xl py-2.5 pl-9 pr-3 text-xs font-mono text-white placeholder-neutral-500 outline-none transition"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    An SMS confirmation code will be sent via Firebase Authentication.
                  </p>
                </div>

                {/* Recaptcha container for Firebase Auth */}
                <div id="recaptcha-container" className="my-1" />

                <button
                  id="btn-send-verification-code"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-graffiti text-xs tracking-wider font-extrabold flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Sending SMS Code…</span>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-3">
                <div className="p-2.5 rounded-xl bg-[#11131f] border border-[#334155] text-xs">
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span>Sent code to:</span>
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      className="text-cyan-400 hover:underline text-[11px] cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>
                  <div className="font-mono text-cyan-300 font-bold">{phoneNumber}</div>

                  {sendResult?.simulatedCode && (
                    <div className="mt-2 pt-2 border-t border-neutral-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>
                        Sandbox preview code:{" "}
                        <strong className="font-mono bg-black/60 px-1.5 py-0.5 rounded text-white">
                          {sendResult.simulatedCode}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="input-verification-code"
                    className="block text-xs font-semibold text-neutral-300 mb-1"
                  >
                    Enter 6-Digit SMS Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="input-verification-code"
                      type="text"
                      maxLength={8}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. 482910"
                      className="w-full bg-[#11131f] border border-[#334155] focus:border-cyan-400 rounded-xl py-2.5 pl-9 pr-3 text-sm font-mono tracking-widest text-center text-cyan-300 placeholder-neutral-600 outline-none transition"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    id="btn-resend-code"
                    type="button"
                    onClick={() => handleSendCode()}
                    disabled={loading}
                    className="py-2.5 px-3 rounded-xl bg-neutral-900 border border-[#334155] hover:border-neutral-500 text-xs font-semibold text-neutral-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend</span>
                  </button>

                  <button
                    id="btn-confirm-code"
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-graffiti text-xs tracking-wider font-extrabold flex items-center justify-center gap-1.5 shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Verifying Code…</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Claim Badge</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <Lock className="w-3 h-3 text-neutral-500" />
              <span>Secured by Firebase Phone Authentication</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
