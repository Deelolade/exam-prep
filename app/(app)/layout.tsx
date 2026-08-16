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

  return <AppShell userEmail={user.email ?? undefined}>{children}</AppShell>;
}
