"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/client";
import { CARD, INPUT, LABEL } from "@/components/app/ui";

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,20}$/;

export default function ProfileForm({
  currentUsername,
  currentFullName,
}: {
  currentUsername: string;
  currentFullName: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(currentUsername);
  const [fullName, setFullName] = useState(currentFullName);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedUsername = username.trim();
    const trimmedFullName = fullName.trim();

    if (!USERNAME_PATTERN.test(trimmedUsername)) {
      toast.error("Username: 3-20 characters, letters/numbers/_ . -");
      return;
    }
    if (trimmedFullName.length > 50) {
      toast.error("Display name must be 50 characters or fewer");
      return;
    }
    if (trimmedUsername === currentUsername && trimmedFullName === currentFullName) return;

    setSaving(true);
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const { error } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, username: trimmedUsername, full_name: trimmedFullName || null },
          { onConflict: "id" },
        );

      if (error) {
        if (error.code === "23505") {
          toast.error("That username is already taken");
          return;
        }
        throw error;
      }

      toast.success("Profile saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${CARD} mt-3 space-y-4 p-5 sm:p-6`}>
      <div className="grid gap-2">
        <label htmlFor="full-name" className={LABEL}>
          Display name
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Habeeb"
          className={INPUT}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="username" className={LABEL}>
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. habeeb"
          autoComplete="username"
          className={INPUT}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
