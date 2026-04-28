"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function AddVariableModal({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      key: formData.get("key"),
      value: formData.get("value"),
    };

    const res = await fetch(`/api/projects/${projectId}/variables`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Variable added!");
      setOpen(false);
      window.location.reload();
    } else {
      const errData = await res.json().catch(() => ({}));
      toast.error(errData.error || "Failed to add variable.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Variable</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Variable</DialogTitle>
          <DialogDescription>
            Add an encrypted environment variable to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Key</Label>
            <Input name="key" placeholder="e.g. DATABASE_URL" required />
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input name="value" type="password" placeholder="Enter your secret" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Variable"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}