/**
 * Free Storage Architecture & Growth Engine for MateRateDate
 * Provides unlimited client-side multi-tier storage (RAM -> LocalStorage -> IndexedDB -> Cloud Spark)
 * with zero-cost persistence and growth forecasting.
 */

const DB_NAME = "MateRateDateDB";
const DB_VERSION = 1;
const STORE_MEDIA = "mediaStore";
const STORE_CONTENT = "contentStore";
const STORE_BACKUPS = "backupsStore";

export interface StorageQuotaInfo {
  usageBytes: number;
  quotaBytes: number;
  percentageUsed: number;
  usageFormatted: string;
  quotaFormatted: string;
  isPersistent: boolean;
}

export interface GrowthForecast {
  activeUsers: number;
  localOffloadGB: number;
  cloudStorageGB: number;
  cloudTransferGB: number;
  freeTierCovered: boolean;
  estimatedMonthlyCostUSD: number;
  clientSavingsUSD: number;
}

/**
 * Formats bytes to human readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Initializes and opens the IndexedDB database instance
 */
function openAppDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this environment."));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_CONTENT)) {
        db.createObjectStore(STORE_CONTENT, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_BACKUPS)) {
        db.createObjectStore(STORE_BACKUPS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieves storage quota and persistence state from navigator.storage
 */
export async function getStorageQuota(): Promise<StorageQuotaInfo> {
  let usageBytes = 0;
  let quotaBytes = 10 * 1024 * 1024 * 1024; // Default estimate 10GB
  let isPersistent = false;

  if (typeof navigator !== "undefined" && navigator.storage) {
    if (navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        usageBytes = estimate.usage || 0;
        quotaBytes = estimate.quota || quotaBytes;
      } catch (e) {
        console.warn("Storage estimate not available:", e);
      }
    }
    if (navigator.storage.persisted) {
      try {
        isPersistent = await navigator.storage.persisted();
      } catch (e) {
        console.warn("Storage persisted check failed:", e);
      }
    }
  }

  const percentageUsed = quotaBytes > 0 ? (usageBytes / quotaBytes) * 100 : 0;

  return {
    usageBytes,
    quotaBytes,
    percentageUsed: Number(percentageUsed.toFixed(2)),
    usageFormatted: formatBytes(usageBytes),
    quotaFormatted: formatBytes(quotaBytes),
    isPersistent,
  };
}

/**
 * Requests permanent browser storage to prevent automatic browser cache eviction
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persist) {
    try {
      return await navigator.storage.persist();
    } catch (e) {
      console.warn("Persistent storage request failed:", e);
      return false;
    }
  }
  return false;
}

/**
 * Saves a high-capacity media item (e.g. photo, graffiti artwork, audio) to free IndexedDB
 */
export async function saveMediaItem(
  id: string,
  blobOrBase64: string | Blob,
  metadata?: Record<string, any>
): Promise<void> {
  const db = await openAppDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, "readwrite");
    const store = tx.objectStore(STORE_MEDIA);
    const item = {
      id,
      data: blobOrBase64,
      metadata: metadata || {},
      timestamp: Date.now(),
    };
    const req = store.put(item);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieves a media item from IndexedDB
 */
export async function getMediaItem(id: string): Promise<any | null> {
  const db = await openAppDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, "readonly");
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Removes a media item from IndexedDB
 */
export async function removeMediaItem(id: string): Promise<void> {
  const db = await openAppDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, "readwrite");
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Clears all cached media items in IndexedDB
 */
export async function clearMediaCache(): Promise<void> {
  const db = await openAppDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEDIA, "readwrite");
    const store = tx.objectStore(STORE_MEDIA);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

const safeGetItem = (key: string, fallback = ""): string => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return window.localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const safeSetItem = (key: string, value: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  }
};

/**
 * Exports full application state and data into a clean JSON archive
 */
export function exportAppDatabaseArchive(): string {
  const archive = {
    version: "1.0.0",
    appName: "MateRateDate",
    exportedAt: new Date().toISOString(),
    domain: "justbeyou.com.au",
    duns: "749068766",
    cards: safeGetItem("mrd_cards", "[]"),
    myCards: safeGetItem("mrd_my_cards", "[]"),
    votes: safeGetItem("mrd_votes", "[]"),
    passedIds: safeGetItem("mrd_passed_ids", "[]"),
    userSocial: safeGetItem("mrd_user_social", "{}"),
    communityPosts: safeGetItem("mrd_community_mate_posts", "[]"),
    soundSettings: safeGetItem("mrd_sound_settings", "{}"),
    privacySettings: safeGetItem("mrd_privacy_settings", "{}"),
  };

  return JSON.stringify(archive, null, 2);
}

/**
 * Restores application state from a JSON archive string
 */
export function restoreAppDatabaseArchive(jsonString: string): boolean {
  try {
    const archive = JSON.parse(jsonString);
    if (!archive.appName || !archive.version) {
      throw new Error("Invalid archive format");
    }

    if (archive.cards) safeSetItem("mrd_cards", archive.cards);
    if (archive.myCards) safeSetItem("mrd_my_cards", archive.myCards);
    if (archive.votes) safeSetItem("mrd_votes", archive.votes);
    if (archive.passedIds) safeSetItem("mrd_passed_ids", archive.passedIds);
    if (archive.userSocial) safeSetItem("mrd_user_social", archive.userSocial);
    if (archive.communityPosts) safeSetItem("mrd_community_mate_posts", archive.communityPosts);
    if (archive.soundSettings) safeSetItem("mrd_sound_settings", archive.soundSettings);
    if (archive.privacySettings) safeSetItem("mrd_privacy_settings", archive.privacySettings);

    return true;
  } catch (err) {
    console.error("Failed to restore archive:", err);
    return false;
  }
}

/**
 * Calculates expenditure forecast and savings by utilizing client-side free storage
 */
export function calculateGrowthExpenditure(activeUsers: number): GrowthForecast {
  // Average photo/content per user = ~15 MB
  const totalRawDataGB = (activeUsers * 15) / 1024;
  
  // 99% of raw heavy assets (high-res photos, canvas blobs) are stored client-side in IndexedDB (free on device)
  // Cloud sync only stores lightweight metadata and compressed avatars (~80 KB per user)
  const cloudStorageGB = Math.max(0.1, (activeUsers * 0.08) / 1024);
  const localOffloadGB = Math.max(0, totalRawDataGB - cloudStorageGB);
  
  // Estimated monthly bandwidth egress (delta sync)
  const cloudTransferGB = cloudStorageGB * 1.2;

  // Firebase Spark Free Tier provides 5GB free storage and 1GB/month transfer
  const freeTierCovered = activeUsers <= 50000 && cloudStorageGB <= 5;

  let estimatedMonthlyCostUSD = 0;
  if (!freeTierCovered) {
    const billableStorageGB = Math.max(0, cloudStorageGB - 5);
    const billableTransferGB = Math.max(0, cloudTransferGB - 1);
    
    // Cloud storage pricing: ~$0.026/GB/mo, egress: ~$0.12/GB
    estimatedMonthlyCostUSD = (billableStorageGB * 0.026) + (billableTransferGB * 0.12);
  }

  // Savings calculated compared to storing 100% in cloud
  const fullCloudCost = (totalRawDataGB * 0.026) + (totalRawDataGB * 2 * 0.12);
  const clientSavingsUSD = Math.max(0, fullCloudCost - estimatedMonthlyCostUSD);

  return {
    activeUsers,
    localOffloadGB: Number(localOffloadGB.toFixed(1)),
    cloudStorageGB: Number(cloudStorageGB.toFixed(1)),
    cloudTransferGB: Number(cloudTransferGB.toFixed(1)),
    freeTierCovered,
    estimatedMonthlyCostUSD: Number(estimatedMonthlyCostUSD.toFixed(2)),
    clientSavingsUSD: Number(clientSavingsUSD.toFixed(2)),
  };
}
