import { jsPDF } from "jspdf";

export function generateAppCodePDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  const addHeader = (title: string, subtitle?: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 25);
    doc.text(title, 14, y);
    y += 7;

    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 110);
      doc.text(subtitle, 14, y);
      y += 6;
    }

    doc.setDrawColor(220, 220, 230);
    doc.line(14, y, pageWidth - 14, y);
    y += 8;
  };

  const addSection = (title: string) => {
    if (y > 260) {
      doc.addPage();
      y = 18;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(236, 72, 153); // Pink accent
    doc.text(title, 14, y);
    y += 6;
  };

  const addParagraph = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 45);
    const lines = doc.splitTextToSize(text, pageWidth - 28);
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }
      doc.text(line, 14, y);
      y += 4.5;
    }
    y += 3;
  };

  const addCodeBlock = (code: string) => {
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 30, 35);
    const lines = code.split("\n");
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }
      doc.text(line, 16, y);
      y += 3.8;
    }
    y += 4;
  };

  // PAGE 1: Cover & Architecture
  addHeader("MateRateDate", "Complete Technical Architecture, Source Code & Basis Documentation");
  addSection("1. Executive Summary & Corporate Registration Identity");
  addParagraph(
    "Application Name: MateRateDate | Package Identifier: com.justbeyou.MateRateDate"
  );
  addParagraph(
    "Registered Corporate Domain: justbeyou.com.au | D-U-N-S® Number: 59-726-146692 | ABN: 59 726 146 692"
  );
  addParagraph(
    "Legal Copyright: © 2026 MateRateDate • Just Be You (justbeyou.com.au). All rights reserved."
  );
  addParagraph(
    "MateRateDate is an urban graffiti-themed interactive social connection web application designed to run seamlessly across Web, Android (com.justbeyou.MateRateDate), and iOS viewports. Users upload photographs and evaluate candidates using four primary tactile street-styled actions: MATE (friendship/crew connection in electric cyan), RATE (detailed aesthetic rating and graffiti compliment stamps in neon gold), DATE (romantic crush notification in hot pink), and PASS (clean street asphalt swipe-away)."
  );
  addParagraph(
    "The application incorporates authentic graffiti typography, synthesized Web Audio spray-can feedback, sticker/stencil overlays, and seamless social linking allowing users to connect their Instagram, TikTok, Snapchat, Discord, X/Twitter, and WhatsApp channels."
  );

  addSection("2. Architecture & Compliance Matrix");
  addParagraph("• Package Name: com.justbeyou.MateRateDate (Android, iOS bundle, PWA manifest)");
  addParagraph("• Registered Entity & Domain: justbeyou.com.au (ABN: 59 726 146 692, D-U-N-S®: 59-726-146692)");
  addParagraph("• Copyright: © 2026 MateRateDate • Just Be You. All rights reserved.");
  addParagraph("• Single-View Core Experience: Touch-swipe physics engine (swipe left to Pass, swipe right to Mate), real-time stamp indicators, underneath card stack preview, and Web Audio API synthesizer.");
  addParagraph("• Full-Stack Safeguards: Verified Firebase Firestore rules, resilient useCollection hook, and error boundaries.");
  addParagraph("• Zero Placeholder Directives: Fully engineered operational logic with state persistence and interactive tools.");
  addParagraph("• Responsive Engineering: Fluid layout adhering to strict contrast, touch targets (>=44px), and cross-platform UX.");
  addParagraph("• Enterprise Credentials: D-U-N-S® credential tracker and verified Just Be You domain integration.");

  addSection("3. Firebase Client Configuration (src/firebase/config.ts)");
  addCodeBlock(`import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const required = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps()[0] ?? initializeApp(required);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);`);

  // PAGE 2: Queries & Hooks
  if (y > 240) { doc.addPage(); y = 18; }
  addSection("4. Firestore Queries (src/firebase/firestore/content.ts)");
  addCodeBlock(`import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/src/firebase/config";

const CONTENT_LIMIT = 50;

export function getPublicContentQuery() {
  return query(
    collection(db, "content"),
    where("visibility", "==", "public"),
    where("status", "==", "published"),
    where("culturalPermissions.permissionStatus", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(CONTENT_LIMIT)
  );
}

export function getCommunityContentQuery() {
  return query(
    collection(db, "content"),
    where("visibility", "==", "community"),
    where("status", "==", "published"),
    where("culturalPermissions.permissionStatus", "==", "approved"),
    orderBy("createdAt", "desc"),
    limit(CONTENT_LIMIT)
  );
}`);

  addSection("5. Resilient Collection Hook (src/firebase/firestore/use-collection.tsx)");
  addCodeBlock(`export function useCollection<T extends DocumentData>(target: Query<T> | null) {
  const [state, setState] = useState({ status: target ? "loading" : "idle", data: [], error: null, retryKey: 0 });
  const retry = useCallback(() => setState(c => ({ ...c, status: target ? "loading" : "idle", error: null, retryKey: c.retryKey + 1 })), [target]);

  useEffect(() => {
    if (!target) { setState({ status: "idle", data: [], error: null, retryKey: 0 }); return; }
    setState(c => ({ ...c, status: "loading", error: null }));
    return onSnapshot(target, 
      snap => setState(c => ({ ...c, status: "success", data: snap.docs.map(d => ({ id: d.id, ...d.data() })), error: null })),
      error => setState(c => ({ ...c, status: "error", data: [], error }))
    );
  }, [target, state.retryKey]);

  return { ...state, retry };
}`);

  addSection("6. Continuous Delivery & GitHub Pages Deployment (deploy-public-webapps.sh)");
  addCodeBlock(`#!/usr/bin/env bash
# Deploy to GitHub Pages workflow for all MobConnect repositories
REPOS=("mobconnect/AutoVault" "mobconnect/Editah" "mobconnect/MAKEITHUP" "mobconnect/SafetyAware-" "mobconnect/Tosser" "mobconnect/JUMBUNNAJARJUM")
# Automates pages deployment and token verification`);

  addSection("7. Graffiti Audio Controller & Sound Settings Sheet (src/utils/audio.ts)");
  addParagraph(
    "Fully engineered AudioController supporting category toggling (Spray, Stamp, Match, UI/Swipe) with persistent device storage (materatedate_sound_settings), round-robin HTMLAudioElement asset pools in /public/sfx/, and instant Web Audio API synthesis fallback. Swiping cards triggers playUISwipe() exclusively (can rattle + directional spray burst)."
  );
  addCodeBlock(`export type SoundCategory = "spray" | "stamp" | "match" | "ui";

export interface SoundSettings {
  master: boolean;
  categories: Record<SoundCategory, boolean>;
}

export const playSpray = () => controller.play("spray");
export const playStamp = () => controller.play("stamp");
export const playMatch = () => controller.play("match");
export const playUISwipe = () => controller.play("ui");`);

  doc.save("materatedate-app-code-and-basis.pdf");
}
