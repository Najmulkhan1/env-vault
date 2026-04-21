import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, Zap, Globe, ExternalLink } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ১. নেভিগেশন বার */}
      <header className="px-6 lg:px-10 h-16 flex items-center border-b backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Lock className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tighter">EnvVault</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          {session ? (
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth/login">
                Login
              </Link>
              <Button asChild size="sm">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* ২. হিরো সেকশন */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-6">
          <div className="container mx-auto text-center space-y-6">
            <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium">
              Secure Variable Management for Developers
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Stop Leaking Your <span className="text-primary">.env</span> Files
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A centralized, end-to-end encrypted platform for developers to store, manage, and share project environment variables securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/auth/register">Start Your Vault</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                <ExternalLink className="mr-2 h-5 w-5" /> Star on GitHub
              </Button>
            </div>
          </div>
        </section>

        {/* ৩. ফিচার সেকশন */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 px-6">
          <div className="container mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-background shadow-sm border">
              <div className="p-3 bg-primary/10 rounded-full">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AES-256-GCM Encryption</h3>
              <p className="text-muted-foreground text-sm">
                Variable values are never stored in plaintext — not in the database, nor in logs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-background shadow-sm border">
              <div className="p-3 bg-primary/10 rounded-full">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Zero Friction</h3>
              <p className="text-muted-foreground text-sm">
                Add projects, manage variables, and export .env files in just two clicks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-background shadow-sm border">
              <div className="p-3 bg-primary/10 rounded-full">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Accessible Anywhere</h3>
              <p className="text-muted-foreground text-sm">
                Fully responsive UI that works from mobile to 4K displays.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ৪. ফুটার সেকশন */}
      <footer className="w-full py-6 px-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 EnvVault. Building trust through transparency and security.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">Terms</Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}