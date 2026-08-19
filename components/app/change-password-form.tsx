"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/client";
import { CARD, INPUT, LABEL } from "@/components/app/ui";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success("Password updated");
      setPassword("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`${CARD} mt-3 space-y-4 p-5 sm:p-6`}>
      <div className="grid gap-2">
        <label htmlFor="new-password" className={LABEL}>
          New password
        </label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a new password"
          autoComplete="new-password"
          className={INPUT}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="confirm-password" className={LABEL}>
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat the new password"
          autoComplete="new-password"
          className={INPUT}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Updating..." : "Change password"}
      </button>
    </div>
  );
}
