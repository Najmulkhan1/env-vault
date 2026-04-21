import Link from "next/link";
import { LayoutDashboard, FolderOpen, Settings, Lock } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* সাইডবার - এখান থেকেই আপনি Phase 3 এর আউটপুট দেখতে পাবেন */}
      <aside className="w-64 border-r bg-muted/20 hidden md:block">
        <div className="p-6 flex items-center gap-2 font-bold text-xl">
          <Lock className="w-6 h-6 text-primary" />
          <span>EnvVault</span>
        </div>
        <nav className="px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/projects" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
            <FolderOpen className="w-4 h-4" />
            Projects
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* মেইন কন্টেন্ট এরিয়া */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b flex items-center px-8 bg-background/50 backdrop-blur">
          <span className="text-sm text-muted-foreground">Secure Environment Variable Vault</span>
        </header>
        <div className="p-0">
          {children}
        </div>
      </main>
    </div>
  );
}