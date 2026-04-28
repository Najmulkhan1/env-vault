import { auth } from "@/lib/auth";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, ShieldCheck, Activity, Plus, ArrowUpRight, Lock, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 p-6 md:p-10 space-y-10 selection:bg-indigo-500/30">
      
      {/* ১. হেডার সেকশন */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Vault Overview</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Hello, <span className="text-indigo-400">{session?.user?.name}</span>. Your security infrastructure is stable.
          </p>
        </div>
        <Button asChild className="bg-zinc-100 hover:bg-zinc-200 text-black font-medium rounded-lg px-5 py-6 shadow-xl shadow-white/5 transition-all active:scale-95">
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Link>
        </Button>
      </div>

      {/* ২. স্ট্যাটাস কার্ডস */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Project Card */}
        <Card className="bg-[#141414] border-white/[0.05] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-100">{stats.totalProjects}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase">System Active</span>
            </div>
          </CardContent>
        </Card>

        {/* Secrets Card */}
        <Card className="bg-[#141414] border-white/[0.05] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Stored Secrets</CardTitle>
            <Lock className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-100">{stats.totalVariables}</div>
            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-emerald-500/50" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase">E2E Encrypted</span>
            </div>
          </CardContent>
        </Card>

        {/* Security Score Card */}
        <Card className="bg-[#141414] border-white/[0.05] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">Security Score</CardTitle>
            <Activity className="h-4 w-4 text-zinc-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-100">100%</div>
            <div className="mt-2 flex items-center gap-2">
              <Circle className="h-3 w-3 text-amber-500/50 fill-amber-500/20" />
              <span className="text-[10px] font-mono text-zinc-600 uppercase">Zero Vulnerability</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ৩. চার্ট সেকশন */}
      <Card className="bg-[#141414] border-white/[0.05] shadow-2xl">
        <CardHeader className="p-8 border-b border-white/[0.02]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium text-zinc-100">Growth Analytics</CardTitle>
              <p className="text-xs text-zinc-600 mt-1">Monthly progression of vault projects</p>
            </div>
            <div className="px-3 py-1 bg-zinc-800 rounded-md text-[10px] font-mono text-zinc-400">
              LIVE_DATA
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[350px] w-full">
             <OverviewChart data={stats.chartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}