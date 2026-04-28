"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileUp } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ImportModal({ projectId }: { projectId: string }) {
  const [envContent, setEnvContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ফাইল রিড করার ফাংশন
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEnvContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!envContent) return toast.error("Please provide .env content");
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/import`, {
        method: "POST",
        body: JSON.stringify({ envContent }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Variables imported successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to import variables.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" /> Import .env
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import Environment Variables</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors relative">
            <input
              type="file"
              accept=".env"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload .env file or drag and drop</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or paste content</span></div>
          </div>
          <Textarea 
            placeholder="DB_URL=mongodb://...&#10;API_KEY=12345" 
            className="h-40 font-mono text-xs"
            value={envContent}
            onChange={(e) => setEnvContent(e.target.value)}
          />
          <Button onClick={handleImport} className="w-full" disabled={loading}>
            {loading ? "Importing..." : "Start Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}