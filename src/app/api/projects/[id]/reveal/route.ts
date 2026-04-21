import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Variable from "@/models/Variable";
import { decrypt } from "@/lib/encryption";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const resolvedParams = await params;
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    // ভেরিয়েবলটি খুঁজে বের করা
    const variable = await Variable.findById(resolvedParams.id);
    if (!variable) return NextResponse.json({ error: "Variable not found" }, { status: 404 });

    // প্রজেক্টের মালিকানা যাচাই করা
    const project = await Project.findOne({ _id: variable.projectId, owner: (session.user as any).id });
    if (!project) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    // সার্ভার সাইড ডিক্রিপশন 
    const decryptedValue = decrypt(
      variable.encryptedValue,
      project.encryptedDEK,
      variable.iv,
      variable.authTag
    );

    return NextResponse.json({ value: decryptedValue });
  } catch (error) {
    return NextResponse.json({ error: "Failed to decrypt" }, { status: 500 });
  }
}