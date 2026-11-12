"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  /** Route to go to when there is no previous page in history. */
  fallbackHref: string;
  label?: string;
  className?: string;
  /** Icon-only (no label) — used in the mobile top bar. */
  iconOnly?: boolean;
  /** Color treatment for dark surfaces (e.g. the navy top bar). */
  variant?: "light" | "dark";
};

export default function BackButton({
  fallbackHref,
  label = "Back",
  className,
  iconOnly = false,
  variant = "light",
}: BackButtonProps) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.replace(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition",
        iconOnly ? "h-9 w-9" : "h-9 px-2.5",
        variant === "dark"
          ? "text-white/60 hover:text-white hover:bg-white/10"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
        className,
      )}
    >
      <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
      {!iconOnly && label}
    </button>
  );
}
