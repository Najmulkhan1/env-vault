"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarLogout() {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" 
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}