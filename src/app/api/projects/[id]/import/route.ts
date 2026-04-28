import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import Project from "@/models/Project";
import Variable from "@/models/Variable";
import { encrypt } from "@/lib/encryption";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;

    // Narrow session.user — TypeScript needs an explicit guard before accessing .id
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { envContent } = await req.json();
    await dbConnect();

    // Cast owner to ObjectId so MongoDB can match it correctly
    const project = await Project.findOne({
      _id: resolvedParams.id,
      owner: new mongoose.Types.ObjectId(userId),
    });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // ১. .env কন্টেন্ট পার্স করা (Regex ব্যবহার করে Key=Value আলাদা করা)
    const lines = envContent.split(/\r?\n/);
    const variablesToInsert = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      // কমেন্ট বা খালি লাইন বাদ দেওয়া
      if (!trimmedLine || trimmedLine.startsWith("#")) continue;

      const [key, ...valueParts] = trimmedLine.split("=");
      const value = valueParts.join("=").replace(/^["']|["']$/g, ""); // কোটেশন মার্ক রিমুভ করা

      if (key && value) {
        // ২. প্রতিটি ভ্যালু এনক্রিপ্ট করা
        const { encryptedValue, iv, authTag } = encrypt(value, project.encryptedDEK);
        
        variablesToInsert.push({
          projectId: project._id,
          key: key.trim(),
          encryptedValue,
          iv,
          authTag,
        });
      }
    }

    // ৩. ডাটাবেসে বাল্ক ইনসার্ট করা
    if (variablesToInsert.length > 0) {
      await Variable.insertMany(variablesToInsert);
      // প্রজেক্টের ভেরিয়েবল কাউন্ট আপডেট করা
      await Project.findByIdAndUpdate(resolvedParams.id, { 
        $inc: { variableCount: variablesToInsert.length } 
      });
    }

    return NextResponse.json({ message: `${variablesToInsert.length} variables imported` });
  } catch (error) {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}