"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiBookOpen,
  FiEdit3,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiTrendingUp,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import type { IconType } from "react-icons";

type BaseNavItem = { href: string; label: string; icon: IconType };

type NavItem = BaseNavItem & { shortLabel: string };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Dashboard", icon: FiGrid },
  { href: "/exams", label: "My Exams", shortLabel: "Exams", icon: FiBookOpen },
  { href: "/practice", label: "Practice", shortLabel: "Practice", icon: FiEdit3 },
  { href: "/progress", label: "Progress", shortLabel: "Progress", icon: FiTrendingUp },
  { href: "/insights", label: "AI Insights", shortLabel: "Insights", icon: FiZap },
  { href: "/profile", label: "Profile", shortLabel: "Profile", icon: FiUser },
];

const SETTINGS: BaseNavItem = { href: "/settings", label: "Settings", icon: FiSettings };

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ item, active }: { item: BaseNavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-white/[0.08] text-white"
          : "text-white/55 hover:text-white hover:bg-white/[0.04]",
      )}
    >
      <Icon className={cn("w-4 h-4 shrink-0", active && "text-primary")} aria-hidden="true" />
      {item.label}
      {active && <span className="ml-auto w-1 h-4 rounded-full bg-primary" aria-hidden="true" />}
    </Link>
  );
}

/** Desktop sidebar — fixed on the left (lg and up). */
function DesktopSidebar({
  pathname,
  userEmail,
  userName,
}: {
  pathname: string;
  userEmail?: string;
  userName?: string;
}) {
  const router = useRouter();
  const initials = (userName ?? userEmail ?? "?")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <span className="text-[17px] font-semibold tracking-tight text-white">
          ExamPrep<span className="text-primary">.run</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <div className="px-3 pb-4">
        <NavLink
          item={SETTINGS}
          active={isActive(pathname, SETTINGS.href)}
        />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[13px] font-semibold text-primary hover:bg-primary/30 transition"
          >
            {initials}
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">
              {userName ?? userEmail ?? "Account"}
            </p>
            <p className="text-[11px] text-white/40">Signed in</p>
          </div>
          <button
            onClick={logout}
            aria-label="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition"
          >
            <FiLogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Mobile bottom navigation — fixed footer bar (below lg). */
function BottomNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition",
                active ? "text-primary" : "text-slate-500 hover:text-slate-700",
              )}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {item.shortLabel}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function AppShell({
  userEmail,
  userName,
  children,
}: {
  userEmail?: string;
  userName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-svh bg-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-dark lg:block">
        <DesktopSidebar pathname={pathname} userEmail={userEmail} userName={userName} />
      </aside>

      {/* Mobile topbar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-dark px-4 lg:hidden">
        <span className="text-[16px] font-semibold tracking-tight text-white">
          ExamPrep<span className="text-primary">.run</span>
        </span>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] transition"
        >
          <FiSettings className="w-5 h-5" aria-hidden="true" />
        </Link>
      </header>

      {/* Mobile bottom nav */}
      <BottomNav pathname={pathname} />

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-8 pb-28 sm:px-6 lg:px-10 lg:pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
