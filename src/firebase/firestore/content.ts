import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  increment,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";
import type { SocialHandles, FeedPost } from "@/src/types";

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

/**
 * Creates a Mate connection in Firestore
 */
export async function createMateConnection(data: {
  userId: string;
  targetUserId: string;
  targetName: string;
  targetPhotoUrl: string;
  socialHandles: SocialHandles;
  showOnFeed: boolean;
  shoutout?: string;
}): Promise<string> {
  const id = `mate-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const connectionRef = doc(db, "mateConnections", id);
  const payload = {
    id,
    createdAt: Date.now(),
    userId: data.userId,
    targetUserId: data.targetUserId,
    targetName: data.targetName,
    targetPhotoUrl: data.targetPhotoUrl,
    socialHandles: data.socialHandles || {},
    showOnFeed: data.showOnFeed,
    ...(data.shoutout ? { shoutout: data.shoutout } : {}),
  };

  await setDoc(connectionRef, payload);
  return id;
}

/**
 * Creates a public feed post derived from an opted-in Mate connection
 */
export async function createFeedPost(data: {
  mateConnectionId: string;
  userHandle: string;
  targetName: string;
  targetPhotoUrl: string;
  shoutout?: string;
  reactions: { hi: number; drip: number; cheers: number };
  isUserVerified?: boolean;
  isTargetVerified?: boolean;
}): Promise<string> {
  const id = `feed-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const feedRef = doc(db, "feedPosts", id);
  const payload: FeedPost = {
    id,
    createdAt: Date.now(),
    mateConnectionId: data.mateConnectionId,
    userHandle: data.userHandle || "Graffiti Mate",
    targetName: data.targetName,
    targetPhotoUrl: data.targetPhotoUrl,
    ...(data.shoutout ? { shoutout: data.shoutout } : {}),
    reactions: data.reactions || { hi: 0, drip: 0, cheers: 0 },
    ...(data.isUserVerified !== undefined ? { isUserVerified: data.isUserVerified } : {}),
    ...(data.isTargetVerified !== undefined ? { isTargetVerified: data.isTargetVerified } : {}),
  };

  await setDoc(feedRef, payload);
  return id;
}

/**
 * Increments reaction counts on a feed post
 */
export async function reactToPost(
  postId: string,
  kind: "hi" | "drip" | "cheers"
): Promise<void> {
  const postRef = doc(db, "feedPosts", postId);
  await updateDoc(postRef, {
    [`reactions.${kind}`]: increment(1),
  });
}
