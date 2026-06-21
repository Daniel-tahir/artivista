import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const TIMEOUT_CHECK_INTERVAL_MS = 30 * 1000;
const LAST_ACTIVITY_KEY = "artivistaa_admin_last_activity";

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;

function getStoredLastActivity(): number {
  const stored = localStorage.getItem(LAST_ACTIVITY_KEY);
  return stored ? Number(stored) : Date.now();
}

function setStoredLastActivity(timestamp: number): void {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const lastActivityRef = useRef<number>(getStoredLastActivity());

  useEffect(() => {
    const updateActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      setStoredLastActivity(now);
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= SESSION_TIMEOUT_MS) {
        await supabase.auth.signOut();
      }
    }, TIMEOUT_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          await supabase.auth.signOut();
          return;
        }
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= SESSION_TIMEOUT_MS) {
          await supabase.auth.signOut();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return;
      if (user) {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= SESSION_TIMEOUT_MS) {
          supabase.auth.signOut();
          return;
        }
      }
      setIsAuthenticated(!!user);
    }).catch(() => {
      if (!cancelled) setIsAuthenticated(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        setIsAuthenticated(!!session?.user);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { isAuthenticated, login, logout };
}
