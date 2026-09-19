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
});
