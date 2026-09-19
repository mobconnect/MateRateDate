import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  X,
  Plus,
  Sparkles,
  MapPin,
  Tag,
  Instagram,
  Music,
  Share2,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { PhotoCard, ConnectedSocial, SocialPlatform } from "../types";
import { sounds } from "../utils/audio";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: PhotoCard) => void;
  defaultSocial: ConnectedSocial;
  isUserVerified?: boolean;
}

export const UploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddCard,
  defaultSocial,
  isUserVerified = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("23");
  const [location, setLocation] = useState("Melbourne / Street Art Alley");
  const [tagline, setTagline] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["Street Style", "Sneakers", "Night Vibe"]);
  const [graffitiStyle, setGraffitiStyle] = useState<PhotoCard["graffitiStyle"]>("wildstyle");
  
  // Socials for this uploaded card
  const [platform, setPlatform] = useState<SocialPlatform>(defaultSocial.platform || "instagram");
  const [handle, setHandle] = useState<string>(defaultSocial.handle || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
          sounds.playSpray();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
          sounds.playSpray();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    const cleanHandle = handle.trim().replace(/^@/, "");
    let socialUrl = "";
    if (platform === "instagram") socialUrl = `https://instagram.com/${cleanHandle}`;
    else if (platform === "tiktok") socialUrl = `https://tiktok.com/@${cleanHandle}`;
    else if (platform === "snapchat") socialUrl = `https://snapchat.com/add/${cleanHandle}`;
    else socialUrl = `https://${platform}.com/${cleanHandle}`;

    const newCard: PhotoCard = {
      id: `user-card-${Date.now()}`,
      name: name.trim() || "Street Rebel",
      age: parseInt(age, 10) || 24,
      tagline: tagline.trim() || "Living for urban street art, mates & dates! ⚡",
      location: location.trim() || "Everywhere",
      imageUrl: imagePreview,
      socials: [
        {
          platform,
          handle: cleanHandle || "mate_rate_date",
          url: socialUrl,
          isPrimary: true,
        },
      ],
      graffitiStyle,
      ratingsCount: 1,
      averageRating: 10,
      matesCount: 0,
      datesCount: 0,
      passesCount: 0,
      tags,
      uploadedAt: new Date().toISOString(),
      isUserCard: true,
      isVerified: isUserVerified,
    };

    sounds.playStamp();
    onAddCard(newCard);
    onClose();
  };

  return (
    <div
      id="modal-upload-photo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-neutral-900 border-2 border-neutral-700 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        <button
          id="btn-close-upload-modal"
          type="button"
          onClick={onClose}
          aria-label="Close photo upload dialog"
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Upload className="w-6 h-6" />
          </span>
          <div>
            <h2 className="font-graffiti text-2xl sm:text-3xl text-white tracking-wide">
              Drop Your Photo
            </h2>
            <p className="text-xs text-neutral-400">
              Get rated, find your mates, or discover your next date!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Dropzone or File Input */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
              Photo Upload *
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[190px] ${
                imagePreview
                  ? "border-cyan-500/80 bg-neutral-950"
                  : "border-neutral-700 hover:border-cyan-400 bg-neutral-950/60 hover:bg-neutral-950"
              }`}
            >
              <input
                ref={fileInputRef}
                id="photo-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative w-full max-h-56 flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="max-h-52 rounded-xl object-contain border border-neutral-800 shadow-md"
                  />
                  <span className="absolute bottom-2 right-2 px-3 py-1 bg-black/80 rounded-full text-[11px] font-semibold text-cyan-300 border border-cyan-500/40">
                    Click to Change
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="font-graffiti text-lg text-neutral-200">
                    Drag & Drop or Tap to Browse
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Supports JPG, PNG, WEBP from camera or gallery
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Name & Age */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label htmlFor="card-name-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Your Tag / Name *
              </label>
              <input
                id="card-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Phoenix Jax"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="card-age-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Age
              </label>
              <input
                id="card-age-input"
                type="number"
                min="18"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 text-center"
              />
            </div>
          </div>

          {/* Location & Tagline */}
          <div>
            <label htmlFor="card-location-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Location / City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                id="card-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sydney, NSW"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="card-tagline-input" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Bio / Street Vibe
            </label>
            <textarea
              id="card-tagline-input"
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="What makes your drip or energy stand out?"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Connected Social Channel to Link */}
          <div className="p-3.5 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
            <label className="text-xs font-semibold uppercase tracking-wider text-pink-400 block mb-2 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-pink-400" /> Connected Social To Link (For Mates & Dates)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                id="select-upload-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="snapchat">Snapchat</option>
                <option value="discord">Discord</option>
                <option value="x">X / Twitter</option>
                <option value="whatsapp">WhatsApp</option>
              </select>

              <input
                id="input-upload-social-handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Handle or tag (e.g. jax_art)"
                className="sm:col-span-2 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Interest Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="input-tag-add"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag (e.g. Skater, DJ)"
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-300"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-400 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Privacy & EXIF Scrubbing Notice */}
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-2.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-300 block">Individual Creator Privacy Safeguard</span>
              <span>
                Embedded EXIF metadata and GPS locations are scrubbed prior to publishing. You retain full copyright ownership of your photos and may delete them from your active deck at any time.
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              id="btn-publish-photo-card"
              type="submit"
              disabled={!imagePreview}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 text-black font-graffiti text-xl tracking-wider shadow-lg shadow-cyan-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-black" />
              DROP PHOTO ON THE WALL ⚡
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
