export type SoundCategory = "spray" | "stamp" | "match" | "ui";

export interface SoundSettings {
  master: boolean;
  categories: Record<SoundCategory, boolean>;
}

export interface SocialHandles {
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  discord?: string;
  x?: string;
  whatsapp?: string;
  spotify?: string;
}

export interface MateConnection {
  id: string;
  createdAt: number;
  userId?: string;
  targetUserId: string;
  targetName: string;
  targetPhotoUrl: string;
  socialHandles: SocialHandles;
  showOnFeed: boolean;
  shoutout?: string;
}

export interface FeedPost {
  id: string;
  createdAt: number;
  mateConnectionId: string;
  userHandle: string;
  targetName: string;
  targetPhotoUrl: string;
  shoutout?: string;
  reactions: { hi: number; drip: number; cheers: number };
  isUserVerified?: boolean;
  isTargetVerified?: boolean;
}

export interface PhotoCard {
  id: string;
  photoUrl?: string;
  imageUrl?: string;
  name: string;
  age?: number;
  tagline: string;
  location: string;
  socials: ConnectedSocial[];
  graffitiStyle?: "electric" | "neon-pink" | "wildstyle" | "chrome" | "stencil";
  ratingsCount: number;
  averageRating: number;
  matesCount: number;
  datesCount: number;
  passesCount: number;
  tags?: string[];
  ownerId?: string;
  uploadedAt: string | number;
  isUserCard?: boolean;
  isVerified?: boolean;
  verifiedPhoneNumber?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ArtistVerification {
  isVerified: boolean;
  phoneNumber?: string;
  verifiedAt?: number;
  uid?: string;
  artistTag?: string;
}

export type SocialPlatform = 
  | "instagram"
  | "tiktok"
  | "snapchat"
  | "discord"
  | "x"
  | "whatsapp"
  | "spotify";

export interface ConnectedSocial {
  platform: SocialPlatform;
  handle: string;
  url?: string;
  isPrimary?: boolean;
}

export type ActionType = "mate" | "rate" | "date" | "pass";

export interface VoteEvent {
  id: string;
  cardId: string;
  cardName: string;
  cardImage: string;
  action: ActionType;
  ratingScore?: number;
  ratingCompliment?: string;
  timestamp: string;
  voterSocial?: ConnectedSocial;
  targetSocials: ConnectedSocial[];
  isArchived?: boolean;
}

export interface UserPrivacySettings {
  hidePhoneNumber: boolean;
  maskSocialHandle: boolean;
  allowRatingsFromPublic: boolean;
  allowDateRequests: boolean;
  allowMateInvites: boolean;
  autoBlurExifData: boolean;
  activityHistoryRetentionDays: number;
}

export interface UserProfile {
  name: string;
  bio: string;
  primarySocial: ConnectedSocial;
  additionalSocials: ConnectedSocial[];
  photos: string[];
  dunsNumber?: string;
  customDomain?: string;
  isVerified?: boolean;
  phoneNumber?: string;
  verifiedAt?: number;
  privacySettings?: UserPrivacySettings;
}

export interface CommunityMatePost {
  id: string;
  mateCard: PhotoCard;
  voterSocial: ConnectedSocial;
  timestamp: string;
  message?: string;
  reactions: {
    cheers: number;
    fire: number;
    sayHi: number;
  };
  comments: Array<{
    id: string;
    authorHandle: string;
    text: string;
    timestamp: string;
  }>;
}

export interface GraffitiStamp {
  id: string;
  type: "text" | "sticker" | "spray";
  content: string;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

export type AgeCohort = "youth" | "adult";

export interface UserSafetyProfile {
  age: number; // 16+ mandatory
  birthDate?: string;
  isAgeVerified: boolean;
  cohort: AgeCohort; // youth: 16-17; adult: 18+
  location: {
    city: string;
    suburb: string;
    lat: number;
    lng: number;
  };
  maxDistanceKm: number; // e.g. 50km
  filterAreaOnly: boolean;
  minAgePreference?: number;
  maxAgePreference?: number;
}

