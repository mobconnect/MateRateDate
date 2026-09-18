import { useMemo } from "react";
import {
  getCommunityContentQuery,
  getPublicContentQuery,
} from "@/src/firebase/firestore/content";
import { useFirebaseAuth } from "@/src/firebase/provider";
import { useCollection } from "@/src/firebase/firestore/use-collection";

type Props = {
  mode: "public" | "community";
};

export function ContentFeed({ mode }: Props) {
  const {
    currentUser,
    isAuthReady,
    communityMembershipReady,
    isCommunityAuthorised,
  } = useFirebaseAuth();

  const target = useMemo(() => {
    if (mode === "public") {
      return getPublicContentQuery();
    }

    if (
      !isAuthReady ||
      !currentUser ||
      !communityMembershipReady ||
      !isCommunityAuthorised
    ) {
      return null;
    }

    return getCommunityContentQuery(currentUser?.uid);
  }, [
    mode,
    isAuthReady,
    currentUser,
    communityMembershipReady,
    isCommunityAuthorised,
  ]);

  const result = useCollection(target);

  if (!target) {
    return (
      <p role="status" className="text-neutral-400 text-sm py-4">
        {mode === "community"
          ? "Sign in and obtain community access to view this pathway."
          : "Loading content…"}
      </p>
    );
  }

  if (result.status === "loading") {
    return <p role="status" className="text-neutral-400 text-sm py-4 animate-pulse">Loading content…</p>;
  }

  if (result.status === "error") {
    return (
      <section role="alert" className="p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-red-200">
        <h2 className="font-semibold text-base mb-1">Content could not be loaded</h2>
        <p className="text-sm text-neutral-400 mb-3">Try again, or return later.</p>
        <button
          type="button"
          onClick={result.retry}
          className="px-4 py-2 bg-red-800/60 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
        >
          Try again
        </button>
      </section>
    );
  }

  if (result.data.length === 0) {
    return <p className="text-neutral-400 text-sm py-4">No approved content is available yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {result.data.map((item: any) => (
        <li
          key={item.id}
          className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-200 flex items-center gap-3"
        >
          {item.targetPhotoUrl && (
            <img
              src={item.targetPhotoUrl}
              alt={item.targetName || "Target"}
              className="w-10 h-10 rounded-full object-cover border border-neutral-700 shrink-0"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">
              {item.targetName || item.userHandle || item.title || "Mate Connection"}
            </div>
            {item.shoutout && (
              <div className="text-xs text-neutral-400 truncate">
                "{item.shoutout}"
              </div>
            )}
          </div>
          {item.reactions && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
              <span>👋 {item.reactions.hi || 0}</span>
              <span>💧 {item.reactions.drip || 0}</span>
              <span>🍻 {item.reactions.cheers || 0}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
