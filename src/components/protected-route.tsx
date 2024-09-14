"use client";

import { useAuth } from "@/providers/auth-provider";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login");
    }
  }, [loading, user]);
  
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  if (!user) return null;

  return <>{children}</>;
}
