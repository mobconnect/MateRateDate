import {
  collection,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";

const CONTENT_LIMIT = 50;

/**
 * Auth-safe query for public feed derived from opted-in Mate connections
 */
export function getPublicContentQuery() {
  return query(
    collection(db, "feedPosts"),
    orderBy("createdAt", "desc"),
    limit(CONTENT_LIMIT)
  );
}

/**
 * Auth-safe query for user's Mate connections or active feed pathway
 */
export function getCommunityContentQuery(userId?: string) {
  if (userId) {
    return query(
      collection(db, "mateConnections"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(CONTENT_LIMIT)
    );
  }
  return query(
    collection(db, "feedPosts"),
    orderBy("createdAt", "desc"),
    limit(CONTENT_LIMIT)
  );
}
