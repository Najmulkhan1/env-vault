import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Variable from "@/models/Variable";

// ১. এডিট বা আপডেট করার API
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const resolvedParams = await params;
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description } = await req.json();
    await dbConnect();

    // শুধুমাত্র প্রজেক্টের মালিকই যেন আপডেট করতে পারে
    const updatedProject = await Project.findOneAndUpdate(
      { _id: resolvedParams.id, owner: (session.user as any).id },
      { name, description },
      { new: true }
    );

    if (!updatedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ২. ডিলিট করার API
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const resolvedParams = await params;
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    // প্রজেক্ট ডিলিট করা
    const deletedProject = await Project.findOneAndDelete({ _id: resolvedParams.id, owner: (session.user as any).id });
    
    if (!deletedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // প্রজেক্টের সাথে সংশ্লিষ্ট সব ভেরিয়েবলও ডিলিট করে দেওয়া
    await Variable.deleteMany({ projectId: resolvedParams.id });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}