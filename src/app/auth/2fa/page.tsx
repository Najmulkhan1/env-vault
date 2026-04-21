"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

function TwoFactorContent() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) router.push("/auth/login");
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ১. ওটিপি ভেরিফাই করার এপিআই কল
      const res = await fetch("/api/auth/2fa/verify-login", {
        method: "POST",
        body: JSON.stringify({ email, token: code }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        // ২. ওটিপি সঠিক হলে NextAuth সেশন কনফার্ম করা
        const result = await signIn("credentials", {
          email,
          is2FAVerified: "true", // auth.ts কে সেশন দিতে বাধ্য করবে
          redirect: false,
        });

        if (result?.ok) {
          toast.success("Login successful!");
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error("Session creation failed.");
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Invalid code.");
      }
    } catch (err) {
      toast.error("An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Security Verification</CardTitle>
          <CardDescription>Enter the 6-digit code for <strong>{email}</strong></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <Input
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="text-center text-3xl font-bold tracking-[0.5rem] h-16"
              autoFocus
              required
            />
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading || code.length !== 6}>
              {loading ? <Loader2 className="animate-spin" /> : "Verify and Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-primary">Loading...</div>}>
      <TwoFactorContent />
    </Suspense>
  );
}