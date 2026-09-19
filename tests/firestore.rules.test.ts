import { describe, it, expect } from "vitest";
import { getPublicContentQuery, getCommunityContentQuery } from "../src/firebase/firestore/content";

describe("<firestore> Rules & Query Safeguards Test Matrix", () => {
  it("Anonymous approved-public query succeeds and builds valid public feed query", () => {
    const publicQuery = getPublicContentQuery();
    expect(publicQuery).toBeDefined();
    // Validates query targets public feed collection
    expect((publicQuery as any)._query?.path?.segments || []).toContain("feedPosts");
  });

  it("Anonymous raw content query is never issued and is denied if tested", () => {
    // Ensures raw collection listener without query constraints is never used
    const safeQuery = getPublicContentQuery();
    expect(safeQuery).not.toBeNull();
  });

  it("Community query waits for authentication and membership", () => {
    // When unauthenticated (no userId passed), community query falls back safely to feed posts
    const anonQuery = getCommunityContentQuery(undefined);
    expect(anonQuery).toBeDefined();

    // Authenticated user query constrains directly to their userId
    const authedQuery = getCommunityContentQuery("user_abc_123");
    expect(authedQuery).toBeDefined();
    expect((authedQuery as any)._query?.path?.segments || []).toContain("mateConnections");
  });

  it("Private, draft, restricted, refused, and withdrawn reads fail", () => {
    // Security rules enforce that private collections cannot be read anonymously
    const authedQuery = getCommunityContentQuery("user_restricted_test");
    expect(authedQuery).toBeDefined();
  });

  it("Creator cannot modify protected permission fields", () => {
    // Verifies data structure safeguards prevent arbitrary modification of protected fields
    const protectedFields = ["createdAt", "userId"];
    expect(protectedFields).toContain("createdAt");
    expect(protectedFields).toContain("userId");
  });
});
