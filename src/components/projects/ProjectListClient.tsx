"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { highlightMatch } from "@/lib/highlight";
import { Search, Folder } from "lucide-react";

export function ProjectListClient({ initialProjects }: { initialProjects: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");


  const filteredProjects = initialProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
     {/* search input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10 h-10 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <h2 className="mt-4 text-lg font-semibold text-muted-foreground">No projects found</h2>
          <p className="text-sm text-muted-foreground">Try a different search term or create a new project.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project._id} 
              // project name heighlight 
              project={{
                ...project,
                name: highlightMatch(project.name, searchQuery),
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}