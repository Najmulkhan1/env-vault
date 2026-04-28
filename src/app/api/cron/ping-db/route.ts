import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";

// এই route শুধুমাত্র Vercel Cron Job থেকে আসা request accept করবে
export async function GET(req: NextRequest) {
  // Vercel Cron authorization header চেক করা
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    // MongoDB-তে একটি lightweight ping পাঠানো
    const { connection } = await import("mongoose");
    await connection.db?.admin().ping();

    const timestamp = new Date().toISOString();
    console.log(`[Cron] MongoDB ping successful at ${timestamp}`);

    return NextResponse.json({
      success: true,
      message: "MongoDB is alive",
      timestamp,
    });
  } catch (error) {
    console.error("[Cron] MongoDB ping failed:", error);
    return NextResponse.json(
      { success: false, error: "Ping failed" },
      { status: 500 }
    );
  }
}
