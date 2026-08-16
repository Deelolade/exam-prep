import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type SearchParams = Promise<{ error?: string; code?: string }>

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const error = params.error ?? ''
  const isPkceVerifierMissing =
    params.code === 'pkce_code_verifier_not_found' || error.includes('PKCE code verifier')

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isPkceVerifierMissing ? 'Link cannot be verified' : 'Sorry, something went wrong.'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPkceVerifierMissing ? (
              <div className="space-y-4">
                <CardDescription className="text-sm leading-6">
                  This link only works in the browser where you signed up, because it is tied to
                  that browser for security. Open it in the same browser you used to create your
                  account (no incognito or private window), or request a new confirmation email
                  and click the fresh link.
                </CardDescription>
                <Link
                  href="/auth/login"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition"
                >
                  Go to sign in
                </Link>
              </div>
            ) : error ? (
              <p className="text-sm text-muted-foreground">Code error: {error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
