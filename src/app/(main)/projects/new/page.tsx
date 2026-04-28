"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, FolderPlus, ArrowLeft, TerminalSquare } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      tags: (formData.get("tags") as string)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean), // Empty tag রিমুভ করার জন্য
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Project initialized successfully!");
      router.push("/projects");
      router.refresh();
    } else {
      toast.error("Failed to create project infrastructure");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0a0a0a] p-6 md:p-10 text-zinc-200">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ১. ব্যাক বাটন এবং হেডার */}
        <div className="space-y-6">
          <Link 
            href="/projects" 
            className="group inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                <FolderPlus className="h-5 w-5 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Create Project</h1>
            </div>
            <p className="text-zinc-500 text-sm ml-12">
              Initialize a new secure container for your environment variables.
            </p>
          </div>
        </div>

        {/* ২. ফর্ম কার্ড */}
        <div className="bg-[#141414] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50" />
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            <div className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Project Name <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <TerminalSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="e.g. production-api-v2" 
                    required 
                    className="pl-10 bg-[#0a0a0a] border-white/[0.05] text-zinc-200 placeholder:text-zinc-700 h-11 rounded-xl focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Description
                </Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="What is the purpose of this environment?" 
                  className="bg-[#0a0a0a] border-white/[0.05] text-zinc-200 placeholder:text-zinc-700 rounded-xl min-h-[100px] focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2.5">
                <Label htmlFor="tags" className="text-xs uppercase tracking-widest text-zinc-500 font-medium flex justify-between">
                  <span>Tags</span>
                  <span className="text-zinc-700 font-mono lowercase">Comma Separated</span>
                </Label>
                <Input 
                  id="tags" 
                  name="tags" 
                  placeholder="frontend, nextjs, stripe..." 
                  className="bg-[#0a0a0a] border-white/[0.05] text-zinc-200 placeholder:text-zinc-700 h-11 rounded-xl focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* ৩. সাবমিট অ্যাকশন */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center border-t border-white/[0.05]">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 shadow-lg shadow-indigo-500/20 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing Vault...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => router.back()}
                className="w-full sm:w-auto text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] rounded-xl h-11"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}