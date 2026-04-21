"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2"; // P1 requirement: SweetAlert2 use kora

export function ProjectActions({ projectId, projectName, projectDesc }: { 
  projectId: string; 
  projectName: string;
  projectDesc: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Project Delete Korar Logic
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All variables in this project will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Project deleted");
          router.push("/dashboard");
          router.refresh();
        }
      } catch (err) {
        toast.error("Failed to delete project");
      } finally {
        setLoading(false);
      }
    }
  };

  // Project Edit Korar Logic (Simple SweetAlert2 Input)
  const handleEdit = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Project",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${projectName}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Description" value="${projectDesc}">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          name: (document.getElementById("swal-input1") as HTMLInputElement).value,
          description: (document.getElementById("swal-input2") as HTMLInputElement).value,
        };
      },
    });

    if (formValues) {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          body: JSON.stringify(formValues),
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          toast.success("Project updated");
          router.refresh();
        }
      } catch (err) {
        toast.error("Update failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={handleEdit} disabled={loading}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="destructive" size="icon" onClick={handleDelete} disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}