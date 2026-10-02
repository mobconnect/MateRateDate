import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Upload,
  Paintbrush,
  Users,
  Flame,
  Globe,
  Share2,
  Heart,
  UserCheck,
  Star,
  Layers,
  Volume2,
  VolumeX,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Shield,
  Lock,
  Database,
  Scale,
  MapPin,
} from "lucide-react";
import {
  PhotoCard,
  ActionType,
  ConnectedSocial,
  VoteEvent,
  CommunityMatePost,
  SoundSettings,
  ArtistVerification,
  UserPrivacySettings,
  UserSafetyProfile,
} from "./types";
import { INITIAL_PHOTO_CARDS } from "./data/mockProfiles";
import { CardDeck } from "./components/CardDeck";
import { SocialConnectModal } from "./components/SocialConnectModal";
import { UploadModal } from "./components/UploadModal";
import { RateSheet } from "./components/RateSheet";
import { MatchModal } from "./components/MatchModal";
import { GraffitiStudio } from "./components/GraffitiStudio";
import { ConnectionsList } from "./components/ConnectionsList";
import { MobConnectFooter } from "./components/MobConnectFooter";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { CommunityFeedSection } from "./components/CommunityFeedSection";
import { SoundSettingsSheet } from "./components/SoundSettingsSheet";
import { MateModal } from "./components/MateModal";
import { PhoneVerificationModal } from "./components/PhoneVerificationModal";
import { PrivacySecurityModal } from "./components/PrivacySecurityModal";
import { StorageManagerModal } from "./components/StorageManagerModal";
import { LicensingModal } from "./components/LicensingModal";
import { AgeSafetyModal } from "./components/AgeSafetyModal";
import { LanguageSelectorModal } from "./components/LanguageSelectorModal";
import { useI18n } from "./i18n/i18nContext";
import {
  loadSafetyProfile,
  saveSafetyProfile,
  filterProtectedCandidates,
} from "./utils/safetyAlgorithm";
import {
  loadArtistVerification,
  saveArtistVerification,
  removeArtistVerification,
} from "./firebase/phoneVerification";
import {
  createMateConnection,
  createFeedPost,
} from "./firebase/firestore/content";
import { recordPassedCardId } from "./firebase/firestore/mate-connections";
import {
  loadSoundSettings,
  saveSoundSettings,
  getAudioController,
  playSpray,
  playStamp,
  playMatch,
  playUISwipe,
  initGraffitiSFX,
  sounds,
} from "./utils/audio";
import { FirebaseAuthProvider } from "./firebase/provider";

export default function App() {
  // Disappeared passed card IDs
  const [passedCardIds, setPassedCardIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("mrd_passed_ids");
    return saved ? JSON.parse(saved) : [];
  });

  // Deck and cards (all pass disappear from your content)
  const [cards, setCards] = useState<PhotoCard[]>(() => {
    const savedPassed = localStorage.getItem("mrd_passed_ids");
    const passedList: string[] = savedPassed ? JSON.parse(savedPassed) : [];
    const saved = localStorage.getItem("mrd_cards");
    const initialList: PhotoCard[] = saved ? JSON.parse(saved) : INITIAL_PHOTO_CARDS;
    return initialList.filter((c) => !passedList.includes(c.id));
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 16+ Age Safety & Cohort Isolation Profile
  const [safetyProfile, setSafetyProfile] = useState<UserSafetyProfile>(() => loadSafetyProfile());
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  // Filtered Cards: Strict 16-17 youth cohort isolation and area radius filter
  const filteredCards = useMemo(() => {
    const list = filterProtectedCandidates(cards, safetyProfile);
    return list.length > 0 ? list : cards; // fallback so deck is never blank
  }, [cards, safetyProfile]);

  // User's own uploads
  const [myCards, setMyCards] = useState<PhotoCard[]>(() => {
    const savedPassed = localStorage.getItem("mrd_passed_ids");
    const passedList: string[] = savedPassed ? JSON.parse(savedPassed) : [];
    const saved = localStorage.getItem("mrd_my_cards");
    const list: PhotoCard[] = saved ? JSON.parse(saved) : [];
    return list.filter((c) => !passedList.includes(c.id));
  });

  // User's votes history (no passes stored)
  const [votes, setVotes] = useState<VoteEvent[]>(() => {
    const saved = localStorage.getItem("mrd_votes");
    if (saved) {
      const list: VoteEvent[] = JSON.parse(saved);
      return list.filter((v) => v.action !== "pass");
    }
    // Seed initial chronological interactions from mock profiles so the user immediately experiences the Activity view
    return [
      {
        id: "vote-seed-1",
        cardId: INITIAL_PHOTO_CARDS[0].id,
        cardName: INITIAL_PHOTO_CARDS[0].name,
        cardImage: INITIAL_PHOTO_CARDS[0].imageUrl || "",
        action: "mate",
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        targetSocials: INITIAL_PHOTO_CARDS[0].socials,
        isArchived: false,
      },
      {
        id: "vote-seed-2",
        cardId: INITIAL_PHOTO_CARDS[1].id,
        cardName: INITIAL_PHOTO_CARDS[1].name,
        cardImage: INITIAL_PHOTO_CARDS[1].imageUrl || "",
        action: "rate",
        ratingScore: 10,
        ratingCompliment: "10/10 Pure Drip 🔥",
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        targetSocials: INITIAL_PHOTO_CARDS[1].socials,
        isArchived: false,
      },
      {
        id: "vote-seed-3",
        cardId: INITIAL_PHOTO_CARDS[2].id,
        cardName: INITIAL_PHOTO_CARDS[2].name,
        cardImage: INITIAL_PHOTO_CARDS[2].imageUrl || "",
        action: "date",
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        targetSocials: INITIAL_PHOTO_CARDS[2].socials,
        isArchived: false,
      },
    ];
  });

  // User's active connected social profile
  const [userSocial, setUserSocial] = useState<ConnectedSocial>(() => {
    const saved = localStorage.getItem("mrd_user_social");
    return saved
      ? JSON.parse(saved)
      : {
          platform: "instagram",
          handle: "street_tagger",
          url: "https://instagram.com/street_tagger",
          isPrimary: true,
        };
  });

  // Community feed posts for mates interactions
  const [communityMatePosts, setCommunityMatePosts] = useState<CommunityMatePost[]>(() => {
    const saved = localStorage.getItem("mrd_community_mate_posts");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "mate-init-1",
        mateCard: INITIAL_PHOTO_CARDS[0],
        voterSocial: {
          platform: "instagram",
          handle: "street_tagger",
          url: "https://instagram.com/street_tagger",
          isPrimary: true,
        },
        timestamp: "Just now",
        message: "Crew linkup! Sydney street art crew vibe linkup 🔥",
        reactions: { cheers: 14, fire: 28, sayHi: 9 },
        comments: [
          {
            id: "c1",
            authorHandle: "chromer_99",
            text: "Huge vibe, loved the wildstyle tag on Newtown lane!",
            timestamp: "5m ago",
          },
        ],
      },
      {
        id: "mate-init-2",
        mateCard: INITIAL_PHOTO_CARDS[1],
        voterSocial: {
          platform: "tiktok",
          handle: "neon_vibes",
          url: "https://tiktok.com/@neon_vibes",
          isPrimary: true,
        },
        timestamp: "12m ago",
        message: "Linked on Mate! Connect on TikTok for the spray paint reels ⚡",
        reactions: { cheers: 8, fire: 19, sayHi: 5 },
        comments: [],
      },
    ];
  });

  // Navigation route: deck | connections | studio | feed
  const [route, setRoute] = useState<"deck" | "connections" | "studio" | "feed">("deck");

  // Modals state
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRateSheetOpen, setIsRateSheetOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [matchedCard, setMatchedCard] = useState<PhotoCard | null>(null);
  const [lastAction, setLastAction] = useState<ActionType>("mate");
  const [lastRatingScore, setLastRatingScore] = useState<number>(10);
  const [lastRatingCompliment, setLastRatingCompliment] = useState<string>("");

  const [isGraffitiStudioOpen, setIsGraffitiStudioOpen] = useState(false);
  const [studioTargetImage, setStudioTargetImage] = useState<string>("");

  const [isMateModalOpen, setIsMateModalOpen] = useState(false);
  const [mateTarget, setMateTarget] = useState<{ id: string; name: string; photoUrl: string } | null>(null);

  // Free Storage Architecture & Licensing State
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isLicensingModalOpen, setIsLicensingModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const { currentLanguage, t } = useI18n();

  // Artist Phone Verification State (Firebase Authentication)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verification, setVerification] = useState<ArtistVerification>(() => loadArtistVerification());

  // Individual Profile Privacy & Security Settings
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>(() => {
    const saved = localStorage.getItem("mrd_privacy_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback to defaults
      }
    }
    return {
      hidePhoneNumber: true,
      maskSocialHandle: false,
      allowRatingsFromPublic: true,
      allowDateRequests: true,
      allowMateInvites: true,
      autoBlurExifData: true,
      activityHistoryRetentionDays: 30,
    };
  });

  const handleUpdatePrivacySettings = (newSettings: UserPrivacySettings) => {
    setPrivacySettings(newSettings);
    localStorage.setItem("mrd_privacy_settings", JSON.stringify(newSettings));
  };

  const handleClearAllActivity = () => {
    setVotes([]);
    localStorage.removeItem("mrd_votes");
    sounds.playStamp();
  };

  const handleVerificationSuccess = (newVerification: ArtistVerification) => {
    setVerification(newVerification);
    saveArtistVerification(newVerification);
    // Mark user-created cards with verified badge
    setCards((prev) =>
      prev.map((c) => (c.isUserCard ? { ...c, isVerified: true } : c))
    );
    setMyCards((prev) =>
      prev.map((c) => ({ ...c, isVerified: true }))
    );
  };

  const handleUnlinkVerification = () => {
    setVerification({ isVerified: false });
    removeArtistVerification();
    setCards((prev) =>
      prev.map((c) => (c.isUserCard ? { ...c, isVerified: false } : c))
    );
    setMyCards((prev) =>
      prev.map((c) => ({ ...c, isVerified: false }))
    );
  };

  // Sound FX State & Expanded Categories
  const [soundOpen, setSoundOpen] = useState(false);
  const [soundSettings, setSoundSettingsState] = useState<SoundSettings>(loadSoundSettings());

  useEffect(() => {
    initGraffitiSFX();
  }, []);

  const handleSoundChange = (next: SoundSettings) => {
    setSoundSettingsState(next);
    saveSoundSettings(next);
    getAudioController().updateSettings(next);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("mrd_cards", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem("mrd_passed_ids", JSON.stringify(passedCardIds));
  }, [passedCardIds]);

  useEffect(() => {
    localStorage.setItem("mrd_my_cards", JSON.stringify(myCards));
  }, [myCards]);

  useEffect(() => {
    localStorage.setItem("mrd_votes", JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem("mrd_user_social", JSON.stringify(userSocial));
  }, [userSocial]);

  useEffect(() => {
    localStorage.setItem("mrd_community_mate_posts", JSON.stringify(communityMatePosts));
  }, [communityMatePosts]);

  const handleToggleSound = () => {
    const nextMaster = !soundSettings.master;
    const updated: SoundSettings = { ...soundSettings, master: nextMaster };
    handleSoundChange(updated);
    if (nextMaster) {
      playSpray();
    }
  };

  // Triggered when user presses or swipes one of the signature buttons (PASS, MATE, RATE, DATE)
  const handleAction = (action: ActionType) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    // If RATE is selected, open the RateSheet
    if (action === "rate") {
      setIsRateSheetOpen(true);
      return;
    }

    // ALL PASS DISAPPEAR FROM YOUR CONTENT
    if (action === "pass") {
      playSpray();
      const targetId = currentCard.id;
      recordPassedCardId(userSocial.handle || "local_user", targetId);
      setPassedCardIds((prev) => {
        const updated = Array.from(new Set([...prev, targetId]));
        localStorage.setItem("mrd_passed_ids", JSON.stringify(updated));
        return updated;
      });
      // Filter out immediately from cards so it disappears from content
      setCards((prev) => prev.filter((c) => c.id !== targetId));
      setMyCards((prev) => prev.filter((c) => c.id !== targetId));
      return;
    }

    // Record action event
    recordVote(action);

    // If MATE or DATE, celebrate match & show connected social dialog
    if (action === "mate" || action === "date") {
      playMatch();
      setMatchedCard(currentCard);
      setLastAction(action);
      setIsMatchModalOpen(true);
    }

    // Move to next card
    setCurrentIndex((prev) => prev + 1);
  };

  // Called when RateSheet rating is confirmed
  const handleRatingSubmit = (score: number, compliment: string) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    recordVote("rate", score, compliment);
    playStamp();
    setMatchedCard(currentCard);
    setLastAction("rate");
    setLastRatingScore(score);
    setLastRatingCompliment(compliment);
    setIsMatchModalOpen(true);

    setCurrentIndex((prev) => prev + 1);
  };

  const recordVote = (action: ActionType, score?: number, compliment?: string) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    // Update the card counts in state
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== currentCard.id) return c;
        const newMates = c.matesCount + (action === "mate" ? 1 : 0);
        const newDates = c.datesCount + (action === "date" ? 1 : 0);
        const newPasses = c.passesCount;
        let newRatingsCount = c.ratingsCount;
        let newAvgRating = c.averageRating;

        if (action === "rate" && score) {
          newRatingsCount = c.ratingsCount + 1;
          newAvgRating =
            (c.averageRating * c.ratingsCount + score) / newRatingsCount;
        }

        return {
          ...c,
          matesCount: newMates,
          datesCount: newDates,
          passesCount: newPasses,
          ratingsCount: newRatingsCount,
          averageRating: Number(newAvgRating.toFixed(1)),
        };
      })
    );

    // Save vote event
    const newEvent: VoteEvent = {
      id: `vote-${Date.now()}`,
      cardId: currentCard.id,
      cardName: currentCard.name,
      cardImage: currentCard.imageUrl || currentCard.photoUrl || "",
      action,
      ratingScore: score,
      ratingCompliment: compliment,
      timestamp: new Date().toISOString(),
      voterSocial: userSocial,
      targetSocials: currentCard.socials,
    };

    setVotes((prev) => [newEvent, ...prev]);
  };

  // Reset deck reloading all non-passed cards
  const handleResetDeck = () => {
    const saved = localStorage.getItem("mrd_cards");
    const baseList: PhotoCard[] = saved ? JSON.parse(saved) : INITIAL_PHOTO_CARDS;
    const activeList = baseList.filter((c) => !passedCardIds.includes(c.id));
    setCards(activeList);
    setCurrentIndex(0);
    sounds.playSpray();
  };

  const handleAddCard = (newCard: PhotoCard) => {
    setCards((prev) => [newCard, ...prev]);
    setMyCards((prev) => [newCard, ...prev]);
    setCurrentIndex(0);
    setRoute("deck");
  };

  const handleDeleteMyCard = (cardId: string) => {
    setMyCards((prev) => prev.filter((c) => c.id !== cardId));
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleArchiveVote = (voteId: string) => {
    setVotes((prev) =>
      prev.map((v) => (v.id === voteId ? { ...v, isArchived: true } : v))
    );
  };

  const handleUnarchiveVote = (voteId: string) => {
    setVotes((prev) =>
      prev.map((v) => (v.id === voteId ? { ...v, isArchived: false } : v))
    );
  };

  const handleDeleteVote = (voteId: string) => {
    setVotes((prev) => prev.filter((v) => v.id !== voteId));
  };

  const handleOpenGraffitiStudio = (imageUrl: string) => {
    setStudioTargetImage(imageUrl);
    setIsGraffitiStudioOpen(true);
  };

  const handleSaveGraffitiToDeck = (imageUri: string, graffitiTitle: string) => {
    const customCard: PhotoCard = {
      id: `graffiti-${Date.now()}`,
      name: `${userSocial.handle || "Street Tag"} Piece`,
      age: 24,
      tagline: `Custom street tag created in Graffiti Studio: "${graffitiTitle}"`,
      location: "Graffiti Wall / Alley",
      imageUrl: imageUri,
      socials: [userSocial],
      graffitiStyle: "wildstyle",
      ratingsCount: 1,
      averageRating: 10,
      matesCount: 1,
      datesCount: 0,
      passesCount: 0,
      tags: ["GraffitiArt", "SprayPaint", "CustomTag"],
      uploadedAt: new Date().toISOString(),
      isUserCard: true,
    };
    handleAddCard(customCard);
  };

  // Allow Mates to show on community feed for interactions if user chooses
  const handleShareMateToCommunityFeed = (card: PhotoCard, customMessage?: string) => {
    const newPost: CommunityMatePost = {
      id: `mate-post-${Date.now()}`,
      mateCard: card,
      voterSocial: userSocial,
      timestamp: "Just now",
      message: customMessage || "Crew linkup! Connected on MateRateDate ⚡",
      reactions: { cheers: 1, fire: 1, sayHi: 0 },
      comments: [],
    };
    setCommunityMatePosts((prev) => {
      const updated = [newPost, ...prev];
      localStorage.setItem("mrd_community_mate_posts", JSON.stringify(updated));
      return updated;
    });
    sounds.playSpray();

    // Mirror to Firestore collections
    createMateConnection({
      userId: userSocial.handle || "local_user",
      targetUserId: card.id,
      targetName: card.name,
      targetPhotoUrl: card.imageUrl || "",
      socialHandles: {
        [userSocial.platform]: userSocial.handle,
      },
      showOnFeed: true,
      shoutout: customMessage,
    })
      .then((connId) => {
        createFeedPost({
          mateConnectionId: connId,
          userHandle: `@${userSocial.handle || "street_artist"}`,
          targetName: card.name,
          targetPhotoUrl: card.imageUrl || "",
          shoutout: customMessage,
          reactions: { hi: 1, drip: 1, cheers: 1 },
          isUserVerified: verification.isVerified,
          isTargetVerified: card.isVerified,
        }).catch((err) => console.warn("Could not save feed post to Firestore:", err));
      })
      .catch((err) => console.warn("Could not save mate connection to Firestore:", err));
  };

  const handleReactToCommunityPost = (
    postId: string,
    reactionType: "cheers" | "fire" | "sayHi"
  ) => {
    setCommunityMatePosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [reactionType]: p.reactions[reactionType] + 1,
          },
        };
      });
      localStorage.setItem("mrd_community_mate_posts", JSON.stringify(updated));
      return updated;
    });
    sounds.playStamp();
  };

  const handleAddCommunityComment = (postId: string, text: string) => {
    setCommunityMatePosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              authorHandle: userSocial.handle || "crew_member",
              text,
              timestamp: "Just now",
            },
          ],
        };
      });
      localStorage.setItem("mrd_community_mate_posts", JSON.stringify(updated));
      return updated;
    });
    sounds.playSpray();
  };

  const currentCard = filteredCards[currentIndex] || filteredCards[0] || cards[0];

  const handleTabChange = (nextRoute: "deck" | "connections" | "studio" | "feed") => {
    if (nextRoute === "studio") {
      setStudioTargetImage(currentCard?.imageUrl || currentCard?.photoUrl || INITIAL_PHOTO_CARDS[0]?.imageUrl || "");
      setIsGraffitiStudioOpen(true);
      return;
    }
    setRoute(nextRoute);
  };

  return (
    <FirebaseAuthProvider>
      <div className="mrd-root">
        {/* MRD BRAND HEADER */}
        <header className="mrd-header">
          <div
            className="mrd-brand cursor-pointer"
            onClick={() => setRoute("deck")}
          >
            <span className="mrd-title">MateRateDate</span>
            <span className="mrd-badge">MRD</span>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* World Language Selector Header Button */}
            <button
              id="btn-header-language"
              type="button"
              onClick={() => setIsLanguageModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-750 hover:border-cyan-400 text-xs text-neutral-300 hover:text-cyan-300 transition cursor-pointer"
              title="Change World Language (20 Global Languages)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-sm leading-none" role="img" aria-label={currentLanguage.name}>
                {currentLanguage.flag}
              </span>
              <span className="font-mono text-[11px] font-bold uppercase hidden sm:inline">
                {currentLanguage.code}
              </span>
            </button>

            {/* 16+ Age Safety & Cohort Protection Button */}
            <button
              id="btn-header-safety"
              type="button"
              onClick={() => setIsSafetyModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                safetyProfile.cohort === "youth"
                  ? "bg-amber-950/80 border-amber-500/80 text-amber-300 hover:border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.25)]"
                  : "bg-neutral-900 border-neutral-750 text-neutral-300 hover:border-cyan-400 hover:text-cyan-300"
              }`}
              title="16+ Age Gate, Youth Cohort Protection & Local Area Discovery"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${safetyProfile.cohort === "youth" ? "text-amber-400" : "text-cyan-400"}`} />
              <span className="font-mono text-[11px] hidden xs:inline">
                {safetyProfile.cohort === "youth" ? "16–17 Youth" : "18+ Adult"}
              </span>
            </button>

            {/* Artist Verification Badge / Link Button */}
            {verification.isVerified ? (
              <button
                id="btn-header-verified"
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/80 hover:border-cyan-300 text-xs text-cyan-300 transition cursor-pointer shadow-[0_0_10px_rgba(0,247,255,0.25)]"
                title="Verified Artist (Firebase Phone Authenticated)"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                <span className="font-mono font-bold text-[11px] hidden xs:inline">Verified</span>
              </button>
            ) : (
              <button
                id="btn-header-verify"
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-750 hover:border-cyan-400 text-xs text-neutral-300 hover:text-cyan-300 transition cursor-pointer"
                title="Verify phone to earn Verified Artist checkmark"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium text-[11px] hidden xs:inline">Verify</span>
              </button>
            )}

            {/* Connected Social quick link button */}
            <button
              id="btn-header-social-link"
              type="button"
              onClick={() => setIsSocialModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-750 hover:border-pink-500 text-xs text-neutral-300 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-mono text-pink-300 font-medium text-[11px]">@{userSocial.handle}</span>
            </button>

            {/* Privacy & Security Shield Button */}
            <button
              id="btn-header-privacy-security"
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-750 hover:border-cyan-400 text-xs text-neutral-300 hover:text-cyan-300 transition cursor-pointer"
              title="Individual Profile Privacy & Security Protection"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-[11px] hidden sm:inline">Privacy</span>
            </button>

            {/* Upload Photo Button */}
            <button
              id="btn-open-upload-header"
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-graffiti text-xs tracking-wider shadow-md active:scale-95 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-black" />
              <span>Drop</span>
            </button>

            {/* Sound settings button */}
            <button
              id="btn-header-sound-settings"
              type="button"
              aria-label="Sound settings"
              onClick={() => setSoundOpen(true)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-750 hover:border-cyan-400 text-neutral-400 hover:text-cyan-300 transition cursor-pointer"
              title="Graffiti Sound Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Free Storage Architecture Button */}
            <button
              id="btn-header-storage"
              type="button"
              aria-label="Free Storage Architecture & Growth Projections"
              onClick={() => setIsStorageModalOpen(true)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-750 hover:border-cyan-400 text-neutral-400 hover:text-cyan-300 transition cursor-pointer"
              title="Free Storage Architecture & Growth Projections"
            >
              <Database className="w-3.5 h-3.5" />
            </button>

            {/* Licensing & Legal Compliance Button */}
            <button
              id="btn-header-licensing"
              type="button"
              aria-label="Commercial & Community Licensing"
              onClick={() => setIsLicensingModalOpen(true)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-750 hover:border-emerald-400 text-neutral-400 hover:text-emerald-300 transition cursor-pointer"
              title="Licensing, Corporate Identity & WCAG 2.2"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* MRD MAIN CONTENT ROUTED VIEW */}
        <main className="mrd-main">
          {route === "deck" && (
            <div className="w-full flex-1 flex flex-col items-center justify-center py-1 sm:py-2">
              <CardDeck
                cards={filteredCards}
                currentIndex={currentIndex}
                onAction={handleAction}
                onResetDeck={handleResetDeck}
                userSocial={userSocial}
                onOpenSocialModal={(action) => {
                  setPendingAction(action || null);
                  setIsSocialModalOpen(true);
                }}
                onOpenGraffitiStudio={handleOpenGraffitiStudio}
                soundEnabled={soundSettings.master}
                onToggleSound={handleToggleSound}
                soundSettings={soundSettings}
                onOpenSoundSettings={() => setSoundOpen(true)}
                isUserVerified={verification.isVerified}
                onOpenVerificationModal={() => setIsVerifyModalOpen(true)}
                safetyProfile={safetyProfile}
                onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
              />
            </div>
          )}

          {route === "connections" && (
            <ConnectionsList
              votes={votes}
              myCards={myCards}
              onDeleteMyCard={handleDeleteMyCard}
              onOpenUpload={() => setIsUploadModalOpen(true)}
              isUserVerified={verification.isVerified}
              onOpenVerificationModal={() => setIsVerifyModalOpen(true)}
              onArchiveVote={handleArchiveVote}
              onUnarchiveVote={handleUnarchiveVote}
              onDeleteVote={handleDeleteVote}
            />
          )}

          {route === "studio" && (
            <div className="max-w-2xl mx-auto w-full py-4 px-2">
              <GraffitiStudio
                isOpen={true}
                onClose={() => setRoute("deck")}
                initialImageUrl={
                  studioTargetImage ||
                  cards[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                }
                onSaveToDeck={handleSaveGraffitiToDeck}
              />
            </div>
          )}

          {route === "feed" && (
            <CommunityFeedSection
              posts={communityMatePosts}
              userSocial={userSocial}
              onReact={handleReactToCommunityPost}
              onAddComment={handleAddCommunityComment}
              onOpenSocialModal={() => setIsSocialModalOpen(true)}
              isUserVerified={verification.isVerified}
              onOpenVerificationModal={() => setIsVerifyModalOpen(true)}
            />
          )}
        </main>

        {/* MRD MOBILE BOTTOM NAVIGATION BAR */}
        <MobileBottomNav
          route={route}
          onNavigate={handleTabChange}
          connectionsCount={votes.length}
          feedCount={communityMatePosts.length}
        />

        {/* MODALS */}
        {/* Connect Social Modal */}
        <SocialConnectModal
          isOpen={isSocialModalOpen}
          onClose={() => {
            setIsSocialModalOpen(false);
            setPendingAction(null);
          }}
          currentSocial={userSocial}
          onSaveSocial={(soc) => setUserSocial(soc)}
          pendingAction={pendingAction}
          onContinueAction={() => {
            if (pendingAction) {
              handleAction(pendingAction);
            }
          }}
        />

        {/* Photo Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onAddCard={handleAddCard}
          defaultSocial={userSocial}
          isUserVerified={verification.isVerified}
        />

        {/* Rating Sheet (1-10 slider & compliments) */}
        <RateSheet
          isOpen={isRateSheetOpen}
          onClose={() => setIsRateSheetOpen(false)}
          targetName={currentCard?.name || "Candidate"}
          onSubmitRating={handleRatingSubmit}
        />

        {/* Match / Action Celebration Modal */}
        <MatchModal
          isOpen={isMatchModalOpen}
          onClose={() => setIsMatchModalOpen(false)}
          card={matchedCard}
          action={lastAction}
          userSocial={userSocial}
          ratingScore={lastRatingScore}
          ratingCompliment={lastRatingCompliment}
          onShareToCommunityFeed={handleShareMateToCommunityFeed}
          onOpenSocialModal={() => setIsSocialModalOpen(true)}
          onOpenMateCustomizer={(target) => {
            setMateTarget(target);
            setIsMateModalOpen(true);
          }}
        />

        {/* Detailed Mate Socials & Shoutout Modal */}
        {mateTarget && (
          <MateModal
            open={isMateModalOpen}
            onClose={() => {
              setIsMateModalOpen(false);
              setMateTarget(null);
            }}
            target={mateTarget}
            userId={userSocial.handle || "local_user"}
            userHandle={userSocial.handle ? `@${userSocial.handle}` : "@street_artist"}
            isUserVerified={verification.isVerified}
          />
        )}

        {/* Graffiti Studio Canvas Modal */}
        <GraffitiStudio
          isOpen={isGraffitiStudioOpen}
          onClose={() => setIsGraffitiStudioOpen(false)}
          initialImageUrl={studioTargetImage}
          onSaveToDeck={handleSaveGraffitiToDeck}
        />

        {/* Graffiti Sound Settings Bottom Sheet */}
        <SoundSettingsSheet
          open={soundOpen}
          onClose={() => setSoundOpen(false)}
          settings={soundSettings}
          onChange={handleSoundChange}
        />

        {/* Firebase Phone Authentication / Verified Artist Modal */}
        <PhoneVerificationModal
          isOpen={isVerifyModalOpen}
          onClose={() => setIsVerifyModalOpen(false)}
          currentVerification={verification}
          onVerificationSuccess={handleVerificationSuccess}
          onUnlink={handleUnlinkVerification}
        />

        {/* Individual Profile Privacy & Security Protection Modal */}
        <PrivacySecurityModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          privacySettings={privacySettings}
          onUpdatePrivacySettings={handleUpdatePrivacySettings}
          userPhone={verification.phoneNumber}
          isVerified={verification.isVerified}
          onClearAllActivity={handleClearAllActivity}
        />

        {/* Free Multi-Tier Storage Architecture & Growth Manager Modal */}
        <StorageManagerModal
          isOpen={isStorageModalOpen}
          onClose={() => setIsStorageModalOpen(false)}
        />

        {/* Licensing & Legal Compliance Modal */}
        <LicensingModal
          isOpen={isLicensingModalOpen}
          onClose={() => setIsLicensingModalOpen(false)}
        />

        {/* 16+ Age Safety, Youth Cohort Protection & Area Discovery Modal */}
        <AgeSafetyModal
          isOpen={isSafetyModalOpen}
          onClose={() => setIsSafetyModalOpen(false)}
          safetyProfile={safetyProfile}
          onSaveProfile={(updated) => {
            setSafetyProfile(updated);
            saveSafetyProfile(updated);
            setCurrentIndex(0);
          }}
        />

        {/* World Language Selector Modal */}
        <LanguageSelectorModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
        />

        {/* Verified MobConnect Brand Footer with Domain & DUNS config + PDF Export */}
        <MobConnectFooter
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          onOpenLicensing={() => setIsLicensingModalOpen(true)}
          onOpenStorage={() => setIsStorageModalOpen(true)}
          onOpenLanguage={() => setIsLanguageModalOpen(true)}
        />
      </div>
    </FirebaseAuthProvider>
  );
}

