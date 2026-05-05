"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../_components/AuthProvider";
import AppNav from "../../_components/AppNav";
import { apiFetch, apiFetchBlob } from "../../_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download, FileText, BookOpen, ChevronLeft, BarChart2, Loader2, CheckCircle
} from "lucide-react";

interface Question {
  question_number: number;
  type: "mcq" | "short_answer";
  question: string;
  options?: string[];
  marks: number;
}

interface Answer {
  question_number: number;
  correct_answer?: string;
  answer?: string;
  explanation?: string;
}

interface Paper {
  id: string;
  exam_name: string;
  subject_name: string;
  topic_name: string;
  difficulty: string;
  question_count: number;
  content_json: { questions: Question[] };
  answer_key_json: { answers: Answer[] };
  created_at: string;
}

export default function PaperDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loadingPaper, setLoadingPaper] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [downloadingQ, setDownloadingQ] = useState(false);
  const [downloadingA, setDownloadingA] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/apps/examforge/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !id) return;
    apiFetch<Paper>(`/api/papers/${id}`)
      .then(setPaper)
      .catch(() => router.replace("/apps/examforge/dashboard"))
      .finally(() => setLoadingPaper(false));
  }, [user, id, router]);

  const downloadPDF = async (type: "questions" | "answers") => {
    const setLoading = type === "questions" ? setDownloadingQ : setDownloadingA;
    setLoading(true);
    try {
      const blob = await apiFetchBlob(`/api/papers/${id}/pdf/${type}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `examforge_${type === "questions" ? "" : "answers_"}${paper?.exam_name}_${paper?.topic_name}_${id.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const diffColors: Record<string, string> = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  if (loading || loadingPaper) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (!paper) return null;

  const questions = paper.content_json?.questions || [];
  const answers = paper.answer_key_json?.answers || [];
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 pt-20 pb-12 sm:px-6">
        {/* Breadcrumb */}
        <Link
          href="/apps/examforge/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Paper Header */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-gray-900">
                  {paper.exam_name} — {paper.subject_name}
                </h1>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${diffColors[paper.difficulty] || "bg-gray-100 text-gray-600"}`}>
                  {paper.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {paper.topic_name}
                </span>
                <span>{paper.question_count} Questions</span>
                <span>Total: {totalMarks} Marks</span>
                <span>{new Date(paper.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => downloadPDF("questions")}
                disabled={downloadingQ}
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                size="sm"
              >
                {downloadingQ ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Question Paper PDF
              </Button>
              <Button
                onClick={() => downloadPDF("answers")}
                disabled={downloadingA}
                variant="outline"
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 gap-2"
                size="sm"
              >
                {downloadingA ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Answer Key PDF
              </Button>
              <Link href={`/apps/examforge/papers/${id}/scores`}>
                <Button variant="outline" size="sm" className="border-gray-200 gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Student Scores
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Toggle Answers */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
            className="border-gray-200 text-sm"
          >
            {showAnswers ? "Hide Answers" : "Show Answer Key"}
          </Button>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q) => {
            const answer = answers.find((a) => a.question_number === q.question_number);
            return (
              <Card key={q.question_number} className="border border-gray-200 shadow-sm">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      {q.question_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={`text-xs border-0 ${q.type === "mcq" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                          {q.type === "mcq" ? "MCQ" : "Short Answer"}
                        </Badge>
                        <span className="text-xs text-gray-500">[{q.marks} mark{q.marks !== 1 ? "s" : ""}]</span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed mb-3">{q.question}</p>

                      {q.type === "mcq" && q.options && (
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {q.options.map((opt, idx) => {
                            const label = String.fromCharCode(65 + idx);
                            const isCorrect = showAnswers && answer?.correct_answer === opt;
                            return (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                                  isCorrect
                                    ? "border-green-400 bg-green-50 text-green-800 font-medium"
                                    : "border-gray-100 bg-gray-50 text-gray-700"
                                }`}
                              >
                                <span className="font-medium text-gray-500 flex-shrink-0">{label})</span>
                                {opt}
                                {isCorrect && <CheckCircle className="ml-auto h-4 w-4 text-green-500 flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {showAnswers && answer && (
                        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                          {q.type === "short_answer" && answer.answer && (
                            <p className="text-sm font-medium text-green-800 mb-1">
                              <span className="font-semibold">Answer: </span>{answer.answer}
                            </p>
                          )}
                          {answer.explanation && (
                            <p className="text-xs text-green-700">
                              <span className="font-semibold">Explanation: </span>{answer.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
