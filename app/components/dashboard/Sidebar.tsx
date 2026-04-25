"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/developer", label: "Developer", icon: Code2 },
  { href: "/dashboard/fraud-detection", label: "Fraud Detection System", icon: ShieldAlert },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl">
      <div className="flex flex-col w-full">
        <nav className="px-3 pt-6 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors " +
                  (active
                    ? "bg-violet-600/20 border border-violet-500/20 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/5")
                }
              >
                <Icon className={"w-4 h-4 " + (active ? "text-violet-200" : "text-slate-400")} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
