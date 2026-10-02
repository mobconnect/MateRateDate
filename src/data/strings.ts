/**
 * MateRateDate Centralized Application Strings Architecture
 * Holds all UI copy, actions, legal disclosures, error states, and storage terms.
 * Domain: justbeyou.com.au | D-U-N-S: 749068766 | ABN: 59 726 146 692
 */

export const APP_STRINGS = {
  meta: {
    appName: "MateRateDate",
    tagline: "Urban Street Art & Social Connection Hub",
    company: "Just Be You",
    domain: "justbeyou.com.au",
    dunsNumber: "749068766",
    abnNumber: "59 726 146 692",
    packageName: "com.justbeyou.MateRateDate",
    appUrl: "https://ais-dev-6tdehh4xd4hz3w7anazvbl-607529501453.asia-east1.run.app",
    sharedUrl: "https://ais-pre-6tdehh4xd4hz3w7anazvbl-607529501453.asia-east1.run.app",
    copyright: "© 2026 MateRateDate • Just Be You (justbeyou.com.au). All rights reserved.",
    accessibilityStandard: "WCAG 2.2 Level AA Compliant",
    platforms: "Web • Android • iOS",
  },

  nav: {
    deck: "Street Deck",
    connections: "Mates & Activity",
    studio: "Graffiti Studio",
    feed: "Community Feed",
    settings: "Settings",
    storage: "Storage Architecture",
    licensing: "Licensing & Legal",
    sound: "Sound SFX",
  },

  actions: {
    mate: {
      label: "MATE",
      sublabel: "Crew & Friendship",
      description: "Connect as mates or creative crew. Swiping right initiates a connection.",
      color: "cyan",
      keyboardKey: "ArrowRight",
    },
    rate: {
      label: "RATE",
      sublabel: "1-10 Drip & Style",
      description: "Stamp an authentic aesthetic rating and graffiti compliment.",
      color: "amber",
      keyboardKey: "ArrowUp",
    },
    date: {
      label: "DATE",
      sublabel: "Romantic Crush",
      description: "Cast a romantic spark or crush notification in hot pink.",
      color: "pink",
      keyboardKey: "Space",
    },
    pass: {
      label: "PASS",
      sublabel: "Swipe Away",
      description: "Clean street asphalt swipe-away. Passed cards disappear completely from your feed.",
      color: "neutral",
      keyboardKey: "ArrowLeft",
    },
  },

  rateSheet: {
    title: "Rate Street Drip",
    subtitle: "Score aesthetic style from 1 to 10 and pick a custom tag compliment",
    submitButton: "Stamp Rating",
    cancelButton: "Cancel",
    sliderLabel: "Select Rating Score (1 to 10)",
    compliments: [
      "10/10 Pure Drip 🔥",
      "9/10 Certified Legend ⚡",
      "8/10 Wildstyle Master 🎨",
      "7/10 Fresh Tag Energy 💫",
      "6/10 Clean Street Stencil ✨",
      "5/10 Solid Foundation 👊",
      "4/10 Needs More Paint 💥",
      "3/10 Rough Around the Edges 🛹",
      "2/10 Quick Sketch Only ✏️",
      "1/10 Blank Canvas 🧱",
    ],
  },

  studio: {
    title: "Graffiti Spray Studio",
    subtitle: "Custom spray paint canvas with real synthesized can pressure and aerosol sounds",
    tools: {
      spray: "Spray Can",
      drip: "Drip Acrylic",
      marker: "Chisel Marker",
      eraser: "Street Buffer",
    },
    palette: "Spray Cans Palette",
    brushSize: "Nozzle Cap Size",
    clearCanvas: "Whiteout Wall",
    saveToDeck: "Tag & Add to Deck",
    close: "Close Studio",
  },

  upload: {
    title: "Tag Your Profile to Deck",
    subtitle: "Add your picture, graffiti handle, and social links to the street discovery pool",
    nameLabel: "Your Handle or Alias",
    namePlaceholder: "e.g. Neon_Tagger, Jax_Sydney",
    bioLabel: "Street Bio / Tagline",
    bioPlaceholder: "Aerosol artist, midnight muralist, searching for crew mates...",
    photoLabel: "Upload Photograph",
    photoHint: "JPEG, PNG, WebP up to 10MB",
    socialPlatformLabel: "Primary Social Platform",
    socialHandleLabel: "Social Username / Link",
    submitButton: "Post to Street Deck",
    cancelButton: "Cancel",
    errors: {
      missingName: "Please provide a handle or name.",
      missingPhoto: "Please choose a photo to upload.",
      invalidFileType: "Only JPEG, PNG, and WebP images are supported.",
      fileTooLarge: "Image exceeds maximum allowed size (10MB).",
    },
  },

  connections: {
    title: "Your Mates & Street Activity",
    subtitle: "All your active connections, ratings stamped, and mutual sparks",
    emptyTitle: "No Connections Yet",
    emptySubtitle: "Swipe right to Mate, rate candidates, or spark dates to start connecting.",
    archiveButton: "Archive",
    unarchiveButton: "Restore",
    directMessage: "Message on",
    viewSocials: "View Social Channels",
  },

  feed: {
    title: "Community Feed",
    subtitle: "Live opted-in connections, shoutouts, and graffiti community buzz",
    reactions: {
      sayHi: "Say Hi 👋",
      drip: "Pure Drip 🔥",
      cheers: "Cheers Mate 🍻",
    },
    commentPlaceholder: "Drop a street comment or reply...",
    postComment: "Send",
    shareMateButton: "Share Mate to Community Feed",
    noPosts: "No community posts yet. Be the first to share an opted-in Mate connection!",
  },

  privacy: {
    title: "Privacy & Identity Protections",
    subtitle: "Australian Privacy Principles (APP) & GDPR-compliant user identity safeguards",
    toggles: {
      showOnFeed: "Opt-in to Community Feed showcase",
      hidePassedProfiles: "Permanently disappear passed candidates from local view",
      analyticsConsent: "Anonymous performance diagnostics",
    },
    clearData: "Clear All Local App Data",
    confirmClear: "Are you sure? This will reset all local connections, passes, and cached drafts.",
  },

  licensing: {
    title: "Licensing & Legal Compliance",
    subtitle: "Dual Commercial & Open Source Software Licensing with Complete IP Safeguards",
    sections: {
      overview: {
        heading: "Application License Summary",
        body: "MateRateDate is published and maintained by Just Be You (ABN: 59 726 146 692, D-U-N-S®: 749068766, Registered Domain: justbeyou.com.au). Distributed under a dual-tier commercial & open community license, ensuring complete intellectual property protection, unrestricted local personal execution, and enterprise cross-platform deployment.",
      },
      commercial: {
        heading: "Commercial & Proprietary Software License (Just Be You)",
        body: "Copyright (c) 2026 MateRateDate, Just Be You. All rights reserved. Permission is hereby granted to authorized enterprise partners, mobile packaging distributors, and licensed end users to compile, test, distribute, and execute the compiled application on Web, Android (com.justbeyou.MateRateDate), and iOS platforms. Commercial redistribution, re-branding, or proprietary reverse-engineering without prior written authorization from Just Be You is strictly prohibited.",
      },
      openSource: {
        heading: "Open Source Attribution & Components",
        body: "MateRateDate integrates select open-source libraries governed by standard permissive licenses including the MIT License and Apache License 2.0. Third-party components include: React (MIT), Lucide React Icons (ISC), Tailwind CSS (MIT), Canvas-Confetti (MIT), jsPDF (MIT), Vitest (MIT), and Google GenAI SDK (Apache 2.0). All third-party copyrights belong to their respective creators.",
      },
      australianLaw: {
        heading: "Australian Business Register & Corporate Identity",
        body: "Entity Name: Just Be You\nABN: 59 726 146 692\nD-U-N-S® Registered Number: 749068766\nRegistered Web Domain: https://justbeyou.com.au\nGoverning Law: Laws of the Commonwealth of Australia and New South Wales. This software strictly adheres to the Privacy Act 1988 (Cth), the Australian Privacy Principles (APPs), and the Spam Act 2003.",
      },
      accessibility: {
        heading: "WCAG 2.2 Accessibility Declaration",
        body: "This software is engineered to adhere to Web Content Accessibility Guidelines (WCAG) 2.2 Level AA standards. All interactive buttons, modals, sliders, and audio controls feature semantic HTML roles, keyboard accessibility (Tab, Enter, Escape, Arrow keys), contrast ratios exceeding 4.5:1, and screen-reader status live-regions.",
      },
    },
  },

  storage: {
    title: "Free Storage Architecture & Growth Engine",
    subtitle: "Unlimited multi-tier client persistence with zero expenditure and automated scaling",
    architectureHeading: "Multi-Tier Zero-Cost Storage Pipeline",
    tiers: {
      tier1: {
        name: "Tier 1: In-Memory Reactive Cache",
        capacity: "Transient RAM",
        cost: "100% Free ($0.00)",
        description: "Zero-latency reactive state cache for sub-millisecond card swipes, spray physics, and audio buffers.",
      },
      tier2: {
        name: "Tier 2: Synchronous LocalStorage",
        capacity: "~5MB - 10MB",
        cost: "100% Free ($0.00)",
        description: "Instant persistence for active theme settings, user social handle, volume sliders, and pass filters.",
      },
      tier3: {
        name: "Tier 3: High-Capacity IndexedDB Media Store",
        capacity: "Unlimited (Up to 80% available disk, 50GB - 500GB+)",
        cost: "100% Free ($0.00)",
        description: "Local database holding full-resolution photographs, graffiti artwork blobs, audio songlines, and draft yarns.",
      },
      tier4: {
        name: "Tier 4: Cloud Firebase Storage & Firestore",
        capacity: "5GB Free Spark Cloud Storage + 50k reads/day",
        cost: "Free Spark Tier ($0.00 / month)",
        description: "Zero-cost cloud synchronization for opted-in community feed posts and public mate connections.",
      },
    },
    quota: {
      heading: "Device Storage Quota & Capacity",
      usedLabel: "Currently Used",
      availableLabel: "Total Available Quota",
      percentageLabel: "Percentage Utilized",
      persistenceLabel: "Persistent Storage Status",
      persistentGranted: "Granted (Protected against browser eviction)",
      persistentNotGranted: "Standard (Click below to grant permanent protection)",
      requestPersistenceButton: "Enable Permanent Storage Protection",
      clearCacheButton: "Clear Media Cache",
      backupButton: "Export Full Database Archive (.json)",
      restoreButton: "Restore Archive from File",
    },
    expenditure: {
      heading: "Expenditure & Growth Scaling Projections",
      intro: "Because MateRateDate utilizes client-side IndexedDB for all heavy media files and local caching, the cloud infrastructure expenditure remains effectively $0.00 for up to 50,000 monthly active users.",
      scaleTable: [
        { users: "1 - 50,000 Users", monthlyCost: "$0.00 (100% Free Tier)", cloudStorage: "0 - 5 GB (Covered by Free Tier)", strategy: "Pure Client IndexedDB + Spark Firebase" },
        { users: "50,000 - 250,000 Users", monthlyCost: "~$12.50 / month", cloudStorage: "50 - 200 GB", strategy: "Distributed CDN + Delta cloud sync" },
        { users: "250,000 - 1,000,000 Users", monthlyCost: "~$48.00 / month", cloudStorage: "500 GB - 1 TB", strategy: "High-compression WebP + Edge Object Buckets" },
        { users: "1,000,000+ Users", monthlyCost: "~$120.00 / month", cloudStorage: "2+ TB Enterprise", strategy: "Global Multi-Region Cloud with S3/GCS tiering" },
      ],
      calculatorHeading: "Interactive Growth Expenditure Calculator",
      calculatorHint: "Simulate storage usage to forecast monthly infrastructure costs:",
    },
  },

  errors: {
    generic: "Something unexpected occurred. Please try again.",
    storageExceeded: "Local storage limit reached. Please export a backup or clear old cache.",
    networkOffline: "You are currently offline. Local actions will persist in IndexedDB and synchronize when reconnected.",
    permissionDenied: "Permission was denied. Please check your browser privacy settings.",
    corruptBackup: "The selected backup file is invalid or corrupted.",
  },

  safety: {
    ageLimit: "16+ Age Limit Enforced",
    minimumAge: 16,
    adultAge: 18,
    youthCohort: "Protected 16–17 Youth Cohort",
    adultCohort: "Verified 18+ Adult Discovery Cohort",
    underageBlocked: "Access Prohibited: MateRateDate is strictly 16+ only to protect young people in compliance with Australian online safety standards.",
    youthAlgorithmDescription: "Algorithms strictly protect 16–17 year olds by keeping discovery exclusively within their peer age range. Adults (18+) can never see or contact 16–17 year old profiles.",
    adultAlgorithmDescription: "Adults (18+) discover and connect exclusively with other adults (18+). Minors are strictly excluded from adult discovery feeds.",
    areaDiscovery: "Find People in Your Area",
    detectAreaButton: "Detect My Area GPS",
    radiusLabel: "Search Radius (km)",
  },
};

/**
 * Type-safe string getter with parameter interpolation
 */
export function t(path: string, params?: Record<string, string | number>): string {
  const parts = path.split(".");
  let current: any = APP_STRINGS;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return path; // Fallback to key
    }
  }

  if (typeof current !== "string") {
    return path;
  }

  let result = current;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`{${key}}`, "g"), String(value));
    }
  }

  return result;
}
