import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import Variable from "@/models/Variable";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { AddVariableModal } from "@/components/projects/AddVariableModal";
import { ExportButton } from "@/components/projects/ExportButton";
import { VariableRow } from "@/components/projects/VariableRow";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const session = await auth();
    const resolvedParams = await params;
    const project = await Project.findOne({ _id: resolvedParams.id, owner: session?.user?.id });

    if (!project) return <div className="p-10">Project not found</div>;

    const variables = await Variable.find({ projectId: resolvedParams.id });

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <p className="text-muted-foreground">{project.description}</p>
                </div>
                
                <div className="flex gap-3">
                    {/* Add Variable Button (Injected from Modal) */}
                    <AddVariableModal projectId={project._id.toString()} />
                    
                    {/* Export .env Button */}
                    <ExportButton projectId={project._id.toString()} projectName={project.name} />
                    
                    {/* Edit & Delete Buttons */}
                    <ProjectActions 
                        projectId={project._id.toString()} 
                        projectName={project.name} 
                        projectDesc={project.description || ""}
                    />
                </div>
            </div>

            <div className="border rounded-xl bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[300px]">Key</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variables.map((v) => (
                            <VariableRow key={v._id.toString()} variable={JSON.parse(JSON.stringify(v))} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}