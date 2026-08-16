'use client'

import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { type EmailOtpType } from '@supabase/supabase-js'

import { createClient } from '@/lib/client'

/**
 * Handles email links from Supabase (confirmation, magic link, password
 * recovery). Runs in the browser because the PKCE code verifier lives in
 * client storage — a server-side exchange would fail with a missing-verifier
 * error. The `createBrowserClient` from `@supabase/ssr` writes the session to
 * cookies, so middleware and server components pick it up afterwards.
 */
function ConfirmHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current) return
    attempted.current = true

    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const code = searchParams.get('code')
    const nextParam = searchParams.get('next')
    const next = nextParam?.startsWith('/') ? nextParam : '/'

    const supabase = createClient()

    const fail = (message: string, code?: string) =>
      router.replace(
        `/auth/error?error=${encodeURIComponent(message)}${code ? `&code=${encodeURIComponent(code)}` : ''}`,
      )

    const run = async () => {
      if (tokenHash && type) {
        // Email OTP flow (token_hash + type in the link).
        const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
        if (error) return fail(error.message, error.code)
        router.replace(next)
        return
      }

      if (code) {
        // PKCE flow (code in the link).
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) return fail(error.message, error.code)
        router.replace(next)
        return
      }

      fail('No token hash or type')
    }

    run()
  }, [router, searchParams])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <p className="text-sm text-slate-500">Verifying your account&hellip;</p>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6">
          <p className="text-sm text-slate-500">Verifying your account&hellip;</p>
        </div>
      }
    >
      <ConfirmHandler />
    </Suspense>
  )
}
