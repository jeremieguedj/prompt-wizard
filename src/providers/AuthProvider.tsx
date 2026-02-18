"use client";

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  const fetchProfile = useCallback(
    async (authUser: User) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (data) {
          setProfile(data);
        } else {
          const displayName =
            authUser.user_metadata?.display_name ||
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email?.split("@")[0] ||
            "Prompt Wizard";

          const { data: newProfile } = await supabase
            .from("profiles")
            .upsert({
              id: authUser.id,
              email: authUser.email ?? null,
              display_name: displayName,
            })
            .select()
            .single();

          setProfile(newProfile);
        }
      } catch {
        // Profile fetch failed — non-blocking
      }
    },
    [supabase]
  );

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    // Rely solely on onAuthStateChange — it fires INITIAL_SESSION immediately
    // with the current session. Avoids calling getSession()/getUser() which
    // can deadlock on the Navigator Lock.
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          // Keep this callback synchronous — never await inside onAuthStateChange
          // as it holds the Navigator Lock and will deadlock other auth calls
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            fetchProfile(currentUser); // fire-and-forget
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      );
      subscription = data.subscription;
    } catch {
      // Supabase not configured — stop loading
      setLoading(false);
    }

    return () => subscription?.unsubscribe();
  }, [supabase, fetchProfile]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Sign-out may fail if lock is held — clear cookies manually
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-")) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    }
    setUser(null);
    setProfile(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
