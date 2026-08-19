import { NextResponse, type NextRequest } from "next/server";

/**
 * Compatibility bridge: if Supabase is still configured to redirect OAuth to
 * /api/auth/callback, forward to the client-side callback page (query params
 * preserved) where the PKCE code exchange can actually run in the browser.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/callback";
  return NextResponse.redirect(url);
}
