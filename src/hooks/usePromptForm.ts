"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  type PromptData,
  type PromptFieldKey,
  DEFAULT_PROMPT_DATA,
} from "@/types/prompt";
import { calculateTotalXP, getLevelForXP } from "@/lib/xp";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "prompt-wizard-anon";
const STORAGE_EXPIRY_KEY = "prompt-wizard-anon-expiry";
const ANON_TTL = 24 * 60 * 60 * 1000; // 24 hours

function loadFromLocalStorage(): PromptData | null {
  if (typeof window === "undefined") return null;
  const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
  if (expiry && Date.now() > parseInt(expiry, 10)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
    return null;
  }
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function saveToLocalStorage(data: PromptData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  if (!localStorage.getItem(STORAGE_EXPIRY_KEY)) {
    localStorage.setItem(
      STORAGE_EXPIRY_KEY,
      String(Date.now() + ANON_TTL)
    );
  }
}

export function clearAnonStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_EXPIRY_KEY);
}

export function getAnonExpiry(): number | null {
  if (typeof window === "undefined") return null;
  const expiry = localStorage.getItem(STORAGE_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
}

export function usePromptForm(initialData?: PromptData) {
  const { user } = useAuth();
  const [data, setData] = useState<PromptData>(
    initialData ?? DEFAULT_PROMPT_DATA
  );
  const [previousLevel, setPreviousLevel] = useState(1);
  const [leveledUp, setLeveledUp] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load from localStorage on mount for anon users
  useEffect(() => {
    if (!user && !initialData) {
      const saved = loadFromLocalStorage();
      if (saved) {
        setData(saved);
      }
    }
  }, [user, initialData]);

  // Calculate XP
  const totalXP = calculateTotalXP(data);
  const currentLevel = getLevelForXP(totalXP).level;

  // Check for level up
  useEffect(() => {
    if (currentLevel > previousLevel && previousLevel > 0) {
      setLeveledUp(currentLevel);
    }
    setPreviousLevel(currentLevel);
  }, [currentLevel, previousLevel]);

  const updateField = useCallback(
    (key: PromptFieldKey, value: string) => {
      setData((prev) => {
        const next = { ...prev, [key]: value, xp_earned: 0 };
        next.xp_earned = calculateTotalXP(next);

        // Auto-save to localStorage for anon users
        if (!user) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            saveToLocalStorage(next);
          }, 500);
        }

        return next;
      });
    },
    [user]
  );

  const updateName = useCallback((name: string) => {
    setData((prev) => ({ ...prev, name }));
  }, []);

  const resetForm = useCallback(() => {
    setData(DEFAULT_PROMPT_DATA);
    if (!user) {
      clearAnonStorage();
    }
  }, [user]);

  const dismissLevelUp = useCallback(() => {
    setLeveledUp(null);
  }, []);

  return {
    data: { ...data, xp_earned: totalXP },
    totalXP,
    currentLevel,
    leveledUp,
    updateField,
    updateName,
    resetForm,
    setData,
    dismissLevelUp,
  };
}
