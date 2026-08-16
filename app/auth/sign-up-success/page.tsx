import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-4 text-center pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-7 w-7 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m22 4-10 10.01-3-3"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Check your email
              </CardTitle>

              <CardDescription className="text-base leading-6">
                We&apos;ve sent a confirmation link to your email address.
                Click the link to verify your account and get started.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <Link
              href="/auth/login"
              className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition"
            >
              Continue to sign in
            </Link>

            <p className="text-center text-xs leading-5 text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or request
              another confirmation email.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
