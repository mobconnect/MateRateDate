import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  increment,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";
import type { SocialHandles, MateConnection, FeedPost } from "@/src/types";

export interface MateConnectionDoc {
  id: string;
  createdAt: number;
  userId: string;
  targetUserId: string;
  targetName: string;
  targetPhotoUrl: string;
  socialHandles: SocialHandles;
  showOnFeed: boolean;
  shoutout?: string;
}

export interface FeedPostDoc {
  id: string;
  createdAt: number;
  mateConnectionId: string;
  userHandle: string;
  targetName: string;
  targetPhotoUrl: string;
  shoutout?: string;
  reactions: {
    hi: number;
    drip: number;
    cheers: number;
  };
}

export interface PassedIdsDoc {
  userId: string;
  ids: string[];
}

const LOCAL_PASSED_IDS_KEY = "materatedate_passed_ids";

/**
 * Mirror passedIds in localStorage for offline resilience
 */
export function getLocalPassedIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_PASSED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalPassedId(id: string) {
  try {
    const current = getLocalPassedIds();
    if (!current.includes(id)) {
      const next = [...current, id];
      localStorage.setItem(LOCAL_PASSED_IDS_KEY, JSON.stringify(next));
    }
  } catch (err) {
    console.warn("Failed to write to localStorage for passedIds:", err);
  }
}

/**
 * Auth-safe query for public feed posts
 */
export function getPublicFeedQuery(postLimit = 50) {
  return query(
    collection(db, "feedPosts"),
    orderBy("createdAt", "desc"),
    limit(postLimit)
  );
}

/**
 * Auth-safe query for current user's mate connections
 */
export function getUserMateConnectionsQuery(userId: string, itemLimit = 50) {
  return query(
    collection(db, "mateConnections"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(itemLimit)
  );
}

/**
 * Saves a new Mate connection to Firestore and optionally creates a derived feed post
 */
export async function saveMateConnectionToFirestore(
  connection: MateConnectionDoc,
  userHandle: string
): Promise<{ connectionId: string; feedPostId?: string }> {
  const connectionRef = doc(db, "mateConnections", connection.id);
  await setDoc(connectionRef, connection);

  let feedPostId: string | undefined;

  // If opted in, create derived feed post
  if (connection.showOnFeed) {
    feedPostId = `feed-${connection.id}`;
    const feedPostRef = doc(db, "feedPosts", feedPostId);
    const feedPostData: FeedPostDoc = {
      id: feedPostId,
      createdAt: connection.createdAt,
      mateConnectionId: connection.id,
      userHandle: userHandle || "Anonymous Artist",
      targetName: connection.targetName,
      targetPhotoUrl: connection.targetPhotoUrl,
      shoutout: connection.shoutout || "Tagged as a real Mate on the wall! 🎨",
      reactions: {
        hi: 1,
        drip: 1,
        cheers: 1,
      },
    };
    await setDoc(feedPostRef, feedPostData);
  }

  return { connectionId: connection.id, feedPostId };
}

/**
 * Records a passed photo card ID both in localStorage and syncs with Firestore
 */
export async function recordPassedCardId(userId: string, cardId: string): Promise<void> {
  // Always update local cache first
  saveLocalPassedId(cardId);

  if (!userId) return;

  try {
    const passedRef = doc(db, "passedIds", userId);
    const snap = await getDoc(passedRef);

    if (snap.exists()) {
      const data = snap.data() as PassedIdsDoc;
      const ids = Array.isArray(data.ids) ? data.ids : [];
      if (!ids.includes(cardId)) {
        await updateDoc(passedRef, {
          ids: [...ids, cardId],
        });
      }
    } else {
      await setDoc(passedRef, {
        userId,
        ids: [cardId],
      });
    }
  } catch (err) {
    console.warn("Could not sync passed ID to Firestore, cached locally:", err);
  }
}

/**
 * Increment a reaction on a feed post
 */
export async function reactToFeedPost(
  postId: string,
  reaction: "hi" | "drip" | "cheers"
): Promise<void> {
  const postRef = doc(db, "feedPosts", postId);
  await updateDoc(postRef, {
    [`reactions.${reaction}`]: increment(1),
  });
}
