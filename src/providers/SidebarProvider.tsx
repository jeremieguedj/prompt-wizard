"use client";

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { PromptRow } from "@/types/prompt";

interface SidebarContextType {
  prompts: PromptRow[];
  loading: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  refreshPrompts: () => Promise<void>;
}

export const SidebarContext = createContext<SidebarContextType>({
  prompts: [],
  loading: true,
  isOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
  refreshPrompts: async () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPrompts = useCallback(async () => {
    if (!user) {
      setPrompts([]);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    setPrompts((data as PromptRow[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    fetchPrompts();
  }, [authLoading, fetchPrompts]);

  const refreshPrompts = useCallback(async () => {
    await fetchPrompts();
  }, [fetchPrompts]);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);

  return (
    <SidebarContext.Provider
      value={{ prompts, loading, isOpen, toggleSidebar, closeSidebar, refreshPrompts }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
