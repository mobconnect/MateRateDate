import React from "react";

type SoundCategory = "spray" | "stamp" | "match" | "ui";

interface SoundSettings {
  master: boolean;
  categories: Record<SoundCategory, boolean>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  settings: SoundSettings;
  onChange: (next: SoundSettings) => void;
}

const CATEGORY_LABELS: Record<SoundCategory, string> = {
  spray: "Spray (graffiti aerosol)",
  stamp: "Stamp (tag impact)",
  match: "Match (celebration)",
  ui: "UI / Swipe (graffiti spray)",
};

export function SoundSettingsSheet({ open, onClose, settings, onChange }: Props) {
  if (!open) return null;

  const toggleCategory = (cat: SoundCategory) => {
    onChange({
      ...settings,
      categories: {
        ...settings.categories,
        [cat]: !settings.categories[cat],
      },
    });
  };

  const toggleMaster = () => {
    const nextMaster = !settings.master;
    onChange({
      ...settings,
      master: nextMaster,
    });
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
        alignItems: "flex-end",
        zIndex: 1200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          margin: "0 auto",
          background: "#0b0b0f",
          color: "#e6f7ff",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: 18,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: 0.5,
            background:
              "linear-gradient(90deg, #00f7ff, #ff00e6, #ffe600)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Graffiti Sound Settings
        </h2>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: "1px solid #1f2230",
          }}
        >
          <span style={{ fontWeight: 700 }}>Master Audio</span>
          <input
            type="checkbox"
            checked={settings.master}
            onChange={toggleMaster}
            style={{ width: 22, height: 22, accentColor: "#00f7ff" }}
          />
        </label>

        {(Object.keys(CATEGORY_LABELS) as SoundCategory[]).map((cat) => (
          <label
            key={cat}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #161926",
              opacity: settings.master ? 1 : 0.5,
            }}
          >
            <span>{CATEGORY_LABELS[cat]}</span>
            <input
              type="checkbox"
              disabled={!settings.master}
              checked={settings.master && settings.categories[cat]}
              onChange={() => toggleCategory(cat)}
              style={{ width: 22, height: 22, accentColor: "#ff00e6" }}
            />
          </label>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              background:
                "linear-gradient(90deg, #00f7ff, #00c3ff)",
              color: "#001018",
              fontWeight: 800,
              letterSpacing: 0.4,
            }}
          >
            Done
          </button>
          <button
            onClick={() =>
              onChange({
                master: true,
                categories: { spray: true, stamp: true, match: true, ui: true },
              })
            }
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
            Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
