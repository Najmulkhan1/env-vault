import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Variable from "@/models/Variable";
import Project from "@/models/Project";
import { encrypt } from "@/lib/encryption";

// ১. Variable Delete korar API
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const resolvedParams = await params;
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const variable = await Variable.findById(resolvedParams.id);
    if (!variable) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Malikana jachai kora
    const project = await Project.findOne({ _id: variable.projectId, owner: (session.user as any).id });
    if (!project) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    await Variable.findByIdAndDelete(resolvedParams.id);
    await Project.findByIdAndUpdate(variable.projectId, { $inc: { variableCount: -1 } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// ২. Variable Edit/Update korar API
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const resolvedParams = await params;
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { key, value } = await req.json();
    await dbConnect();

    const variable = await Variable.findById(resolvedParams.id);
    if (!variable) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const project = await Project.findOne({ _id: variable.projectId, owner: (session.user as any).id });
    if (!project) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    let updateData: any = { key };

    // যদি নতুন ভ্যালু পাঠানো হয়, তবে সেটি এনক্রিপ্ট করুন
    if (value) {
      const { encryptedValue, iv, authTag } = encrypt(value, project.encryptedDEK);
      updateData.encryptedValue = encryptedValue;
      updateData.iv = iv;
      updateData.authTag = authTag;
    }

    const updated = await Variable.findByIdAndUpdate(resolvedParams.id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}