import React from "react";
import { useCollection } from "../firebase/firestore/use-collection";
import { orderBy } from "firebase/firestore";
import type { FeedPost, CommunityMatePost, ConnectedSocial } from "../types";
import { reactToPost } from "../firebase/firestore/content";
import { VerifiedArtistBadge } from "./VerifiedArtistBadge";
import { ShieldCheck, CheckCircle2, MessageSquareHeart, Droplet, Sparkles, HandMetal } from "lucide-react";

interface Props {
  posts?: CommunityMatePost[];
  userSocial?: ConnectedSocial;
  onReact?: (postId: string, reactionType: "cheers" | "fire" | "sayHi") => void;
  onAddComment?: (postId: string, text: string) => void;
  onOpenSocialModal?: () => void;
  isUserVerified?: boolean;
  onOpenVerificationModal?: () => void;
}

export function CommunityFeedSection(props?: Props) {
  const { data: posts, loading } = useCollection<FeedPost>("feedPosts", [orderBy("createdAt", "desc")]);
  const isUserVerified = props?.isUserVerified || false;
  const onOpenVerificationModal = props?.onOpenVerificationModal;

  return (
    <section id="section-community-feed" className="p-3 sm:p-4 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="font-graffiti text-2xl sm:text-3xl text-white tracking-wide">
            Street Crew Wall
          </h2>
          <p className="text-xs text-neutral-400">
            Real-time mate connections and community interactions.
          </p>
        </div>

        {isUserVerified ? (
          <button
            id="btn-feed-verified-badge"
            type="button"
            onClick={onOpenVerificationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/80 text-[11px] text-cyan-300 font-bold cursor-pointer shadow-[0_0_10px_rgba(0,247,255,0.25)] hover:scale-105 transition-transform"
            title="Verified Artist via Firebase Phone Authentication"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono uppercase tracking-wider">Verified Artist</span>
          </button>
        ) : (
          onOpenVerificationModal && (
            <button
              id="btn-feed-open-verify"
              type="button"
              onClick={onOpenVerificationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 hover:border-cyan-400 text-xs text-cyan-300 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">Verify Artist</span>
            </button>
          )
        )}
      </div>

      {loading && (
        <div className="py-8 text-center text-xs text-neutral-400 font-mono">
          Loading live street feed…
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 text-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-cyan-400 mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-graffiti text-lg text-white mb-1">
            No Mate Posts on the Wall Yet
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Swipe on photos in the Wall Deck, tap MATE to connect, and choose &ldquo;Broadcast to Community Feed&rdquo; to spray your shoutout here!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {posts.map((p) => (
          <article
            key={p.id}
            id={`feed-post-${p.id}`}
            className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition flex items-start gap-3.5"
          >
            <img
              src={
                p.targetPhotoUrl ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
              }
              alt={p.targetName || "Target"}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover border border-neutral-800 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="font-mono font-bold text-cyan-300">@{p.userHandle}</span>
                {(p.isUserVerified || isUserVerified) && (
                  <VerifiedArtistBadge
                    size="xs"
                    showLabel={false}
                    title="Verified Artist via Firebase Phone Auth"
                    onClick={onOpenVerificationModal}
                  />
                )}
                <span className="text-neutral-500 font-semibold">linked with</span>
                <span className="font-bold text-white">{p.targetName}</span>
                {p.isTargetVerified && (
                  <VerifiedArtistBadge
                    size="xs"
                    showLabel={false}
                    title="Verified Artist"
                  />
                )}
              </div>

              {p.shoutout && (
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed break-words">
                  {p.shoutout}
                </p>
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
  const react = (kind: "hi" | "drip" | "cheers") => {
    reactToPost(post.id, kind).catch((err) => {
      console.warn("Could not record reaction:", err);
    });
  };

  const hiCount = post.reactions?.hi ?? 0;
  const dripCount = post.reactions?.drip ?? 0;
  const cheersCount = post.reactions?.cheers ?? 0;

  return (
    <div className="mt-2.5 flex items-center flex-wrap gap-1.5">
      <button
        id={`btn-react-hi-${post.id}`}
        type="button"
        onClick={() => react("hi")}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 hover:border-pink-500/60 text-[11px] font-semibold text-neutral-300 hover:text-pink-300 transition cursor-pointer"
      >
        <MessageSquareHeart className="w-3 h-3 text-pink-400" />
        <span>Say Hi</span>
        <span className="text-neutral-400 font-mono">({hiCount})</span>
      </button>

      <button
        id={`btn-react-drip-${post.id}`}
        type="button"
        onClick={() => react("drip")}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 hover:border-cyan-500/60 text-[11px] font-semibold text-neutral-300 hover:text-cyan-300 transition cursor-pointer"
      >
        <Droplet className="w-3 h-3 text-cyan-400" />
        <span>Drip</span>
        <span className="text-neutral-400 font-mono">({dripCount})</span>
      </button>

      <button
        id={`btn-react-cheers-${post.id}`}
        type="button"
        onClick={() => react("cheers")}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 hover:border-amber-500/60 text-[11px] font-semibold text-neutral-300 hover:text-amber-300 transition cursor-pointer"
      >
        <HandMetal className="w-3 h-3 text-amber-400" />
        <span>Cheers</span>
        <span className="text-neutral-400 font-mono">({cheersCount})</span>
      </button>
    </div>
  );
}
