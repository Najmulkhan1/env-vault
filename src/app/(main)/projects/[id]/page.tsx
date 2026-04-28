import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Variable from "@/models/Variable";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { AddVariableModal } from "@/components/projects/AddVariableModal";
import { ExportButton } from "@/components/projects/ExportButton";
import { VariableRow } from "@/components/projects/VariableRow";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, TerminalSquare, KeyRound, AlertCircle } from "lucide-react";
import { ImportModal } from "@/components/projects/ImportModal";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const session = await auth();
    const resolvedParams = await params;
    const project = await Project.findOne({ _id: resolvedParams.id, owner: session?.user?.id });

    if (!project) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="flex flex-col items-center text-center space-y-3 p-8 rounded-2xl border border-white/[0.05] bg-[#141414]">
                    <AlertCircle className="h-10 w-10 text-red-500/80 mb-2" />
                    <h2 className="text-xl font-medium text-zinc-200">Project Not Found</h2>
                    <p className="text-sm text-zinc-500 max-w-xs">The project you are looking for does not exist or you don't have access to it.</p>
                    <Button asChild variant="outline" className="mt-4 border-white/[0.05] bg-white/[0.02] text-zinc-300 hover:text-zinc-100 hover:bg-white/[0.05]">
                        <Link href="/projects">Return to Projects</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const variables = await Variable.find({ projectId: resolvedParams.id });

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0a0a0a] p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-zinc-200">
            
            {/* ১. প্রজেক্ট হেডার এবং অ্যাকশন প্যানেল */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-indigo-500/10 p-1.5 rounded-md border border-indigo-500/20">
                            <TerminalSquare className="h-4 w-4 text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.2em]">Environment Workspace</span>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">{project.name}</h1>
                    <p className="text-sm text-zinc-500 max-w-2xl leading-relaxed">
                        {project.description || "No description provided for this project."}
                    </p>
                </div>
                
                <div className="flex gap-3 items-center flex-wrap">
                    {/* Import .env Button  */}
                    <ImportModal projectId={project._id.toString()} />
                    
                    {/* Export .env Button */}
                    <ExportButton projectId={project._id.toString()} projectName={project.name} />
                    
                    {/* Edit & Delete Buttons */}
                    <ProjectActions 
                        projectId={project._id.toString()} 
                        projectName={project.name} 
                        projectDesc={project.description || ""}
                    />

                    {/* Project Settings */}
                    <Button variant="outline" size="icon" asChild title="Project Settings" className="border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 transition-colors">
                        <Link href={`/projects/${project._id.toString()}/settings`}>
                            <Settings className="w-4 h-4" />
                        </Link>
                    </Button>

                    <div className="w-[1px] h-8 bg-white/[0.05] mx-1 hidden sm:block" />

                    {/* Add Variable Button */}
                    <AddVariableModal projectId={project._id.toString()} />
                </div>
            </div>

            {/* ২. ডেটা টেবিল সেকশন */}
            <div className="border border-white/[0.05] rounded-2xl bg-[#141414] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                
                <Table>
                    <TableHeader className="bg-[#0a0a0a]/50 border-b border-white/[0.05] hover:bg-[#0a0a0a]/50">
                        <TableRow className="border-white/[0.05] hover:bg-transparent">
                            <TableHead className="w-[300px] text-xs uppercase tracking-widest font-medium text-zinc-500 h-12">Key</TableHead>
                            <TableHead className="text-xs uppercase tracking-widest font-medium text-zinc-500 h-12">Value</TableHead>
                            <TableHead className="text-right text-xs uppercase tracking-widest font-medium text-zinc-500 h-12">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variables.length === 0 ? (
                            <TableRow className="hover:bg-transparent border-none">
                                <TableCell colSpan={3} className="h-[300px] text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                                            <KeyRound className="h-5 w-5 text-zinc-600" />
                                        </div>
                                        <p className="text-zinc-300 font-medium">No variables found</p>
                                        <p className="text-zinc-500 text-sm">Start by adding your first secret key to this environment.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            variables.map((v) => (
                                <VariableRow key={v._id.toString()} variable={JSON.parse(JSON.stringify(v))} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}