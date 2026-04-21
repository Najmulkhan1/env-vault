"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // আইকন ব্যবহারের জন্য
import { toast } from "sonner"; // প্রফেশনাল নোটিফিকেশনের জন্য

interface ExportButtonProps {
  projectId: string;
  projectName: string;
}

export function ExportButton({ projectId, projectName }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // ১. আমাদের তৈরি করা এক্সপোর্ট এপিআই কল করা
      const response = await fetch(`/api/projects/${projectId}/export`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // ২. রেসপন্স থেকে টেক্সট ডাটা বা ব্লব (Blob) নেওয়া
      const blob = await response.blob();
      
      // ৩. ব্রাউজারে একটি টেম্পোরারি ইউআরএল তৈরি করা ডাউনলোডের জন্য
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // ফাইলের নাম নির্ধারণ (স্পেস থাকলে আন্ডারস্কোর দিয়ে রিপ্লেস করা)
      const fileName = `${projectName.replace(/\s+/g, "_")}.env`;
      link.setAttribute("download", fileName);
      
      // ৪. ইনভিজিবল লিঙ্কটি ক্লিক করিয়ে ডাউনলোড শুরু করা
      document.body.appendChild(link);
      link.click();
      
      // ৫. ক্লিনআপ (মেমোরি সেভ করার জন্য)
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${fileName} exported successfully!`); // সফল হলে নোটিফিকেশন
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to export .env file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleExport} 
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <Download className={`h-4 w-4 ${isExporting ? "animate-bounce" : ""}`} />
      {isExporting ? "Exporting..." : "Export .env"}
    </Button>
  );
}