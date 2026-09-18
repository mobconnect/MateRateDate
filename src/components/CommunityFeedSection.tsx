import React, { useState } from "react";
import {
  Globe,
  MessageCircle,
  Flame,
  Send,
  ExternalLink,
  Instagram,
  Music,
  Share2,
  Smile,
  Check,
  Copy,
  Plus,
  Radio,
} from "lucide-react";
import { CommunityMatePost, ConnectedSocial } from "../types";
import { ContentFeed } from "../firebase/firestore/ContentFeed";

interface Props {
  posts: CommunityMatePost[];
  userSocial: ConnectedSocial;
  onReact: (postId: string, reactionType: "cheers" | "fire" | "sayHi") => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenSocialModal: () => void;
}

export const CommunityFeedSection: React.FC<Props> = ({
  posts,
  userSocial,
  onReact,
  onAddComment,
  onOpenSocialModal,
}) => {
  const [feedMode, setFeedMode] = useState<"mates" | "cultural">("mates");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHandle = (handle: string, id: string) => {
    navigator.clipboard.writeText(handle);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case "instagram": return <Instagram className="w-3.5 h-3.5" />;
      case "tiktok": return <Music className="w-3.5 h-3.5" />;
      case "snapchat": return <MessageCircle className="w-3.5 h-3.5" />;
      case "whatsapp": return <MessageCircle className="w-3.5 h-3.5" />;
      default: return <Share2 className="w-3.5 h-3.5" />;
    }
  };

  const submitComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Segmented Mode Switcher (Native App Style) */}
      <div className="flex p-1 bg-neutral-900 border border-neutral-800 rounded-2xl mb-5 shadow-inner">
        <button
          type="button"
          onClick={() => setFeedMode("mates")}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
            feedMode === "mates"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Mate Community Feed</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            {posts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFeedMode("cultural")}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
            feedMode === "cultural"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Cultural Pathway</span>
        </button>
      </div>

      {feedMode === "mates" ? (
        <div className="space-y-4">
          {/* Top Info Banner with User's Connected Social Pill */}
          <div className="p-3.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl flex items-center justify-between gap-3 shadow-md">
            <div className="min-w-0">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                Live Mate Interactions
              </span>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                Mates shared to community with linked socials for crew linkups.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenSocialModal}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 shrink-0 border border-neutral-700 transition cursor-pointer"
            >
              {getPlatformIcon(userSocial.platform)}
              <span className="hidden sm:inline">My Social:</span>
              <span className="font-mono text-cyan-400 font-semibold">@{userSocial.handle}</span>
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl">
              <p className="font-graffiti text-2xl text-white mb-2">NO MATES SHARED YET</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                Swipe right on photos to Mate, link your socials, and choose to share to the community feed to appear here for crew interactions!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-neutral-900 border border-neutral-800/90 rounded-3xl shadow-xl transition hover:border-cyan-500/40"
              >
                {/* Header: User who mated & target */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/50 shrink-0">
                      <img
                        src={post.mateCard.imageUrl}
                        alt={post.mateCard.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white truncate">
                          @{post.voterSocial.handle}
                        </span>
                        <span className="text-[11px] text-cyan-400 font-semibold">
                          linked with
                        </span>
                        <span className="text-xs font-bold text-white truncate">
                          {post.mateCard.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500">{post.timestamp} • {post.mateCard.location}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-graffiti text-xs shrink-0">
                    MATED ⚡
                  </span>
                </div>

                {/* Message */}
                {post.message && (
                  <p className="text-xs text-neutral-200 bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800/80 mb-3">
                    &ldquo;{post.message}&rdquo;
                  </p>
                )}

                {/* Linked Socials Bar */}
                <div className="flex items-center justify-between gap-2 p-2.5 bg-neutral-950/90 border border-neutral-800 rounded-2xl mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] uppercase font-semibold text-neutral-400 shrink-0">
                      Link Social:
                    </span>
                    <span className="text-xs font-mono font-semibold text-white truncate flex items-center gap-1">
                      {getPlatformIcon(post.mateCard.socials[0]?.platform || "instagram")}
                      @{post.mateCard.socials[0]?.handle || post.voterSocial.handle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyHandle(
                          post.mateCard.socials[0]?.handle || post.voterSocial.handle,
                          post.id
                        )
                      }
                      className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-medium text-neutral-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedId === post.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === post.id ? "Copied" : "Copy"}</span>
                    </button>

                    {post.mateCard.socials[0]?.url && (
                      <a
                        href={post.mateCard.socials[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Connect</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Interaction Reactions Buttons */}
                <div className="flex items-center gap-2 border-t border-neutral-800/80 pt-3 mb-3">
                  <button
                    type="button"
                    onClick={() => onReact(post.id, "sayHi")}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs text-neutral-300 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <Smile className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Say Hi</span>
                    <span className="font-mono text-[11px] text-cyan-300">
                      {post.reactions.sayHi}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReact(post.id, "fire")}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs text-neutral-300 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Drip</span>
                    <span className="font-mono text-[11px] text-amber-300">
                      {post.reactions.fire}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onReact(post.id, "cheers")}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-neutral-800/70 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs text-neutral-300 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                  >
                    <span>🍻</span>
                    <span>Cheers</span>
                    <span className="font-mono text-[11px] text-cyan-300">
                      {post.reactions.cheers}
                    </span>
                  </button>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-1.5 mb-3 bg-neutral-950/60 p-2.5 rounded-2xl border border-neutral-800/60">
                    {post.comments.map((c) => (
                      <div key={c.id} className="text-xs text-neutral-300 flex items-start gap-1.5">
                        <span className="font-bold text-cyan-400 truncate">
                          @{c.authorHandle}:
                        </span>
                        <span className="flex-1 text-neutral-300 break-words">{c.text}</span>
                        <span className="text-[10px] text-neutral-500 shrink-0">{c.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Add Comment Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitComment(post.id);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder={`Comment as @${userSocial.handle}...`}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black transition cursor-pointer shrink-0"
                    aria-label="Send comment"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Cultural Pathway Mode */
        <div className="p-5 sm:p-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-xl">
          <h2 className="font-graffiti text-2xl sm:text-3xl text-white mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" /> Cultural Pathway & Content
          </h2>
          <p className="text-xs text-neutral-400 mb-6">
            Protected query integration supporting cultural permissions and verified approved content.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                Public Pathway
              </h3>
              <ContentFeed mode="public" />
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-400 mb-2">
                Community Authorized Pathway
              </h3>
              <ContentFeed mode="community" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
