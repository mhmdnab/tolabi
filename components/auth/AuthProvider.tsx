"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginRequest } from "../../lib/api";
import { type Role } from "./types";

type Session = {
  email: string;
  role: Role;
  token: string;
};

type AuthContextValue = {
  session: Session | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Session>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "tolabi-session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const setRoleCookie = useCallback((role: Role | null) => {
    if (typeof document === "undefined") return;
    if (role) {
      document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    } else {
      document.cookie = "role=; path=/; max-age=0; SameSite=Lax";
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Session = JSON.parse(stored);
        setSession(parsed);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const sessionFromApi = await loginRequest(email, password);

    const newSession: Session = {
      email: sessionFromApi.username,
      role: sessionFromApi.role,
      token: sessionFromApi.token,
    };

    setSession(newSession);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    }
    setRoleCookie(newSession.role);

    return newSession;
  }, [setRoleCookie]);

  const logout = useCallback(() => {
    setSession(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setRoleCookie(null);
  }, [setRoleCookie]);

  const value = useMemo(
    () => ({
      session,
      role: session?.role ?? null,
      loading,
      login,
      logout,
    }),
    [session, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
