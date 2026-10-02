import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Compass,
  AlertTriangle,
  X,
  CheckCircle2,
  Navigation,
  Sliders,
  Users,
  Lock,
} from "lucide-react";
import { UserSafetyProfile } from "../types";
import {
  MIN_ALLOWED_AGE,
  ADULT_MIN_AGE,
  getAgeCohort,
  isAgeAllowed,
  POPULAR_LOCATIONS,
  PopularLocation,
} from "../utils/safetyAlgorithm";
import { APP_STRINGS } from "../data/strings";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  safetyProfile: UserSafetyProfile;
  onSaveProfile: (profile: UserSafetyProfile) => void;
  isInitialLockout?: boolean;
}

export const AgeSafetyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  safetyProfile,
  onSaveProfile,
  isInitialLockout = false,
}) => {
  const [ageInput, setAgeInput] = useState<number>(safetyProfile.age || 20);
  const [filterAreaOnly, setFilterAreaOnly] = useState<boolean>(safetyProfile.filterAreaOnly);
  const [selectedLocation, setSelectedLocation] = useState<PopularLocation>(() => {
    const found = POPULAR_LOCATIONS.find(
      (l) => l.city === safetyProfile.location.city && l.suburb === safetyProfile.location.suburb
    );
    return found || POPULAR_LOCATIONS[0];
  });
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(safetyProfile.maxDistanceKm || 50);
  const [minAgePref, setMinAgePref] = useState<number>(safetyProfile.minAgePreference || 18);
  const [maxAgePref, setMaxAgePref] = useState<number>(safetyProfile.maxAgePreference || 30);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isUnderage = ageInput < MIN_ALLOWED_AGE;
  const cohort = getAgeCohort(ageInput);

  const handleDetectLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoMessage("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDetectingLocation(false);
        const { latitude, longitude } = position.coords;
        // Find closest Australian city preset or use actual lat/lng
        let closest = POPULAR_LOCATIONS[0];
        let minD = Infinity;

        POPULAR_LOCATIONS.forEach((loc) => {
          const d = Math.hypot(loc.lat - latitude, loc.lng - longitude);
          if (d < minD) {
            minD = d;
            closest = loc;
          }
        });

        setSelectedLocation({
          city: closest.city,
          suburb: closest.suburb,
          state: closest.state,
          lat: latitude,
          lng: longitude,
        });
        setFilterAreaOnly(true);
        setGeoMessage(`Location set to your detected area near ${closest.city} (${closest.suburb})`);
      },
      (error) => {
        setDetectingLocation(false);
        setGeoMessage("Location permission was not granted. Please pick your city below.");
      },
      { timeout: 8000 }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnderage) {
      return; // Underage lockout
    }

    const updated: UserSafetyProfile = {
      age: ageInput,
      isAgeVerified: true,
      cohort: getAgeCohort(ageInput),
      location: {
        city: selectedLocation.city,
        suburb: selectedLocation.suburb,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      },
      maxDistanceKm,
      filterAreaOnly,
      minAgePreference: cohort === "youth" ? 16 : Math.max(18, minAgePref),
      maxAgePreference: cohort === "youth" ? 17 : Math.max(18, maxAgePref),
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-safety-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              isUnderage
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : cohort === "youth"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="age-safety-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Age Safety & Area Discovery
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-cyan-300 border border-neutral-700">
                  16+ Only
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Youth cohort protection algorithms & local street art discovery
              </p>
            </div>
          </div>
          {!isInitialLockout && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Section 1: Mandatory Age Input & Protection Cohort */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="user-age-input" className="font-semibold text-white text-xs sm:text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Your Age (Minimum 16 Years Old)</span>
              </label>
              <span className={`font-mono text-sm font-bold px-2.5 py-0.5 rounded-lg border ${
                isUnderage
                  ? "bg-rose-950/60 border-rose-600 text-rose-300"
                  : cohort === "youth"
                  ? "bg-amber-950/60 border-amber-500 text-amber-300"
                  : "bg-cyan-950/60 border-cyan-500 text-cyan-300"
              }`}>
                {ageInput} Years Old
              </span>
            </div>

            <input
              id="user-age-input"
              type="range"
              min={14}
              max={65}
              value={ageInput}
              onChange={(e) => setAgeInput(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span className="text-rose-400">14-15 (Underage Block)</span>
              <span className="text-amber-400 font-semibold">16-17 (Youth Cohort)</span>
              <span className="text-cyan-400">18-25</span>
              <span>35+</span>
            </div>

            {/* Dynamic Cohort Safety Notification */}
            {isUnderage ? (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-600/60 text-rose-200 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs">Access Prohibited: Minimum Age is 16</div>
                  <p className="text-[11px] leading-relaxed text-rose-300">
                    MateRateDate is strictly restricted to people aged 16 and above to protect young individuals under Australian youth online safety guidelines.
                  </p>
                </div>
              </div>
            ) : cohort === "youth" ? (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <span>Youth Protection Algorithm Active</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[10px] font-mono">Ages 16–17 Only</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-300/90 mt-1">
                    To keep you safe, our algorithm strictly isolates your discovery pool. You will <strong>only</strong> see and interact with 16–17 year old peers. <strong>Adults aged 18+ can never view, match with, or contact your profile.</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-cyan-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs">Adult Cohort Active (Ages 18+)</div>
                  <p className="text-[11px] leading-relaxed text-cyan-300/90 mt-1">
                    You are in the verified adult discovery stream. You will only discover and interact with individuals aged 18 and above. Minors are strictly excluded from adult feeds.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Adult Optional Age Range Preferences */}
          {cohort === "adult" && !isUnderage && (
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-pink-400" />
                  <span>Discovery Age Preference Range</span>
                </div>
                <span className="font-mono text-xs text-pink-300">
                  {minAgePref} - {maxAgePref} Years Old
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                    Minimum Age (18+)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={maxAgePref}
                    value={minAgePref}
                    onChange={(e) => setMinAgePref(Math.max(18, Number(e.target.value)))}
                    className="w-full bg-neutral-900 border border-neutral-750 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                    Maximum Age
                  </label>
                  <input
                    type="number"
                    min={minAgePref}
                    max={65}
                    value={maxAgePref}
                    onChange={(e) => setMaxAgePref(Math.min(65, Number(e.target.value)))}
                    className="w-full bg-neutral-900 border border-neutral-750 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Geographic Area & Nearby Discovery */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-white text-xs sm:text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Find People in Your Area</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterAreaOnly}
                  onChange={(e) => setFilterAreaOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <p className="text-xs text-neutral-400">
              Discover street art creators, crew mates, and ratings in your suburb or city. Coordinates are fuzzed for privacy under Australian Privacy Principles.
            </p>

            {/* Geolocation Button */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/40 text-emerald-300 text-xs font-medium transition cursor-pointer"
              >
                <Navigation className={`w-3.5 h-3.5 ${detectingLocation ? "animate-spin" : ""}`} />
                <span>{detectingLocation ? "Detecting Area..." : "Detect My Area GPS"}</span>
              </button>

              <span className="text-xs text-neutral-400">or pick suburb below</span>
            </div>

            {geoMessage && (
              <div className="text-[11px] text-emerald-400 font-mono bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40">
                {geoMessage}
              </div>
            )}

            {/* City & Suburb Dropdown */}
            <div>
              <label htmlFor="area-select" className="text-[11px] font-medium text-neutral-400 block mb-1">
                Your Primary City & Creative Suburb
              </label>
              <select
                id="area-select"
                value={`${selectedLocation.city}-${selectedLocation.suburb}`}
                onChange={(e) => {
                  const [city, suburb] = e.target.value.split("-");
                  const loc = POPULAR_LOCATIONS.find((l) => l.city === city && l.suburb === suburb);
                  if (loc) setSelectedLocation(loc);
                }}
                className="w-full bg-neutral-900 border border-neutral-750 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                {POPULAR_LOCATIONS.map((loc) => (
                  <option key={`${loc.city}-${loc.suburb}`} value={`${loc.city}-${loc.suburb}`}>
                    {loc.city} • {loc.suburb} ({loc.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Radius Slider */}
            {filterAreaOnly && (
              <div className="space-y-2 pt-2 border-t border-neutral-850">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300">Maximum Area Radius:</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {maxDistanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={150}
                  step={5}
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                  <span>5 km (Local Suburb)</span>
                  <span>25 km (Metro)</span>
                  <span>50 km (Greater Area)</span>
                  <span>150 km</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Strict Youth Isolation & Privacy Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={isUnderage}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs transition cursor-pointer shadow-md ${
                isUnderage
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold"
              }`}
            >
              {isUnderage ? "Must Be 16+ to Enter" : "Save & Update Discovery"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
