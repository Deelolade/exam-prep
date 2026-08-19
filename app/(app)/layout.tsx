import { redirect } from "next/navigation";

import { createClient } from "@/lib/server";
import AppShell from "@/components/app/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  let displayName: string | undefined;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name")
      .eq("id", user.id)
      .maybeSingle();
    displayName = data?.full_name ?? data?.username ?? undefined;
  } catch {
    displayName = undefined;
  }

  return (
    <AppShell userEmail={user.email ?? undefined} userName={displayName}>
      {children}
    </AppShell>
  );
}
