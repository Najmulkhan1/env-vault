"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  QrCode,
  ShieldAlert
} from "lucide-react";

export function TwoFactorToggle({ isEnabled }: { isEnabled: boolean }) {
  const [step, setStep] = useState(isEnabled ? "enabled" : "idle");
  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const startSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (data.qrCodeUrl) {
        setQrCode(data.qrCodeUrl);
        setStep("setup");
      } else {
        toast.error("Failed to generate QR Code.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ token: otp }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Two-Factor Authentication is now active!");
        setStep("enabled");
      } else {
        toast.error("Invalid code. Please try again.");
      }
    } catch {
      toast.error("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Idle State (Not Enabled) */}
      {step === "idle" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/[0.05] bg-white/[0.02]">
          <div>
            <p className="text-sm font-medium text-zinc-200">Authenticator App</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm leading-relaxed">
              Use an app like Google Authenticator or Authy to generate temporary security codes.
            </p>
          </div>
          <Button 
            onClick={startSetup} 
            disabled={loading} 
            className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-6 shadow-lg shadow-indigo-500/20 transition-all"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Smartphone className="mr-2 h-4 w-4" />
            )}
            Set up 2FA
          </Button>
        </div>
      )}

      {/* 2. Setup State (QR & OTP Input) */}
      {step === "setup" && (
        <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.02] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            
            {/* QR Code Container */}
            <div className="shrink-0 p-3 bg-white rounded-xl shadow-xl border border-white/10">
              {qrCode ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCode} alt="2FA QR Code" className="w-36 h-36" />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center bg-zinc-100 rounded-lg">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                </div>
              )}
            </div>

            {/* Instructions & Input */}
            <div className="space-y-5 w-full">
              <div>
                <h4 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-indigo-400" />
                  1. Scan the QR Code
                </h4>
                <p className="text-xs text-zinc-500 mt-1.5">
                  Open your authenticator app and scan this QR code to add your EnvVault account.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-indigo-400" />
                  2. Enter Verification Code
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    placeholder="000000" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allows numbers
                    maxLength={6}
                    className="bg-[#0a0a0a] border-white/[0.05] text-center font-mono text-xl tracking-[0.5em] h-12 rounded-xl focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 text-zinc-200 placeholder:text-zinc-700 w-full sm:w-48 transition-all"
                  />
                  <Button 
                    onClick={verifySetup} 
                    disabled={loading || otp.length !== 6} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 rounded-xl px-8 transition-all"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Activate"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Enabled State */}
      {step === "enabled" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">2FA is Currently Active</p>
              <p className="text-[10px] font-mono text-emerald-500/70 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Maximum Security
              </p>
            </div>
          </div>
          
          <div className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
            PROTECTED
          </div>
        </div>
      )}
    </div>
  );
}