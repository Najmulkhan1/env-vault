import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  await dbConnect();
  const session = await auth();
  
  // ইউজারের সব প্রজেক্ট ডাটাবেস থেকে ফেচ করা
  const projects = await Project.find({ owner: session?.user?.id }).sort({ createdAt: -1 });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">Manage your project environments and secrets.</p>
        </div>
        
        {/* প্রজেক্ট তৈরির বাটন (পরবর্তীতে এখানে মোডাল যোগ করতে পারেন) */}
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No projects found</h2>
          <p className="text-muted-foreground">Get started by creating your first project.</p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id.toString()} project={JSON.parse(JSON.stringify(project))} />
          ))}
        </div>
      )}
    </div>
  );
}