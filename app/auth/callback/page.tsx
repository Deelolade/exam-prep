"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@/lib/client";

/**
 * OAuth callback (Google, etc.). Must run in the browser: the PKCE code
 * verifier was stored client-side by signInWithOAuth, so a server-side
 * exchange would fail. The session is written to cookies by
 * @supabase/ssr's browser client, so the app picks it up afterwards.
 */
function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const code = searchParams.get("code");
    const nextParam = searchParams.get("next");
    const next = nextParam?.startsWith("/") ? nextParam : "/dashboard";

    const run = async () => {
      if (!code) {
        router.replace(
          `/auth/error?error=${encodeURIComponent("No authorization code provided")}`,
        );
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        router.replace(`/auth/error?error=${encodeURIComponent(error.message)}`);
        return;
      }

      router.replace(next);
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <p className="text-sm text-slate-500">Completing sign-in&hellip;</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6">
          <p className="text-sm text-slate-500">Completing sign-in&hellip;</p>
        </div>
      }
    >
      <OAuthCallbackHandler />
    </Suspense>
  );
}
