"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { getFirebaseClientConfig } from "@/lib/firebase/config";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configError: string | null;
  signInEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const MISSING_ENV_MESSAGE =
  "Firebase is not configured for this deployment. In Vercel → Project Settings → Environment Variables, add NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, and NEXT_PUBLIC_FIREBASE_APP_ID (Production), then Redeploy.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (!getFirebaseClientConfig()) {
      setConfigError(MISSING_ENV_MESSAGE);
      setLoading(false);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      return onAuthStateChanged(auth, (next) => {
        setUser(next);
        setLoading(false);
      });
    } catch (error) {
      setConfigError(
        error instanceof Error ? error.message : MISSING_ENV_MESSAGE
      );
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configError,
      async signInEmail(email, password) {
        if (!getFirebaseClientConfig()) {
          throw new Error(MISSING_ENV_MESSAGE);
        }
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      },
      async logout() {
        if (!getFirebaseClientConfig()) return;
        await signOut(getFirebaseAuth());
      },
    }),
    [user, loading, configError]
  );

  if (configError) {
    return (
      <div
        className="admin-loading"
        style={{ maxWidth: 520, margin: "4rem auto", padding: "0 1.25rem" }}
      >
        <h1 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>
          Admin unavailable
        </h1>
        <p style={{ color: "#5a6b69", lineHeight: 1.5 }}>{configError}</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
