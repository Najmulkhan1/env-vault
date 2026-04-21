import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
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
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { key, value, description } = await req.json();
    await dbConnect();

    // প্রজেক্ট এবং তার DEK খুঁজে বের করা
    const project = await Project.findOne({ _id: resolvedParams.id, owner: (session.user as any).id });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // এনক্রিপশন সম্পন্ন করা
    const { encryptedValue, iv, authTag } = encrypt(value, project.encryptedDEK);

    const newVariable = await Variable.create({
      projectId: resolvedParams.id,
      key,
      encryptedValue,
      iv,
      authTag,
      description,
    });

    // প্রজেক্টের ভেরিয়েবল কাউন্ট আপডেট করা
    await Project.findByIdAndUpdate(resolvedParams.id, { $inc: { variableCount: 1 } });

    return NextResponse.json(newVariable, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add variable" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    // ভেরিয়েবল লিস্ট করার সময় ভ্যালুগুলো মাস্কড থাকবে
    const variables = await Variable.find({ projectId: resolvedParams.id }).select("-encryptedValue -iv -authTag");
    
    return NextResponse.json(variables);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch variables" }, { status: 500 });
  }
}