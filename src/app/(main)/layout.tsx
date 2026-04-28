"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, Settings, Lock, ShieldCheck } from "lucide-react";
import { SidebarLogout } from "@/components/shared/Sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="px-3 space-y-1.5 py-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
              isActive
                ? "bg-white/[0.03] text-indigo-400"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]"
            )}
          >
            {/* Active Indicator Pin */}
            {isActive && (
              <motion.div 
                layoutId="activeNav"
                className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full"
              />
            )}
            
            <Icon className={cn(
              "w-4 h-4 shrink-0 transition-colors",
              isActive ? "text-indigo-400" : "group-hover:text-zinc-200"
            )} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-400">
      {/* ───── Sidebar ───── */}
      <aside className="w-64 border-r border-white/[0.05] bg-[#0a0a0a] hidden md:flex flex-col sticky top-0 h-screen">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="bg-indigo-600/10 p-2 rounded-lg">
            <Lock className="w-5 h-5 text-indigo-500" />
          </div>
          <Link href="/" className="font-bold text-lg tracking-tighter text-zinc-100 hover:text-indigo-400 transition-colors">
            EnvVault
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-2">Main Menu</p>
          </div>
          <SidebarNav />
        </div>

        {/* User / Status Info (Optional UI addition) */}
        <div className="px-6 py-4 mx-4 mb-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Vault Secure</span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-500/50" />
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/[0.05] shrink-0 bg-white/[0.01]">
          <SidebarLogout />
        </div>
      </aside>

      {/* ───── Main Content ───── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        <header className="h-16 border-b border-white/[0.05] flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
              Secure_Session_Active
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* আপনি এখানে নোটিফিকেশন বা ইউজার প্রোফাইল আইকন দিতে পারেন */}
             <div className="text-[10px] font-mono text-zinc-600 border border-white/5 px-2 py-1 rounded bg-white/[0.02]">
               v2.0.4-stable
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}