import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Variable from "@/models/Variable";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const userId = (session.user as any).id;

    // ১. মোট প্রজেক্ট এবং ভেরিয়েবল কাউন্ট
    const totalProjects = await Project.countDocuments({ owner: userId });
    
    // সব প্রজেক্টের ভেরিয়েবল কাউন্ট যোগ করা
    const projectStats = await Project.find({ owner: userId }, "variableCount");
    const totalVariables = projectStats.reduce((acc, p) => acc + (p.variableCount || 0), 0);

    // ২. চার্টের জন্য স্যাম্পল ডেটা (বাস্তব ক্ষেত্রে এটি অ্যাক্টিভিটি লগ থেকে আসবে)
    const chartData = [
      { name: "Jan", count: 4 },
      { name: "Feb", count: 7 },
      { name: "Mar", count: 5 },
      { name: "Apr", count: totalProjects }, // বর্তমান মাসের ডেটা
    ];

    return NextResponse.json({
      totalProjects,
      totalVariables,
      chartData
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}