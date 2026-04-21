import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import speakeasy from "speakeasy";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: "2FA not enabled" }, { status: 400 });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      // এখানে আপনি সেশন হ্যান্ডেল করার জন্য টোকেন বা কুকি সেট করতে পারেন
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}