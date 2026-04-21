"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // ১. সাইন-ইন রিকোয়েস্ট পাঠানো
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // আমরা ম্যানুয়ালি রিডাইরেকশন হ্যান্ডেল করব
    });

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    // ২. চেক করা যে সাকসেস ইউআরএল-এ /auth/2fa আছে কিনা
    // যদি lib/auth.ts থেকে রিডাইরেক্ট ইউআরএল আসে, তার মানে 2FA অন আছে
    if (result?.url && result.url.includes("/auth/2fa")) {
      toast.info("Two-Factor Authentication required.");
      router.push(result.url); // ইউজারকে কোড ইনপুট পেজে পাঠাবে [cite: 97]
    } else {
      // ৩. যদি কোনো রিডাইরেক্ট না থাকে, তবে সরাসরি ড্যাশবোর্ডে [cite: 97]
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your vault.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking credentials..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}