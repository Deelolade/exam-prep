"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RetryGenerateButton({ examId }: { examId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exams/${examId}/questions`, { method: "POST" });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(result?.error ?? "Failed to generate questions");
        return;
      }

      if (result?.count > 0) {
        toast.success(`${result.count} questions ready`);
        router.refresh();
      } else {
        toast.error("No questions could be generated");
      }
    } catch {
      toast.error("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRetry}
      disabled={loading}
      className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Generating..." : "Try again"}
    </button>
  );
}
