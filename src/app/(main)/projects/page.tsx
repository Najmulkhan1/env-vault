import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Plus, Folder, Search, Filter, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ProjectListClient } from "@/components/projects/ProjectListClient";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  await dbConnect();
  const session = await auth();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const userId = (session.user as any).id as string;

  // ইউজারের সব প্রজেক্ট ডাটাবেস থেকে ফেচ করা
  const projectsData = await Project.find({ owner: userId }).sort({ createdAt: -1 });
  
  // Mongoose documents কে প্লেইন অবজেক্টে কনভার্ট করা
  const projects = JSON.parse(JSON.stringify(projectsData));

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 md:p-10 space-y-10">
      
      {/* ১. হেডার সেকশন */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Secure Storage</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">My Projects</h1>
          <p className="text-sm text-zinc-500">
            Total <span className="text-zinc-300">{projects.length}</span> projects secured in your vault.
          </p>
        </div>
        
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-6 py-6 shadow-xl shadow-indigo-600/10 transition-all active:scale-95 shrink-0">
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {/* ২. কন্টেন্ট সেকশন */}
      {projects.length === 0 ? (
        /* প্রিমিয়াম এম্পটি স্টেট */
        <div className="flex flex-col items-center justify-center py-32 border border-white/[0.05] border-dashed rounded-[2rem] bg-white/[0.01] backdrop-blur-sm">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 rounded-full" />
            <div className="relative bg-[#141414] border border-white/5 w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl">
              <Folder className="h-10 w-10 text-zinc-700" />
            </div>
          </div>
          
          <h2 className="text-xl font-medium text-zinc-200 tracking-tight">Your vault is empty</h2>
          <p className="text-zinc-500 max-w-[280px] text-center mt-3 text-sm leading-relaxed">
            Protect your sensitive environment variables by creating your first project container.
          </p>
          
          <Button variant="outline" className="mt-8 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 px-8 py-5" asChild>
            <Link href="/projects/new">
              Initialise First Project
            </Link>
          </Button>
        </div>
      ) : (
        /* সার্চ এবং ফিল্টারিং এর জন্য ক্লায়েন্ট কম্পোনেন্ট */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProjectListClient initialProjects={projects} />
        </div>
      )}

      {/* ৩. সিস্টেম ফুটার (Optional) */}
      <div className="pt-10 flex items-center justify-center gap-4">
        <div className="h-[1px] w-12 bg-white/[0.05]" />
        <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">End_of_List</span>
        <div className="h-[1px] w-12 bg-white/[0.05]" />
      </div>
    </div>
  );
}