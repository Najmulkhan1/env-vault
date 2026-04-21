import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    await dbConnect();

    // চেক করুন ইউজার আগে থেকেই আছে কিনা
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // পাসওয়ার্ড হ্যাশ করা [cite: 66]
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      passwordHash: hashedPassword,
      name
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}