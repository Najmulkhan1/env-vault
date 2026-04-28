import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { ProjectSettingsForm } from "@/components/projects/ProjectSettingsForm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/login");

  await dbConnect();
  const { id } = await params;
  const project = await Project.findOne({ _id: id, owner: session.user.id });

  if (!project) notFound();

  // ডিফল্ট কালার হিসেবে ইন্ডিগো সেট করা হলো
  const activeColor = project.colorLabel || "#6366f1";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0a0a] p-6 md:p-10 text-zinc-200">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ১. ব্যাক বাটন */}
        <Link
          href={`/projects/${id}`}
          className="group inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to {project.name}
        </Link>

        {/* ২. হেডার সেকশন */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-4">
            <div className="bg-[#141414] p-3 rounded-xl border border-white/[0.05] shadow-lg">
              <Settings className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Project Settings</h1>
              <div className="text-sm text-zinc-500 mt-1.5 flex items-center gap-2.5">
                <span>Configuration for <span className="font-mono text-zinc-300">{project.name}</span></span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                
                {/* Glowing Color Indicator */}
                <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-white/20" 
                    style={{ 
                      backgroundColor: activeColor,
                      boxShadow: `0 0 12px ${activeColor}80` // কালারের ওপর ভিত্তি করে ডায়নামিক গ্লো
                    }} 
                  />
                  Label
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ৩. ফর্ম সেকশন */}
        <div className="bg-[#141414] border border-white/[0.05] rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {/* Top subtle gradient line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-indigo-500/30 to-zinc-800 opacity-50" />
          
          <ProjectSettingsForm
            projectId={project._id.toString()}
            projectName={project.name}
            projectDesc={project.description || ""}
            projectColor={activeColor}
          />
        </div>
        
        {/* ৪. ডেঞ্জার জোন টিজ (Optional UI hint) */}
        <div className="text-center pt-8">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
              Secure Environment • Restricted Access
            </p>
        </div>
      </div>
    </div>
  );
}