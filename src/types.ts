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
}

export interface SocialHandles {
  instagram?: string;
  tiktok?: string;
  snapchat?: string;
  discord?: string;
  x?: string;       // Twitter/X
  whatsapp?: string;
  spotify?: string;
}

export interface MateConnection {
  id: string;
  createdAt: number;
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
}

export interface UserProfile {
  name: string;
  bio: string;
  primarySocial: ConnectedSocial;
  additionalSocials: ConnectedSocial[];
  photos: string[];
  dunsNumber?: string;
  customDomain?: string;
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

export type SoundCategory = "spray" | "stamp" | "match" | "ui";

export interface SoundSettings {
  master: boolean;
  categories: Record<SoundCategory, boolean>;
}
