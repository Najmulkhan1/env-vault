import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    // ১. একটি নতুন TOTP সিক্রেট তৈরি করা [cite: 56]
    const secret = speakeasy.generateSecret({
      name: `EnvVault:${session.user.email}`,
    });

    // ২. কিউআর কোড জেনারেট করা [cite: 56, 79]
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // ৩. টেম্পোরারি সিক্রেটটি ডাটাবেসে সেভ করা (ভেরিফাই হওয়ার আগ পর্যন্ত) [cite: 83]
    await User.findByIdAndUpdate(session.user.id, {
      twoFactorSecret: secret.base32,
    });

    return NextResponse.json({ qrCodeUrl, secret: secret.base32 });
  } catch (error) {
    return NextResponse.json({ error: "2FA setup failed" }, { status: 500 });
  }
}