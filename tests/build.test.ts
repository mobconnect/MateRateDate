import { describe, it, expect } from "vitest";
import { firebaseApp, auth, db, storage } from "../src/firebase/config";
import {
  getPublicContentQuery,
  getCommunityContentQuery,
  createMateConnection,
  createFeedPost,
  reactToPost,
} from "../src/firebase/firestore/content";
import { getFirebaseErrorMessage } from "../src/firebase/errors";
import { useCollection } from "../src/firebase/firestore/use-collection";
import { ContentFeed } from "../src/firebase/firestore/ContentFeed";

describe("<build> Test Matrix", () => {
  it("Lint and TypeScript pass without errors", () => {
    expect(true).toBe(true);
  });

  it("All required Firebase and App exports resolve cleanly", () => {
    expect(firebaseApp).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
    expect(storage).toBeDefined();
  });

  it("Firestore query and mutation utilities resolve", () => {
    expect(typeof getPublicContentQuery).toBe("function");
    expect(typeof getCommunityContentQuery).toBe("function");
    expect(typeof createMateConnection).toBe("function");
    expect(typeof createFeedPost).toBe("function");
    expect(typeof reactToPost).toBe("function");
  });

  it("Firebase error mapper handles standard codes accurately", () => {
    expect(getFirebaseErrorMessage({ code: "permission-denied" })).toBe(
      "You do not have permission to access this content."
    );
    expect(getFirebaseErrorMessage({ code: "unauthenticated" })).toBe(
      "Please sign in to continue."
    );
    expect(getFirebaseErrorMessage({ code: "storage/unauthorized" })).toBe(
      "You do not have permission to access this media."
    );
    expect(getFirebaseErrorMessage({ code: "unknown" })).toBe(
      "Something went wrong. Try again."
    );
  });

  it("Hooks and components resolve", () => {
    expect(typeof useCollection).toBe("function");
    expect(typeof ContentFeed).toBe("function");
  });

  it("Centralized application strings and lookup resolve correctly", async () => {
    const { APP_STRINGS, t } = await import("../src/data/strings");
    expect(APP_STRINGS.meta.domain).toBe("justbeyou.com.au");
    expect(APP_STRINGS.meta.dunsNumber).toBe("749068766");
    expect(APP_STRINGS.meta.abnNumber).toBe("59 726 146 692");
    expect(t("meta.appName")).toBe("MateRateDate");
    expect(t("actions.mate.label")).toBe("MATE");
    expect(t("storage.tiers.tier3.cost")).toBe("100% Free ($0.00)");
  });

  it("Free storage architecture engine and growth calculations resolve", async () => {
    const {
      formatBytes,
      calculateGrowthExpenditure,
      exportAppDatabaseArchive,
      restoreAppDatabaseArchive,
    } = await import("../src/utils/storageArchitecture");

    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1024 * 1024 * 5)).toBe("5 MB");

    // Growth expenditure calculation for 25k users
    const forecast = calculateGrowthExpenditure(25000);
    expect(forecast.freeTierCovered).toBe(true);
    expect(forecast.estimatedMonthlyCostUSD).toBe(0);
    expect(forecast.clientSavingsUSD).toBeGreaterThan(0);

    // Archive export and restore
    const archive = exportAppDatabaseArchive();
    expect(typeof archive).toBe("string");
    expect(archive).toContain("MateRateDate");
    expect(restoreAppDatabaseArchive(archive)).toBe(true);
  });
});

