import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { TwoFactorToggle } from "@/components/settings/TwoFactorToggle";
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm";
import { redirect } from "next/navigation";
import { UserCircle, Mail, AlertOctagon, ShieldCheck, Github, Info } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  
  // সেশন না থাকলে লগইন পেজে পাঠিয়ে দিবে
  if (!session || !session.user) redirect("/auth/login");

  await dbConnect();
  const user = await User.findById(session.user.id);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0a0a] p-6 md:p-10 text-zinc-200">
      <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* হেডার সেকশন */}
        <div className="flex items-center gap-4 border-b border-white/[0.05] pb-6">
          <div className="bg-[#141414] p-3 rounded-xl border border-white/[0.05] shadow-lg">
            <UserCircle className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Account Settings</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage your personal information and security preferences.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          
          {/* ১. প্রোফাইল ইনফরমেশন */}
          <div className="bg-[#141414] border border-white/[0.05] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-indigo-500/30 to-zinc-800 opacity-50" />
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-zinc-100">Profile Information</h2>
              <p className="text-sm text-zinc-500">Your basic account details and identity.</p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-white/[0.05] gap-2">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-5 w-5 text-zinc-600" />
                  <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Full Name</span>
                </div>
                <span className="text-zinc-200 font-medium">{user?.name}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-600" />
                  <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Email Address</span>
                </div>
                <span className="text-zinc-200 font-mono text-sm">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* ২. ২-ফ্যাক্টর অথেন্টিকেশন (2FA) */}
          <div className="bg-[#141414] border border-white/[0.05] rounded-2xl p-6 md:p-8 shadow-2xl">
             <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <div>
                  <h2 className="text-lg font-medium text-zinc-100">Two-Factor Authentication</h2>
                  <p className="text-sm text-zinc-500">Add an extra layer of security to your account.</p>
                </div>
             </div>
             <TwoFactorToggle isEnabled={user?.twoFactorEnabled} />
          </div>

          {/* ৩. পাসওয়ার্ড পরিবর্তন */}
          <div className="bg-[#141414] border border-white/[0.05] rounded-2xl p-6 md:p-8 shadow-2xl">
            {user?.oauthProvider ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] p-5 flex items-start gap-4">
                <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-500">Managed by OAuth Provider</h3>
                  <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                    You are authenticated via <strong className="text-zinc-200 capitalize">{user.oauthProvider}</strong>. 
                    Your password and authentication management is securely handled by your provider.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-zinc-100">Password Management</h2>
                  <p className="text-sm text-zinc-500">Update your password to keep your account secure.</p>
                </div>
                <PasswordChangeForm />
              </>
            )}
          </div>

          {/* ৪. ডেঞ্জার জোন */}
          <div className="mt-12 pt-8 border-t border-red-500/10">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertOctagon className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
              </div>
              <p className="text-sm text-zinc-500">
                Destructive actions that cannot be reversed. Please proceed with extreme caution.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/[0.02] p-5">
              <div>
                <p className="text-sm font-medium text-zinc-200">Delete Account</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-[280px]">
                  Permanently remove your account, all projects, and encrypted variables from the EnvVault servers.
                </p>
              </div>
              <button className="w-full sm:w-auto shrink-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 rounded-lg px-4 py-2 text-sm font-medium transition-all">
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}