/**
 * Age Safety, Cohort Isolation & Area Proximity Algorithms
 * Enforces 16+ age restriction, strict isolation between 16-17 youth and 18+ adults,
 * and geographic area filtering for discovering people nearby.
 */

import { PhotoCard, UserSafetyProfile, AgeCohort } from "../types";

export const MIN_ALLOWED_AGE = 16;
export const ADULT_MIN_AGE = 18;

export interface PopularLocation {
  city: string;
  suburb: string;
  state: string;
  lat: number;
  lng: number;
}

export const POPULAR_LOCATIONS: PopularLocation[] = [
  { city: "Sydney", suburb: "Newtown", state: "NSW", lat: -33.8966, lng: 151.1799 },
  { city: "Sydney", suburb: "Bondi", state: "NSW", lat: -33.8915, lng: 151.2767 },
  { city: "Sydney", suburb: "Surry Hills", state: "NSW", lat: -33.8863, lng: 151.2117 },
  { city: "Melbourne", suburb: "Fitzroy", state: "VIC", lat: -37.8005, lng: 144.9786 },
  { city: "Melbourne", suburb: "Collingwood", state: "VIC", lat: -37.7997, lng: 144.9877 },
  { city: "Melbourne", suburb: "St Kilda", state: "VIC", lat: -37.8640, lng: 144.9820 },
  { city: "Brisbane", suburb: "Fortitude Valley", state: "QLD", lat: -27.4578, lng: 153.0360 },
  { city: "Brisbane", suburb: "West End", state: "QLD", lat: -27.4839, lng: 153.0116 },
  { city: "Gold Coast", suburb: "Surfers Paradise", state: "QLD", lat: -28.0024, lng: 153.4295 },
  { city: "Perth", suburb: "Fremantle", state: "WA", lat: -32.0569, lng: 115.7439 },
  { city: "Adelaide", suburb: "CBD / East End", state: "SA", lat: -34.9229, lng: 138.6080 },
];

/**
 * Checks whether an age is legally allowed on the platform (16+)
 */
export function isAgeAllowed(age: number): boolean {
  return typeof age === "number" && !isNaN(age) && age >= MIN_ALLOWED_AGE;
}

/**
 * Determines cohort based on age:
 * - "youth": ages 16-17
 * - "adult": ages 18+
 */
export function getAgeCohort(age: number): AgeCohort {
  if (age >= ADULT_MIN_AGE) {
    return "adult";
  }
  return "youth";
}

/**
 * Safety barrier rule:
 * Evaluates whether a viewer can see and interact with a candidate.
 * STRICT ISOLATION RULES:
 * 1. Under 16: Blocked entirely.
 * 2. Youth (16-17): Can ONLY interact with other Youth (16-17). Adults (18+) are NEVER shown.
 * 3. Adult (18+): Can ONLY interact with other Adults (18+). Minors (16-17) are NEVER shown.
 */
export function canInteractByAge(viewerAge: number, candidateAge?: number): boolean {
  if (!isAgeAllowed(viewerAge)) {
    return false;
  }

  // If candidate has no age specified, enforce safety: only allow if candidate is adult and viewer is adult
  const targetAge = candidateAge || 19;
  if (!isAgeAllowed(targetAge)) {
    return false;
  }

  const viewerCohort = getAgeCohort(viewerAge);
  const targetCohort = getAgeCohort(targetAge);

  // Youth (16-17) can ONLY see other Youth (16-17)
  if (viewerCohort === "youth") {
    return targetCohort === "youth";
  }

  // Adults (18+) can ONLY see other Adults (18+)
  if (viewerCohort === "adult") {
    return targetCohort === "adult";
  }

  return false;
}

/**
 * Computes great-circle distance in kilometers using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formats distance with privacy fuzzing so exact GPS coordinates are not revealed
 */
export function formatPrivacyDistance(distanceKm: number): string {
  if (distanceKm <= 5) {
    return "Nearby (< 5 km)";
  }
  if (distanceKm <= 15) {
    return "Within 15 km";
  }
  if (distanceKm <= 50) {
    return `~${Math.round(distanceKm / 5) * 5} km away`;
  }
  return `~${Math.round(distanceKm / 10) * 10} km away`;
}

/**
 * Filters candidates based on:
 * 1. Strict age safety isolation (16-17 youth protected from 18+ adults; 18+ isolated from minors)
 * 2. Area proximity radius if area filtering is enabled
 */
export function filterProtectedCandidates(
  cards: PhotoCard[],
  profile: UserSafetyProfile
): PhotoCard[] {
  if (!isAgeAllowed(profile.age)) {
    return []; // Underage hard block
  }

  return cards.filter((card) => {
    // 1. Mandatory Age Safety Barrier
    const candidateAge = card.age || 19;
    if (!canInteractByAge(profile.age, candidateAge)) {
      return false;
    }

    // Adult optional age preference filters (e.g. viewer wants 20-30)
    if (profile.cohort === "adult") {
      if (profile.minAgePreference && candidateAge < profile.minAgePreference) {
        return false;
      }
      if (profile.maxAgePreference && candidateAge > profile.maxAgePreference) {
        return false;
      }
    }

    // 2. Geographic Area / Distance Proximity Filter
    if (profile.filterAreaOnly && card.coordinates && profile.location) {
      const distance = calculateDistanceKm(
        profile.location.lat,
        profile.location.lng,
        card.coordinates.lat,
        card.coordinates.lng
      );
      if (distance > profile.maxDistanceKm) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Default Safety Profile for Initial Users
 */
export const DEFAULT_SAFETY_PROFILE: UserSafetyProfile = {
  age: 21,
  isAgeVerified: true,
  cohort: "adult",
  location: {
    city: "Sydney",
    suburb: "Newtown",
    lat: -33.8966,
    lng: 151.1799,
  },
  maxDistanceKm: 50,
  filterAreaOnly: false,
  minAgePreference: 18,
  maxAgePreference: 35,
};

/**
 * Loads UserSafetyProfile from localStorage
 */
export function loadSafetyProfile(): UserSafetyProfile {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_SAFETY_PROFILE;
  }

  try {
    const saved = localStorage.getItem("mrd_safety_profile");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isAgeAllowed(parsed.age)) {
        return {
          ...parsed,
          cohort: getAgeCohort(parsed.age),
        };
      }
    }
  } catch (e) {
    console.warn("Could not load safety profile:", e);
  }

  return DEFAULT_SAFETY_PROFILE;
}

/**
 * Saves UserSafetyProfile to localStorage
 */
export function saveSafetyProfile(profile: UserSafetyProfile): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      localStorage.setItem("mrd_safety_profile", JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not save safety profile:", e);
    }
  }
}
