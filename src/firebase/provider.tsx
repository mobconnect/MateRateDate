import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import { auth } from "@/src/firebase/config";

interface FirebaseAuthContextType {
  currentUser: User | null;
  isAuthReady: boolean;
  communityMembershipReady: boolean;
  isCommunityAuthorised: boolean;
  signInAnon: () => Promise<void>;
  logOut: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  currentUser: null,
  isAuthReady: false,
  communityMembershipReady: false,
  isCommunityAuthorised: false,
  signInAnon: async () => {},
  logOut: async () => {},
});

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [communityMembershipReady, setCommunityMembershipReady] = useState(false);
  const [isCommunityAuthorised, setIsCommunityAuthorised] = useState(false);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setIsAuthReady(true);
        setCommunityMembershipReady(true);
        // By default, authenticated users or active users have community access
        setIsCommunityAuthorised(Boolean(user));
      });
      return () => unsubscribe();
    } catch (e) {
      // Fallback for offline or local mode
      setIsAuthReady(true);
      setCommunityMembershipReady(true);
      setIsCommunityAuthorised(true);
    }
  }, []);

  const signInAnon = async () => {
    try {
      await signInAnonymously(auth);
      setIsCommunityAuthorised(true);
    } catch (err) {
      console.warn("Firebase anonymous sign-in failed or demo mode:", err);
      setIsCommunityAuthorised(true);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setIsCommunityAuthorised(false);
    } catch (err) {
      console.warn("Firebase sign-out:", err);
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        currentUser,
        isAuthReady,
        communityMembershipReady,
        isCommunityAuthorised,
        signInAnon,
        logOut,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}
