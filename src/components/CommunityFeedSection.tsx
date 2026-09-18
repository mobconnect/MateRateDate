import React from "react";
import { useCollection } from "../firebase/firestore/use-collection";
import { orderBy } from "firebase/firestore";
import type { FeedPost, CommunityMatePost, ConnectedSocial } from "../types";
import { reactToPost } from "../firebase/firestore/content";

interface Props {
  posts?: CommunityMatePost[];
  userSocial?: ConnectedSocial;
  onReact?: (postId: string, reactionType: "cheers" | "fire" | "sayHi") => void;
  onAddComment?: (postId: string, text: string) => void;
  onOpenSocialModal?: () => void;
}

export function CommunityFeedSection(_props?: Props) {
  const { data: posts, loading } = useCollection<FeedPost>("feedPosts", [orderBy("createdAt", "desc")]);

  return (
    <section style={{ padding: 10, maxWidth: 640, margin: "0 auto" }}>
      <h2
        style={{
          margin: "0 0 12px",
          fontSize: 18,
          fontWeight: 900,
          background: "linear-gradient(90deg, #ff00e6, #ffe600)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Mate Community Feed
      </h2>

      {loading && <div style={{ color: "var(--mrd-muted)", padding: "10px 0" }}>Loading feed…</div>}

      {!loading && posts.length === 0 && (
        <div
          style={{
            background: "var(--mrd-surface)",
            border: "1px solid #1f2230",
            borderRadius: 14,
            padding: 24,
            textAlign: "center",
            color: "var(--mrd-muted)",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e6f7ff", marginBottom: 6 }}>
            No Mate Posts on the Wall Yet
          </div>
          <div style={{ fontSize: 13 }}>
            Swipe on photos in Wall Deck, tap MATE to connect your socials, and choose "Show on Community Feed" to spray your shoutout here!
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {posts.map((p) => (
          <article
            key={p.id}
            style={{
              background: "var(--mrd-surface)",
              border: "1px solid #1f2230",
              borderRadius: 14,
              padding: 12,
              display: "grid",
              gridTemplateColumns: "64px 1fr",
              gap: 10,
            }}
          >
            <img
              src={p.targetPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"}
              alt={p.targetName || "Target"}
              referrerPolicy="no-referrer"
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10 }}
            />
            <div>
              <div style={{ fontWeight: 800, letterSpacing: 0.4 }}>
                {p.userHandle} ↝ {p.targetName}
              </div>
              {p.shoutout && (
                <div style={{ color: "var(--mrd-muted)", fontSize: 13, marginTop: 4 }}>{p.shoutout}</div>
              )}
              <ReactionsBar post={p} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReactionsBar({ post }: { post: FeedPost }) {
  const btnBase: React.CSSProperties = {
    border: "1px solid #334155",
    background: "#0f1220",
    color: "#e6f7ff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 800,
    marginRight: 6,
    cursor: "pointer",
  };

  const react = (kind: "hi" | "drip" | "cheers") => {
    reactToPost(post.id, kind).catch((err) => {
      console.warn("Could not record reaction:", err);
    });
  };

  const hiCount = post.reactions?.hi ?? 0;
  const dripCount = post.reactions?.drip ?? 0;
  const cheersCount = post.reactions?.cheers ?? 0;

  return (
    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: "4px" }}>
      <button style={btnBase} onClick={() => react("hi")}>
        Say Hi ({hiCount})
      </button>
      <button style={btnBase} onClick={() => react("drip")}>
        Drip ({dripCount})
      </button>
      <button style={btnBase} onClick={() => react("cheers")}>
        Cheers ({cheersCount})
      </button>
    </div>
  );
}
