"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../data/types";
import { readUser, writeUser } from "../lib/storage";

type AuthValue = { user: User | null; signIn(email: string): void; signOut(): void; ready: boolean };
const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setUser(readUser()); setReady(true); }, []);

  const value = useMemo<AuthValue>(() => ({
    user,
    ready,
    signIn(email) {
      const trimmed = email.trim();
      const prefix = trimmed.split("@")[0];
      const firstName = prefix ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : "Cyclone";
      const next = { email: trimmed, firstName };
      writeUser(next);
      setUser(next);
    },
    signOut() { writeUser(null); setUser(null); },
  }), [ready, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
