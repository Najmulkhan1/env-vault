"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Save, 
  Trash2, 
  AlertOctagon, 
  TerminalSquare, 
  Globe, 
  
  Tag 
} from "lucide-react";
import { BsGithub } from "react-icons/bs";

interface ProjectSettingsFormProps {
  projectId: string;
  projectName: string;
  projectDesc: string;
  projectColor: string;
  liveLink?: string;     // New
  githubLink?: string;   // New
  tags?: string[];       // New
}

export function ProjectSettingsForm({
  projectId,
  projectName,
  projectDesc,
  projectColor,
  liveLink = "",
  githubLink = "",
  tags = [],
}: ProjectSettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // States
  const [name, setName] = useState(projectName);
  const [description, setDescription] = useState(projectDesc);
  const [colorLabel, setColorLabel] = useState(projectColor || "#6366f1");
  const [url, setUrl] = useState(liveLink);
  const [repo, setRepo] = useState(githubLink);
  const [tagsInput, setTagsInput] = useState(tags.join(", "));

  // General settings 
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name cannot be empty.");
      return;
    }

    setSaving(true);
    
    
    const tagsArray = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          description, 
          colorLabel, 
          liveLink: url, 
          githubLink: repo, 
          tags: tagsArray 
        }),
      });

      if (res.ok) {
        toast.success("Project settings updated successfully!");
        router.refresh();
      } else {
        toast.error("Failed to save settings.");
      }
    } catch {
      toast.error("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Project?",
      html: `<p class="text-zinc-400 text-sm mt-2">This will permanently delete <strong class="text-white">${projectName}</strong>. This action cannot be reversed.</p>`,
      icon: "warning",
      background: "#141414",
      color: "#f4f4f5",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#27272a",
      confirmButtonText: "Yes, delete permanently",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "border border-white/10 rounded-2xl",
        confirmButton: "rounded-lg text-sm font-medium",
        cancelButton: "rounded-lg text-sm font-medium",
      }
    });

    if (!result.isConfirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Project permanently deleted.");
        router.push("/projects");
        router.refresh();
      } else {
        toast.error("Failed to delete project.");
      }
    } catch {
      toast.error("An error occurred during deletion.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      
      <form onSubmit={handleSave} className="space-y-8">
        <div className="space-y-6">
          
          {/* Project Name */}
          <div className="space-y-2.5">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Project Name *</label>
            <div className="relative">
              <TerminalSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/[0.05] text-zinc-200 h-11 rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Live Link & GitHub Link (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Live Link</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
                <input
                  type="url"
                  placeholder="https://your-app.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/[0.05] text-zinc-200 h-11 rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">GitHub Repository</label>
              <div className="relative">
                <BsGithub className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
                <input
                  type="url"
                  placeholder="https://github.com/user/repo"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/[0.05] text-zinc-200 h-11 rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2.5">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Tags (comma separated)</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-600" />
              <input
                type="text"
                placeholder="Nextjs, Tailwind, TypeScript"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/[0.05] text-zinc-200 h-11 rounded-xl pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2.5">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#0a0a0a] border border-white/[0.05] text-zinc-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all resize-none"
            />
          </div>

          {/* Color */}
          <div className="space-y-2.5">
            <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Identifier Color</label>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 rounded-lg blur-md opacity-40" style={{ backgroundColor: colorLabel }} />
                <div className="relative bg-[#0a0a0a] border border-white/[0.1] rounded-lg p-1.5 flex items-center justify-center">
                  <input
                    type="color"
                    value={colorLabel}
                    onChange={(e) => setColorLabel(e.target.value)}
                    className="h-8 w-12 cursor-pointer bg-transparent border-0 rounded-sm"
                  />
                </div>
              </div>
              <span className="text-sm text-zinc-300 font-mono">{colorLabel.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.05]">
          <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 px-8 shadow-lg shadow-indigo-500/20">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Danger Zone remains the same */}
      <div className="mt-12 pt-8 border-t border-red-500/10">
        <div className="flex items-center gap-2 mb-4">
          <AlertOctagon className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/[0.02] p-5">
          <div>
            <p className="text-sm font-medium text-zinc-200">Delete Project</p>
            <p className="text-xs text-zinc-500 mt-1">This action is permanent and cannot be undone.</p>
          </div>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg">
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete Project
          </Button>
        </div>
      </div>
    </div>
  );
}