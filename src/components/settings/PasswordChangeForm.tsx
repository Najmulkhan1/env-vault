"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Lock, KeyRound, ShieldCheck } from "lucide-react";

export function PasswordChangeForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Password updated successfully!");
      (e.target as HTMLFormElement).reset();
    } else {
      const err = await res.json();
      toast.error(err.error || "Update failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5 max-w-md">
        
        {/* Current Password */}
        <div className="space-y-2.5">
          <label htmlFor="currentPassword" className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            Current Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
              id="currentPassword" 
              name="currentPassword" 
              type="password" 
              placeholder="••••••••"
              required 
              className="pl-10 bg-[#0a0a0a] border-white/[0.05] text-zinc-200 placeholder:text-zinc-700 h-11 rounded-xl focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2.5">
          <label htmlFor="newPassword" className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
            New Password
          </label>
          <div className="relative group">
            <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
            <Input 
              id="newPassword" 
              name="newPassword" 
              type="password" 
              placeholder="••••••••"
              required 
              className="pl-10 bg-[#0a0a0a] border-white/[0.05] text-zinc-200 placeholder:text-zinc-700 h-11 rounded-xl focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
            />
          </div>
        </div>
        
      </div>

      <div className="pt-2 border-t border-white/[0.05]">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 shadow-lg shadow-indigo-500/20 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Security...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Update Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}