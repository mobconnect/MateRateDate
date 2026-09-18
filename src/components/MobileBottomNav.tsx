import React from "react";

type Route = "deck" | "connections" | "studio" | "feed";

interface Props {
  route: Route;
  onNavigate: (r: Route) => void;
  connectionsCount?: number;
  feedCount?: number;
}

const ITEMS: { key: Route; label: string }[] = [
  { key: "deck", label: "Wall Deck" },
  { key: "connections", label: "Connections" },
  { key: "studio", label: "Studio" },
  { key: "feed", label: "Feed" },
];

export function MobileBottomNav({ route, onNavigate }: Props) {
  return (
    <nav className="mrd-nav">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          className={route === item.key ? "active" : ""}
          onClick={() => onNavigate(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
