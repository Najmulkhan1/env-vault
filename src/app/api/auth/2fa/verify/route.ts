import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import speakeasy from "speakeasy";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = await req.json();
    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: "2FA not initiated" }, { status: 400 });
    }

    // টোকেনটি ভেরিফাই করা [cite: 56, 120]
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      user.twoFactorEnabled = true; // ২-ফ্যাক্টর এনাবল করা হলো [cite: 83]
      await user.save();
      return NextResponse.json({ message: "2FA enabled successfully" });
    } else {
      return NextResponse.json({ error: "Invalid OTP token" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}