import Link from "next/link";
import { Folder, Calendar, KeyRound, ChevronRight, Globe } from "lucide-react";
import { BsGithub } from "react-icons/bs";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description: string;
    tags: string[];
    variableCount: number;
    createdAt: string;
    colorLabel?: string;
    liveLink?: string;
    githubLink?: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const activeColor = project.colorLabel || "#6366f1";

  return (
    
    <div 
      style={{ "--project-color": activeColor } as React.CSSProperties}
      className="relative group h-full bg-[#141414] border border-white/[0.05] rounded-2xl p-6 flex flex-col overflow-hidden transition-all duration-300 hover:border-white/[0.1] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_var(--project-color)]"
    >
      {/* ১. project main link। 
        absolute inset-0  
      */}
      <Link href={`/projects/${project._id}`} className="absolute inset-0 z-0" />

      {/* Top subtle glow line */}
      <div 
        className="absolute top-0 left-0 w-full h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300 z-0" 
        style={{ backgroundColor: activeColor, boxShadow: `0 0 15px ${activeColor}` }} 
      />

      {/* Header Section */}
      <div className="flex items-start justify-between mb-4 relative z-10 pointer-events-none">
        <div className="flex items-center gap-3">
          <div 
            className="p-2.5 rounded-xl bg-[#0a0a0a] border border-white/[0.05] transition-colors"
            style={{ borderBottomColor: `${activeColor}40` }}
          >
            <Folder className="h-5 w-5" style={{ color: activeColor }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 transition-colors tracking-tight">
              {project.name}
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
              Active Vault
            </p>
          </div>
        </div>
        
        {/* Indicators for GitHub and Live Link */}
        {/* pointer-events-auto  */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {project.githubLink && (
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08] rounded-lg transition-all"
              title="View Source on GitHub"
            >
              <BsGithub className="h-4 w-4" />
            </a>
          )}
          {project.liveLink && (
            <a 
              href={project.liveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.08] rounded-lg transition-all"
              title="Visit Live Site"
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
          <ChevronRight className="h-5 w-5 text-zinc-700 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all ml-1" />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-500 line-clamp-2 mb-6 flex-grow leading-relaxed relative z-10 pointer-events-none">
        {project.description || "No description provided for this environment container."}
      </p>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 relative z-10 pointer-events-none">
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.05] text-[10px] text-zinc-400 font-mono group-hover:border-white/[0.1] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] mt-auto relative z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          <Calendar className="h-3.5 w-3.5 text-zinc-600" />
          {new Date(project.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <KeyRound className="h-3.5 w-3.5 text-emerald-500/70" />
          <span className="text-zinc-300 font-medium">{project.variableCount}</span>
          <span className="text-zinc-600 uppercase">Secrets</span>
        </div>
      </div>
      
    </div>
  );
}