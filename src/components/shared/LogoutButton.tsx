"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => signOut()}
      className="text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
    >
      <LogOut className="h-4 w-4 mr-2" /> Logout
    </Button>
  );
}