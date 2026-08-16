import { redirect } from "next/navigation";
import { FiMail } from "react-icons/fi";

import { createClient } from "@/lib/server";
import { LogoutButton } from "@/components/logout-button";
import { CARD, SECTION_TITLE } from "@/components/app/ui";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-dark">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and study preferences.</p>
      </div>

      <section>
        <h2 className={SECTION_TITLE}>Account</h2>
        <div className={`${CARD} mt-3 p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                <FiMail className="w-4 h-4 text-primary" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-dark">{user.email}</p>
                <p className="text-[12px] text-slate-500">Signed in account</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </section>

      <section>
        <h2 className={SECTION_TITLE}>Study preferences</h2>
        <div className={`${CARD} mt-3 divide-y divide-slate-100`}>
          {[
            { label: "Daily study time", value: "30 minutes" },
            { label: "Study days", value: "Mon – Fri" },
            { label: "Current level", value: "Intermediate" },
            { label: "Active exam", value: "OOU PostUTME" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-slate-500">{row.label}</span>
              <span className="text-sm font-medium text-dark">{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
