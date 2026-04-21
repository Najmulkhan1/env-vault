"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function VariableRow({ variable }: { variable: any }) {
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // ১. এডিট করার লজিক (Key + Value)
  const handleEdit = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Variable",
      html:
        `<div style="text-align: left; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Variable Key</div>` +
        `<input id="swal-key" class="swal2-input" placeholder="Key" value="${variable.key}" style="margin-top: 0;">` +
        `<div style="text-align: left; margin-bottom: 8px; margin-top: 16px; font-size: 14px; font-weight: 500;">New Value (Optional)</div>` +
        `<input id="swal-value" type="password" class="swal2-input" placeholder="Enter new secret" style="margin-top: 0;">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        return {
          key: (document.getElementById("swal-key") as HTMLInputElement).value,
          value: (document.getElementById("swal-value") as HTMLInputElement).value,
        };
      },
    });

    if (formValues) {
      if (!formValues.key) {
        toast.error("Key is required");
        return;
      }

      try {
        const res = await fetch(`/api/variables/${variable._id}`, {
          method: "PATCH",
          body: JSON.stringify(formValues),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          toast.success("Variable updated");
          setRevealedValue(null); // সিকিউরিটির জন্য মাস্কিং ফিরিয়ে আনা
          router.refresh();
        } else {
          toast.error("Update failed");
        }
      } catch (err) {
        toast.error("Network error");
      }
    }
  };

  // ২. ডিলিট করার লজিক
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete variable "${variable.key}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/variables/${variable._id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success("Variable deleted");
          router.refresh();
        }
      } catch (err) {
        toast.error("Could not delete");
      }
    }
  };

  // ৩. ভ্যালু রিভিল করার লজিক
  const handleReveal = async () => {
    if (revealedValue) {
      setRevealedValue(null);
      return;
    }
    setIsRevealing(true);
    try {
      const res = await fetch(`/api/projects/${variable._id}/reveal`);
      const data = await res.json();
      if (data.value) setRevealedValue(data.value);
    } catch (err) {
      toast.error("Failed to reveal");
    } finally {
      setIsRevealing(false);
    }
  };

  // ৪. কপি করার লজিক
  const handleCopy = async () => {
    let val = revealedValue;
    if (!val) {
      const res = await fetch(`/api/projects/${variable._id}/reveal`);
      const data = await res.json();
      val = data.value;
    }
    if (val) {
      await navigator.clipboard.writeText(val);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <TableRow className="group">
      <TableCell className="font-mono font-medium">{variable.key}</TableCell>
      <TableCell className="font-mono text-muted-foreground text-xs">
        {revealedValue ? <span className="text-foreground">{revealedValue}</span> : "••••••••••••••••"}
      </TableCell>
      <TableCell className="text-right space-x-1">
        <Button variant="ghost" size="icon" onClick={handleReveal} disabled={isRevealing}>
          {isRevealing ? <Loader2 className="w-4 h-4 animate-spin" /> : (revealedValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />)}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleEdit} className="text-blue-500 hover:bg-blue-50">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}