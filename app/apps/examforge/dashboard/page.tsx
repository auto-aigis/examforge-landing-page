"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../_components/AuthProvider";
import AppNav from "../_components/AppNav";
import { apiFetch } from "../_lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlusCircle, FileText, Download, BarChart2, Zap, AlertCircle, CheckCircle, Crown
} from "lucide-react";

interface Paper {
  id: string;
  exam_name: string;
  subject_name: string;
  topic_name: string;
  difficulty: string;
  question_count: number;
  created_at: string;
}

interface Usage {
  plan: "free" | "paid";
  papers_used: number;
  papers_limit: number | null;
  papers_remaining: number | null;
  billing_cycle_start: string;
}

function DifficultyBadge({ d }: { d: string }) {
  const colors: Record<string, string> = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[d] || "bg-gray-100 text-gray-600"}`}>
      {d}
    </span>
  );
}

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/apps/examforge/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setPaymentSuccess(true);
      setTimeout(() => setPaymentSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiFetch<Paper[]>("/api/papers"),
      apiFetch<Usage>("/api/usage"),
    ]).then(([p, u]) => {
      setPapers(p);
      setUsage(u);
      setLoadingData(false);
    }).catch(() => setLoadingData(false));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  const usagePercent = usage && usage.papers_limit
    ? Math.min((usage.papers_used / usage.papers_limit) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6">
        {paymentSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">
              Payment successful! Your plan has been upgraded to Pro. Enjoy unlimited papers!
            </p>
          </div>
        )}

        {/* Header Row */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {user.email}
            </p>
          </div>
          <Link href="/apps/examforge/generate">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <PlusCircle className="h-4 w-4" />
              Generate Paper
            </Button>
          </Link>
        </div>

        {/* Usage Card */}
        {usage && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Plan</span>
                  {usage.plan === "paid" ? (
                    <Badge className="bg-indigo-600 text-white border-0 gap-1">
                      <Crown className="h-3 w-3" /> Pro
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600 border-0">Free</Badge>
                  )}
                </div>
                {usage.plan === "free" ? (
                  <>
                    <p className="text-2xl font-bold text-gray-900">
                      {usage.papers_used}/{usage.papers_limit}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Papers used this month</p>
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    {(usage.papers_remaining ?? 0) <= 1 && (
                      <Link href="/apps/examforge/upgrade">
                        <Button size="sm" className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                          Upgrade to Pro — ₹499/mo
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{usage.papers_used}</p>
                    <p className="text-xs text-gray-500 mt-1">Papers generated (unlimited)</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-600">Total Papers</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{papers.length}</p>
                <p className="text-xs text-gray-500 mt-1">All time generated</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">Quick Actions</span>
                </div>
                <div className="space-y-2">
                  <Link href="/apps/examforge/generate">
                    <Button variant="outline" size="sm" className="w-full text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                      New Paper
                    </Button>
                  </Link>
                  <Link href="/apps/examforge/settings">
                    <Button variant="outline" size="sm" className="w-full text-xs border-gray-200 text-gray-600 hover:bg-gray-50">
                      Configure API Key
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Papers List */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Generated Papers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : papers.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                  <FileText className="h-8 w-8 text-indigo-300" />
                </div>
                <h3 className="font-semibold text-gray-900">No papers yet</h3>
                <p className="mt-1 text-sm text-gray-500">Generate your first AI question paper to get started.</p>
                <Link href="/apps/examforge/generate" className="mt-4">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Generate First Paper
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {papers.map((paper) => (
                  <div key={paper.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {paper.exam_name} • {paper.subject_name}
                        </span>
                        <DifficultyBadge d={paper.difficulty} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{paper.topic_name}</span>
                        <span>•</span>
                        <span>{paper.question_count} questions</span>
                        <span>•</span>
                        <span>{new Date(paper.created_at).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/apps/examforge/papers/${paper.id}`}>
                        <Button variant="outline" size="sm" className="text-xs border-gray-200 gap-1">
                          <Download className="h-3 w-3" />
                          View & Download
                        </Button>
                      </Link>
                      <Link href={`/apps/examforge/papers/${paper.id}/scores`}>
                        <Button variant="outline" size="sm" className="text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50 gap-1">
                          <BarChart2 className="h-3 w-3" />
                          Scores
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Free plan upgrade banner */}
        {usage?.plan === "free" && (usage.papers_remaining ?? 0) > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-white flex-shrink-0" />
              <div>
                <p className="font-semibold text-white text-sm">
                  You have {usage.papers_remaining} paper{usage.papers_remaining !== 1 ? "s" : ""} remaining this month
                </p>
                <p className="text-indigo-200 text-xs mt-0.5">
                  Upgrade to Pro for unlimited AI-generated papers — ₹499/month
                </p>
              </div>
            </div>
            <Link href="/apps/examforge/upgrade">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold text-sm whitespace-nowrap">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
