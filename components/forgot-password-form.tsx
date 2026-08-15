'use client'

import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FIELD_CLASSES =
  'h-11 rounded-lg border-slate-200 bg-white px-3.5 text-[14px] focus-visible:border-primary focus-visible:ring-primary/30'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/confirm?next=/auth/update-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {success ? (
        <>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-dark">Check your email</h2>
          <p className="text-sm leading-relaxed text-slate-500 mt-1.5 mb-8">
            If you registered using your email and password, you will receive a password reset email
            with instructions.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full h-11 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-dark hover:bg-slate-50 transition"
          >
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-dark">Reset your password</h2>
          <p className="text-sm text-slate-500 mt-1.5 mb-8">
            Type in your email and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[13px] font-medium text-dark">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={FIELD_CLASSES}
              />
            </div>

            {error && <p className="text-[13px] text-red-500">{error}</p>}

            <Button type="submit" className="w-full h-11 rounded-lg text-sm font-semibold" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send reset email'}
            </Button>
          </form>

          <p className="text-center text-[13.5px] text-slate-500 mt-7">
            Remembered it?{' '}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
