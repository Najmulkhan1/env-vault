import { auth } from "@/lib/auth";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ShieldCheck, Activity } from "lucide-react";

import dbConnect from "@/lib/db";
import Project from "@/models/Project";

async function getStats(userId: string) {
  await dbConnect();
  
  const totalProjects = await Project.countDocuments({ owner: userId });
  const projectStats = await Project.find({ owner: userId }, "variableCount");
  const totalVariables = projectStats.reduce((acc, p) => acc + (p.variableCount || 0), 0);

  const chartData = [
    { name: "Jan", count: 4 },
    { name: "Feb", count: 7 },
    { name: "Mar", count: 5 },
    { name: "Apr", count: totalProjects },
  ];

  return { totalProjects, totalVariables, chartData };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) return null;

  const stats = await getStats((session.user as any).id);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session?.user?.name}. Here is your vault overview.</p>
      </div>

      {/* ১. স্ট্যাটাস কার্ডস */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stored Secrets</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVariables}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
          </CardContent>
        </Card>
      </div>

      {/* ২. চার্ট সেকশন */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <OverviewChart data={stats.chartData} />
        </CardContent>
      </Card>
    </div>
  );
}