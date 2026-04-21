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

    // প্রজেক্ট এবং তার DEK খুঁজে বের করা
    const project = await Project.findOne({ _id: resolvedParams.id, owner: (session.user as any).id });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // প্রজেক্টের সব ভেরিয়েবল ফেচ করা
    const variables = await Variable.find({ projectId: resolvedParams.id });

    // .env ফাইলের কন্টেন্ট তৈরি করা
    let envContent = `# EnvVault Export - Project: ${project.name}\n`;
    envContent += `# Generated on: ${new Date().toLocaleString()}\n\n`;

    variables.forEach((variable) => {
      const decryptedValue = decrypt(
        variable.encryptedValue,
        project.encryptedDEK,
        variable.iv,
        variable.authTag
      );
      
      if (variable.description) {
        envContent += `# ${variable.description}\n`;
      }
      envContent += `${variable.key}=${decryptedValue}\n\n`;
    });

    // ফাইল হিসেবে রেসপন্স পাঠানো
    return new NextResponse(envContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${project.name.replace(/\s+/g, "_")}.env"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to export .env file" }, { status: 500 });
  }
}