"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./_components/AuthProvider";
import { FileText } from "lucide-react";

export default function ExamForgeHome() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/apps/examforge/dashboard");
      } else {
        router.replace("/apps/examforge/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <p className="text-sm text-gray-500">Loading ExamForge...</p>
      </div>
    </div>
  );
}
