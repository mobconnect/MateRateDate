import React, { useState, useEffect } from "react";
import {
  HardDrive,
  Database,
  ShieldCheck,
  TrendingDown,
  Download,
  Upload,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  getStorageQuota,
  requestPersistentStorage,
  exportAppDatabaseArchive,
  restoreAppDatabaseArchive,
  clearMediaCache,
  calculateGrowthExpenditure,
  StorageQuotaInfo,
  GrowthForecast,
} from "../utils/storageArchitecture";
import { APP_STRINGS } from "../data/strings";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const StorageManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [quota, setQuota] = useState<StorageQuotaInfo | null>(null);
  const [isPersisting, setIsPersisting] = useState(false);
  const [persistentSuccess, setPersistentSuccess] = useState(false);
  const [activeUsersSlider, setActiveUsersSlider] = useState<number>(25000);
  const [forecast, setForecast] = useState<GrowthForecast>(() =>
    calculateGrowthExpenditure(25000)
  );
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Refresh quota when opened
  useEffect(() => {
    if (isOpen) {
      refreshQuota();
    }
  }, [isOpen]);

  // Update expenditure forecast when slider changes
  useEffect(() => {
    setForecast(calculateGrowthExpenditure(activeUsersSlider));
  }, [activeUsersSlider]);

  const refreshQuota = async () => {
    try {
      const q = await getStorageQuota();
      setQuota(q);
    } catch (e) {
      console.warn("Failed to get quota:", e);
    }
  };

  const handleEnablePersistence = async () => {
    setIsPersisting(true);
    const granted = await requestPersistentStorage();
    setIsPersisting(false);
    if (granted) {
      setPersistentSuccess(true);
      setStatusMessage({
        type: "success",
        text: "Permanent storage protection granted by browser. Data will not be evicted under disk pressure.",
      });
      refreshQuota();
    } else {
      setStatusMessage({
        type: "info",
        text: "Browser kept standard storage lifecycle. Your data remains safely persisted in IndexedDB and LocalStorage.",
      });
    }
  };

  const handleExportArchive = () => {
    const jsonStr = exportAppDatabaseArchive();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MateRateDate_Full_Archive_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMessage({
      type: "success",
      text: "Application archive downloaded successfully.",
    });
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = restoreAppDatabaseArchive(content);
      if (success) {
        setStatusMessage({
          type: "success",
          text: "Archive restored successfully! Reloading data...",
        });
        if (onDataRestored) {
          onDataRestored();
        }
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setStatusMessage({
          type: "error",
          text: "Failed to restore archive. File appears corrupted or invalid.",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = async () => {
    if (window.confirm("Clear offline media cache from IndexedDB? Your saved cards and profile remain intact.")) {
      await clearMediaCache();
      refreshQuota();
      setStatusMessage({
        type: "success",
        text: "Local media cache cleared.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="storage-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 id="storage-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {APP_STRINGS.storage.title}
              </h2>
              <p className="text-xs text-neutral-400">
                {APP_STRINGS.storage.subtitle}
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

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                statusMessage.type === "success"
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                  : statusMessage.type === "error"
                  ? "bg-rose-950/40 border-rose-500/50 text-rose-300"
                  : "bg-cyan-950/40 border-cyan-500/50 text-cyan-300"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="text-xs leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {/* Section 1: Device Quota & Persistence */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span>{APP_STRINGS.storage.quota.heading}</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {quota ? `${quota.usageFormatted} / ${quota.quotaFormatted}` : "Measuring..."}
              </span>
            </div>

            {/* Quota Bar */}
            <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${Math.max(1, quota?.percentageUsed || 0)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Used: {quota?.usageFormatted || "0 MB"}</span>
              <span>Available Capacity: {quota?.quotaFormatted || "10+ GB (Free)"}</span>
            </div>

            {/* Persistence state & Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-neutral-850">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck
                  className={`w-4 h-4 ${
                    quota?.isPersistent || persistentSuccess
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                />
                <span className="text-neutral-300">
                  {quota?.isPersistent || persistentSuccess
                    ? APP_STRINGS.storage.quota.persistentGranted
                    : APP_STRINGS.storage.quota.persistentNotGranted}
                </span>
              </div>
              {!(quota?.isPersistent || persistentSuccess) && (
                <button
                  type="button"
                  onClick={handleEnablePersistence}
                  disabled={isPersisting}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition cursor-pointer"
                >
                  {isPersisting ? "Requesting..." : "Enable Permanent Storage"}
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Multi-Tier Zero-Cost Storage Pipeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              <span>{APP_STRINGS.storage.architectureHeading}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(APP_STRINGS.storage.tiers).map(([key, tier]) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800 hover:border-neutral-700 transition"
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-semibold text-xs text-white">{tier.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                      {tier.cost}
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono mb-1">{tier.capacity}</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Interactive Growth & Expenditure Scaling Forecast */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">
                  {APP_STRINGS.storage.expenditure.calculatorHeading}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-medium">
                {forecast.freeTierCovered ? "100% Free Tier ($0.00)" : `$${forecast.estimatedMonthlyCostUSD}/mo`}
              </span>
            </div>

            <p className="text-xs text-neutral-400">
              {APP_STRINGS.storage.expenditure.intro}
            </p>

            {/* Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Simulate Monthly Active Users:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {activeUsersSlider.toLocaleString()} Users
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={500000}
                step={1000}
                value={activeUsersSlider}
                onChange={(e) => setActiveUsersSlider(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>1,000 (Free)</span>
                <span>50,000 (Free Spark Cap)</span>
                <span>250,000</span>
                <span>500,000+</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-850 text-center">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Offloaded Free</span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {forecast.localOffloadGB} GB
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Est. Cloud Bill</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {forecast.freeTierCovered ? "$0.00 / mo" : `$${forecast.estimatedMonthlyCostUSD} / mo`}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Monthly Savings</span>
                <span className="text-xs font-mono font-bold text-pink-400">
                  +${forecast.clientSavingsUSD}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Backup, Export & Clear Cache Operations */}
          <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportArchive}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-medium transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Full Archive</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-medium transition cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restore Archive</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleClearCache}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-300 border border-neutral-800 hover:border-rose-900 text-xs transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
