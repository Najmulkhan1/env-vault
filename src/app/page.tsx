import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  ArrowRight, 
  LogOut,
  LayoutDashboard,
  Key,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Zap,
  Users
} from "lucide-react";
import { BsGithub } from "react-icons/bs";
import { auth } from "@/lib/auth"; // আপনার auth কনফিগারেশন পাথ অনুযায়ী চেক করুন
import LogoutButton from "@/components/shared/LogoutButton"; // একটি আলাদা ক্লায়েন্ট বাটন তৈরি করা ভালো

export default async function HomePage() {
  // ১. সার্ভার সাইড থেকেই সেশন চেক করা হচ্ছে
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* নেভিগেশন বার */}
      <header className="px-6 lg:px-12 h-18 flex items-center border-b border-white/5 backdrop-blur-xl sticky top-0 z-50 bg-[#020617]/80">
        <Link className="flex items-center gap-2.5 group" href="/">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white uppercase">EnvVault</span>
        </Link>

        <nav className="ml-auto flex gap-4 items-center">
          {session ? (
            <>
              <Link 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors" 
                href="/dashboard"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
              {/* লগআউট বাটনের জন্য আলাদা ক্লায়েন্ট কম্পোনেন্ট ব্যবহার করা নিরাপদ */}
              <LogoutButton /> 
            </>
          ) : (
            <>
              <Link className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white" href="/auth/login">
                Sign In
              </Link>
              <Button asChild size="sm" className="rounded-full bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* হিরো সেকশন */}
        <section className="relative overflow-hidden pt-20 pb-32 px-6">
          <div className="container mx-auto text-center relative z-10 space-y-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
              Master Your <span className="text-blue-500">Secrets.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
              Ditch the .env leaks. Manage and sync your environment variables with military-grade encryption.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-600/25 transition-transform hover:scale-105">
                <Link href={session ? "/dashboard" : "/auth/register"}>
                  {session ? "Go to Dashboard" : "Start Your Vault"}
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 font-bold">
                <BsGithub className="mr-2 h-6 w-6" /> Star on GitHub
              </Button>
            </div>

            {/* ড্যাশবোর্ড প্রিভিউ কার্ড */}
            <div className="mt-24 max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur-2xl opacity-15" />
              <div className="relative rounded-[1.5rem] border border-white/10 bg-[#0B0F1A] p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-blue-400">Vault Status: Encrypted</span>
                </div>
                
                <div className="space-y-3">
                  {['STRIPE_SECRET', 'DATABASE_URL', 'AWS_KEY'].map((key) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <Key className="h-4 w-4 text-slate-500" />
                        <span className="text-xs font-mono text-slate-300">{key}</span>
                      </div>
                      <div className="h-2 w-24 bg-white/10 rounded-full blur-[2px]" />
                      <CheckCircle2 className="h-4 w-4 text-blue-500/50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-slate-600 text-[10px] tracking-[0.2em] uppercase">
        &copy; 2026 ENV_VAULT_SYSTEMS // SECURE_DEPLOYMENT
      </footer>
    </div>
  );
}