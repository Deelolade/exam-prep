'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { FcGoogle } from 'react-icons/fc'
import { FiEye, FiEyeOff } from 'react-icons/fi'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FIELD_CLASSES =
  'h-11 rounded-lg border-slate-200 bg-white px-3.5 text-[14px] focus-visible:border-primary focus-visible:ring-primary/30'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (error) throw error
      // On success Supabase redirects to the OAuth provider; nothing to do here.
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <h2 className="font-sans text-2xl font-semibold tracking-tight text-dark">Create your account</h2>
      <p className="text-sm text-slate-500 mt-1.5 mb-8">
        Create an account to save your practice and track your progress.
      </p>

      <form onSubmit={handleSignUp} className="flex flex-col gap-5">
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

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-[13px] font-medium text-dark">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-lg border-slate-200 bg-white pl-3.5 pr-11 text-[14px] focus-visible:border-primary focus-visible:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? (
                <FiEyeOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <FiEye className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="repeat-password" className="text-[13px] font-medium text-dark">
            Repeat password
          </Label>
          <Input
            id="repeat-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className={FIELD_CLASSES}
          />
        </div>

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <Button type="submit" className="w-full h-11 rounded-lg text-sm font-semibold" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-slate-200" aria-hidden="true" />
        <span className="text-[12px] uppercase tracking-wider text-slate-400">or</span>
        <span className="flex-1 h-px bg-slate-200" aria-hidden="true" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading}
        className="w-full h-11 rounded-lg text-sm font-semibold bg-white"
      >
        <FcGoogle className="size-4.5" aria-hidden="true" />
        Sign up with Google
      </Button>

      <p className="text-center text-[13.5px] text-slate-500 mt-7">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
