import React, { useState } from "react";
import type { SocialHandles } from "../types";
import { createMateConnection, createFeedPost } from "../firebase/firestore/content";
import { playMatch } from "../utils/audio";

interface Props {
  open: boolean;
  onClose: () => void;
  target: { id: string; name: string; photoUrl: string };
  userId: string;
  userHandle: string;
}

export function MateModal({ open, onClose, target, userId, userHandle }: Props) {
  const [handles, setHandles] = useState<SocialHandles>({});
  const [showOnFeed, setShowOnFeed] = useState(true);
  const [shoutout, setShoutout] = useState("");

  if (!open) return null;

  const handleSave = async () => {
    const connId = await createMateConnection({
      userId,
      targetUserId: target.id,
      targetName: target.name,
      targetPhotoUrl: target.photoUrl,
      socialHandles: handles,
      showOnFeed,
      shoutout: shoutout || undefined,
    });

    if (showOnFeed) {
      await createFeedPost({
        mateConnectionId: connId,
        userHandle,
        targetName: target.name,
        targetPhotoUrl: target.photoUrl,
        shoutout: shoutout || undefined,
        reactions: { hi: 0, drip: 0, cheers: 0 },
      });
    }

    playMatch();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#0b0b0f",
          color: "#e6f7ff",
          borderRadius: 16,
          padding: 16,
          border: "1px solid #1f2230",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: 18,
            fontWeight: 900,
            background: "linear-gradient(90deg, #00f7ff, #ff00e6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Mate with {target.name}
        </h2>

        <SocialHandlesEditor handles={handles} onChange={setHandles} />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "12px 0",
            fontWeight: 700,
          }}
        >
          <input
            type="checkbox"
            checked={showOnFeed}
            onChange={(e) => setShowOnFeed(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: "#ff00e6" }}
          />
          Show on Community Feed for Interactions
        </label>

        <textarea
          placeholder="Shoutout (optional)"
          value={shoutout}
          onChange={(e) => setShoutout(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            borderRadius: 12,
            border: "1px solid #334155",
            background: "#0f1220",
            color: "#e6f7ff",
            padding: 10,
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(90deg, #00f7ff, #00c3ff)",
              color: "#001018",
              fontWeight: 800,
            }}
          >
            Confirm Mate
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #334155",
              background: "#0f1220",
              color: "#94a3b8",
              fontWeight: 700,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SocialHandlesEditor({
  handles,
  onChange,
}: {
  handles: SocialHandles;
  onChange: (h: SocialHandles) => void;
}) {
  const fields: (keyof SocialHandles)[] = [
    "instagram",
    "tiktok",
    "snapchat",
    "discord",
    "x",
    "whatsapp",
    "spotify",
  ];

  const setField = (key: keyof SocialHandles, value: string) => {
    onChange({ ...handles, [key]: value });
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {fields.map((f) => (
        <input
          key={f}
          placeholder={`${f} handle (optional)`}
          value={handles[f] || ""}
          onChange={(e) => setField(f, e.target.value)}
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1px solid #334155",
            background: "#0f1220",
            color: "#e6f7ff",
            padding: "10px 12px",
          }}
        />
      ))}
    </div>
  );
}
