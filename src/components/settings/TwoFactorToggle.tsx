"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";

export function TwoFactorToggle({ isEnabled }: { isEnabled: boolean }) {
  const [step, setStep] = useState(isEnabled ? "enabled" : "idle");
  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");

  const startSetup = async () => {
    const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
    const data = await res.json();
    if (data.qrCodeUrl) {
      setQrCode(data.qrCodeUrl);
      setStep("setup");
    }
  };

  const verifySetup = async () => {
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
  };

  return (
    <Card>
      <CardHeader><CardTitle>Two-Factor Authentication (2FA)</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {step === "idle" && (
          <Button onClick={startSetup}>Enable 2FA</Button>
        )}

        {step === "setup" && (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">Scan this QR code with Google Authenticator or Authy</p>
            {qrCode && <img src={qrCode} alt="2FA QR Code" className="border p-2 rounded" />}
            <Input 
              placeholder="Enter 6-digit code" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              maxLength={6}
            />
            <Button onClick={verifySetup} className="w-full">Verify and Activate</Button>
          </div>
        )}

        {step === "enabled" && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <span>● 2FA is Active</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}