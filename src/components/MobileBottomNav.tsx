import React from "react";
import { Layers, Users, Palette, MessageSquare } from "lucide-react";
import { useI18n } from "../i18n/i18nContext";

type Route = "deck" | "connections" | "studio" | "feed";

interface Props {
  route: Route;
  onNavigate: (r: Route) => void;
  connectionsCount?: number;
  feedCount?: number;
}

export function MobileBottomNav({ route, onNavigate, connectionsCount = 0 }: Props) {
  const { t } = useI18n();

  const items: { key: Route; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "deck", label: t("nav.deck") || "Street Deck", icon: Layers },
    { key: "connections", label: t("nav.connections") || "Connections", icon: Users },
    { key: "studio", label: t("nav.studio") || "Studio", icon: Palette },
    { key: "feed", label: t("nav.feed") || "Feed", icon: MessageSquare },
  ];
  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main application navigation"
      className="sticky bottom-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800 px-3 py-2"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1 sm:gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = route === item.key;
          return (
            <button
              key={item.key}
              id={`nav-tab-${item.key}`}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-neutral-900 text-cyan-300 font-bold border border-neutral-750 shadow-inner"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 mb-0.5 ${
                    isActive ? "text-cyan-400 stroke-[2.4]" : "text-neutral-400"
                  }`}
                />
                {item.key === "connections" && connectionsCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 min-w-[14px] h-[14px] rounded-full bg-pink-500 text-[9px] font-mono font-bold text-white flex items-center justify-center">
                    {connectionsCount > 99 ? "99+" : connectionsCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
