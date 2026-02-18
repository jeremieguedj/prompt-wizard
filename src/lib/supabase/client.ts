import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Disable Navigator Lock to prevent deadlocks in single-tab usage.
        // The default navigatorLock can cause auth operations (getSession,
        // signOut, onAuthStateChange) to timeout waiting 10s for a lock
        // that's held by another auth operation on the same page.
        lock: async <R>(_name: string, _acquireTimeout: number, fn: () => Promise<R>): Promise<R> => {
          return await fn();
        },
      },
    }
  );
}
