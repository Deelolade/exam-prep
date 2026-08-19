import { redirect } from "next/navigation";
import { FiCalendar, FiMail } from "react-icons/fi";

import { createClient } from "@/lib/server";
import ProfileForm from "@/components/app/profile-form";
import ChangePasswordForm from "@/components/app/change-password-form";
import { CARD, SECTION_TITLE } from "@/components/app/ui";
import { formatDate } from "@/data/study";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  let profile: {
    username: string | null;
    full_name: string | null;
    created_at: string | null;
  } | null = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name, created_at")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  } catch {
    profile = null;
  }

  const displayName = profile?.full_name ?? profile?.username ?? "";
  const initials = (displayName || user.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your account details, profile name, and security.
        </p>
      </div>

      <section>
        <h2 className={SECTION_TITLE}>Account</h2>
        <div className={`${CARD} mt-3 p-5 sm:p-6`}>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-dark">
                {displayName || "Set a display name"}
              </p>
              <div className="mt-1 space-y-0.5 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <FiMail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {user.email}
                </p>
                <p className="flex items-center gap-2">
                  <FiCalendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {profile?.created_at
                    ? `Member since ${formatDate(profile.created_at.slice(0, 10))}`
                    : "Member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className={SECTION_TITLE}>Profile</h2>
        <ProfileForm
          currentUsername={profile?.username ?? ""}
          currentFullName={profile?.full_name ?? ""}
        />
      </section>

      <section>
        <h2 className={SECTION_TITLE}>Security</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
