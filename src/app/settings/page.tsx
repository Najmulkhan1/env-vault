import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TwoFactorToggle } from "@/components/settings/TwoFactorToggle"; // আগের ধাপে তৈরি করা
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm"; // নিচে দিচ্ছি
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  
  // সেশন না থাকলে লগইন পেজে পাঠিয়ে দিবে
  if (!session || !session.user) redirect("/auth/login");

  await dbConnect();
  const user = await User.findById(session.user.id);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your security preferences and account details.</p>
      </div>

      <div className="grid gap-8">
        {/* ১. প্রোফাইল ইনফরমেশন (Static View) */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your basic account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <span className="text-sm font-medium">Name</span>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* ২. ২-ফ্যাক্টর অথেন্টিকেশন (2FA) */}
        <TwoFactorToggle isEnabled={user?.twoFactorEnabled} />

        {/* ৩. পাসওয়ার্ড পরিবর্তন (শুধু ক্রেডেনশিয়াল ইউজারদের জন্য) */}
        {user?.oauthProvider ? (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">
                You are logged in via <strong>{user.oauthProvider}</strong>. Password management is handled by your provider.
              </p>
            </CardContent>
          </Card>
        ) : (
          <PasswordChangeForm />
        )}

        {/* ৪. ডেঞ্জার জোন (PRD অনুযায়ী) */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Actions that cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <button className="text-sm font-medium text-red-600 hover:underline">
              Delete your EnvVault account
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}