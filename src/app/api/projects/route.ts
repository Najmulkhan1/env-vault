import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, tags, colorLabel } = await req.json();
    await dbConnect();

    // প্রজেক্টের জন্য একটি ইউনিক DEK জেনারেট করা
    const dek = crypto.randomBytes(32).toString("hex");

    // বাস্তব প্রজেক্টে এই DEK-কে ইউজারের পাসওয়ার্ড দিয়ে এনক্রিপ্ট করে সেভ করতে হয়
    // আপাতত আমরা সিম্পল রাখার জন্য সরাসরি সেভ করছি (যা পরে Phase 1-এ আপডেট হবে)
    const newProject = await Project.create({
      name,
      description,
      tags,
      colorLabel,
      owner: (session.user as any).id,
      encryptedDEK: dek, 
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// ইউজারের সব প্রজেক্ট লিস্ট করার জন্য GET মেথড 
export async function GET() {
  const session = await auth();
  if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const projects = await Project.find({ owner: (session.user as any).id }).sort({ createdAt: -1 });
  
  return NextResponse.json(projects);
}