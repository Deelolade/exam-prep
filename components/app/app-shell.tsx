"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiBookOpen,
  FiEdit3,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiTrendingUp,
  FiX,
  FiZap,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/exams", label: "My Exams", icon: FiBookOpen },
  { href: "/practice", label: "Practice", icon: FiEdit3 },
  { href: "/progress", label: "Progress", icon: FiTrendingUp },
  { href: "/insights", label: "AI Insights", icon: FiZap },
];

const SETTINGS = { href: "/settings", label: "Settings", icon: FiSettings };

type NavItem = (typeof NAV)[number];

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
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

function SidebarContent({
  pathname,
  userEmail,
  onNavigate,
}: {
  pathname: string;
  userEmail?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const initials = (userEmail ?? "?")
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
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="px-3 pb-4">
        <NavLink
          item={SETTINGS}
          active={pathname === SETTINGS.href || pathname.startsWith(`${SETTINGS.href}/`)}
          onNavigate={onNavigate}
        />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[13px] font-semibold text-primary">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{userEmail ?? "Account"}</p>
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

export default function AppShell({
  userEmail,
  children,
}: {
  userEmail?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-svh bg-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-dark lg:block">
        <SidebarContent pathname={pathname} userEmail={userEmail} />
      </aside>

      {/* Mobile topbar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-dark px-4 lg:hidden">
        <span className="text-[16px] font-semibold tracking-tight text-white">
          ExamPrep<span className="text-primary">.run</span>
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] transition"
        >
          <FiMenu className="w-5 h-5" aria-hidden="true" />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-dark shadow-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:text-white transition"
            >
              <FiX className="w-4 h-4" aria-hidden="true" />
            </button>
            <SidebarContent
              pathname={pathname}
              userEmail={userEmail}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
