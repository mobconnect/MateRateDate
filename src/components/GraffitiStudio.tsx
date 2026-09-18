import React, { useRef, useState, useEffect } from "react";
import {
  Paintbrush,
  Sparkles,
  Download,
  RotateCcw,
  X,
  Type,
  Stamp,
  Sliders,
  Check,
} from "lucide-react";
import { GRAFFITI_STICKERS } from "../data/mockProfiles";
import { sounds } from "../utils/audio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialImageUrl?: string;
  onSaveToDeck?: (imageUri: string, graffitiTitle: string) => void;
}

const SPRAY_COLORS = [
  { name: "Electric Cyan", hex: "#06b6d4" },
  { name: "Hot Pink", hex: "#ec4899" },
  { name: "Street Gold", hex: "#eab308" },
  { name: "Lime Neon", hex: "#10b981" },
  { name: "Graffiti Purple", hex: "#a855f7" },
  { name: "Chalk White", hex: "#ffffff" },
  { name: "Matte Black", hex: "#171717" },
];

export const GraffitiStudio: React.FC<Props> = ({
  isOpen,
  onClose,
  initialImageUrl,
  onSaveToDeck,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(SPRAY_COLORS[0].hex);
  const [spraySize, setSpraySize] = useState<number>(24);
  const [sprayDensity, setSprayDensity] = useState<number>(35);
  const [mode, setMode] = useState<"spray" | "marker" | "stamp" | "text">("spray");
  const [isDrawing, setIsDrawing] = useState(false);
  const [graffitiText, setGraffitiText] = useState("MATE RATE DATE");
  const [selectedSticker, setSelectedSticker] = useState(GRAFFITI_STICKERS[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Background photo image object
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      initialImageUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80";

    img.onload = () => {
      bgImgRef.current = img;
      canvas.width = 600;
      canvas.height = 750;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add a subtle urban vignette
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        200,
        canvas.width / 2,
        canvas.height / 2,
        450
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
  }, [isOpen, initialImageUrl]);

  if (!isOpen) return null;

  // Realistic spray can particle generator
  const drawSpray = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = selectedColor;
    for (let i = 0; i < sprayDensity; i++) {
      const radius = Math.random() * (spraySize / 2);
      const angle = Math.random() * Math.PI * 2;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      const dotSize = Math.random() * 1.8 + 0.5;

      ctx.beginPath();
      ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Fat cap graffiti marker
  const drawMarker = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = selectedColor;
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = spraySize / 2;
    ctx.lineCap = "square";
    ctx.beginPath();
    ctx.arc(x, y, spraySize / 3, 0, Math.PI * 2);
    ctx.fill();
  };

  const stampStickerOnCanvas = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    sounds.playStamp();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.2);

    // Sticker background pill
    const text = selectedSticker.text;
    ctx.font = "bold 26px 'Permanent Marker', sans-serif";
    const textWidth = ctx.measureText(text).width;
    const padX = 18;
    const padY = 12;

    ctx.fillStyle = selectedSticker.color;
    ctx.beginPath();
    ctx.roundRect(-textWidth / 2 - padX, -22 - padY / 2, textWidth + padX * 2, 44, 14);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(text, 0, 7);
    ctx.restore();
  };

  const stampTextOnCanvas = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    sounds.playSpray();
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.06);

    ctx.font = "bold 38px 'Sedgwick Ave Display', 'Permanent Marker', cursive";
    ctx.textAlign = "center";

    // Black graffiti drop outline
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 8;
    ctx.strokeText(graffitiText, 3, 3);

    // Main neon fill
    ctx.fillStyle = selectedColor;
    ctx.fillText(graffitiText, 0, 0);

    // Inner highlight
    ctx.fillStyle = "#ffffff";
    ctx.fillText(graffitiText, -1.5, -1.5);
    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (mode === "stamp") {
      stampStickerOnCanvas(x, y);
      return;
    }

    if (mode === "text") {
      stampTextOnCanvas(x, y);
      return;
    }

    setIsDrawing(true);
    sounds.playSpray();
    if (mode === "spray") drawSpray(x, y);
    else if (mode === "marker") drawMarker(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (mode === "spray") drawSpray(x, y);
    else if (mode === "marker") drawMarker(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !bgImgRef.current) return;
    ctx.drawImage(bgImgRef.current, 0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `mate-rate-date-graffiti-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSaveToCardDeck = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSaveToDeck) return;
    const uri = canvas.toDataURL("image/jpeg", 0.9);
    onSaveToDeck(uri, graffitiText || "Graffiti Custom Piece");
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      id="modal-graffiti-studio"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-neutral-900 border-2 border-neutral-700 rounded-3xl p-5 sm:p-6 shadow-2xl my-auto">
        <button
          id="btn-close-graffiti-studio"
          type="button"
          onClick={onClose}
          aria-label="Close Graffiti Studio"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
            <Paintbrush className="w-6 h-6" />
          </span>
          <div>
            <h2 className="font-graffiti text-2xl sm:text-3xl text-white tracking-wide">
              Graffiti Spray Studio
            </h2>
            <p className="text-xs text-neutral-400">
              Spray tags, stamp stickers, or write graffiti over the photo!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Canvas Area */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-black rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-2xl touch-none">
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-full object-cover cursor-crosshair"
              />
              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] text-neutral-300 pointer-events-none">
                Mode: {mode.toUpperCase()}
              </div>
            </div>

            {/* Quick Canvas Actions */}
            <div className="flex items-center justify-between w-full max-w-[420px] mt-3 gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Wall
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>

                {onSaveToDeck && (
                  <button
                    type="button"
                    onClick={handleSaveToCardDeck}
                    className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-graffiti tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-pink-600/30"
                  >
                    {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <Sparkles className="w-3.5 h-3.5" />}
                    {savedSuccess ? "Saved to Deck!" : "Post on Wall"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tools & Palette Panel */}
          <div className="lg:col-span-4 space-y-4">
            {/* Mode selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                Graffiti Tool
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode("spray")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    mode === "spray"
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Spray Can
                </button>
                <button
                  type="button"
                  onClick={() => setMode("marker")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    mode === "marker"
                      ? "bg-amber-500/20 border-amber-400 text-amber-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Paintbrush className="w-4 h-4" /> Fat Marker
                </button>
                <button
                  type="button"
                  onClick={() => setMode("stamp")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    mode === "stamp"
                      ? "bg-pink-500/20 border-pink-400 text-pink-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Stamp className="w-4 h-4" /> Stickers
                </button>
                <button
                  type="button"
                  onClick={() => setMode("text")}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    mode === "text"
                      ? "bg-purple-500/20 border-purple-400 text-purple-300"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <Type className="w-4 h-4" /> Street Tag
                </button>
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
                Spray Paint Color
              </label>
              <div className="flex flex-wrap gap-2">
                {SPRAY_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => {
                      setSelectedColor(col.hex);
                      sounds.playRattle();
                    }}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                    className={`w-8 h-8 rounded-xl border-2 transition cursor-pointer ${
                      selectedColor === col.hex
                        ? "border-white scale-110 shadow-lg ring-2 ring-white/40"
                        : "border-black/50 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tool specific controls */}
            {mode === "spray" && (
              <div className="space-y-3 p-3 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Nozzle Size</span>
                    <span>{spraySize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={spraySize}
                    onChange={(e) => setSpraySize(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Spray Pressure</span>
                    <span>{sprayDensity} pts</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="70"
                    value={sprayDensity}
                    onChange={(e) => setSprayDensity(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {mode === "stamp" && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Pick Sticker & Click Photo to Stamp
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {GRAFFITI_STICKERS.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedSticker(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-graffiti border transition cursor-pointer ${
                        selectedSticker.id === st.id
                          ? "bg-neutral-100 text-black border-white shadow-md scale-105"
                          : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      {st.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === "text" && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
                  Graffiti Tag Text (Tap Photo to Stamp)
                </label>
                <input
                  type="text"
                  value={graffitiText}
                  onChange={(e) => setGraffitiText(e.target.value)}
                  placeholder="e.g. MATE RATE DATE"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white font-graffiti focus:outline-none focus:border-purple-400"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
