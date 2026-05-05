"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../_components/AuthProvider";
import AppNav from "../_components/AppNav";
import { apiFetch } from "../_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, Loader2, AlertCircle, CheckCircle, BookOpen, Zap, Crown
} from "lucide-react";

interface ExamType { id: string; name: string }
interface Subject { id: string; name: string; exam_type_id: string }
interface Topic { id: string; name: string; subject_id: string; order_index: number }

type Difficulty = "Easy" | "Medium" | "Hard";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30, 40, 50];

export default function GeneratePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [exams, setExams] = useState<ExamType[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [questionCount, setQuestionCount] = useState(10);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [limitExceeded, setLimitExceeded] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/apps/examforge/login");
  }, [user, loading, router]);

  useEffect(() => {
    apiFetch<ExamType[]>("/api/curriculum/exams").then(setExams).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedExam) { setSubjects([]); setSelectedSubject(null); return; }
    apiFetch<Subject[]>(`/api/curriculum/subjects?exam_id=${selectedExam.id}`)
      .then(setSubjects).catch(() => {});
    setSelectedSubject(null);
    setSelectedTopic(null);
    setTopics([]);
  }, [selectedExam]);

  useEffect(() => {
    if (!selectedSubject) { setTopics([]); setSelectedTopic(null); return; }
    apiFetch<Topic[]>(`/api/curriculum/topics?subject_id=${selectedSubject.id}`)
      .then((t) => setTopics(t.sort((a, b) => a.order_index - b.order_index)))
      .catch(() => {});
    setSelectedTopic(null);
  }, [selectedSubject]);

  const canGenerate = selectedExam && selectedSubject && selectedTopic;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    setError("");
    setLimitExceeded(false);

    try {
      const paper = await apiFetch<{ id: string }>("/api/papers/generate", {
        method: "POST",
        body: JSON.stringify({
          exam_type_id: selectedExam!.id,
          subject_id: selectedSubject!.id,
          topic_id: selectedTopic!.id,
          difficulty,
          question_count: questionCount,
        }),
      });
      router.push(`/apps/examforge/papers/${paper.id}`);
    } catch (err: any) {
      if (err.status === 402) {
        setLimitExceeded(true);
      } else if (err.status === 400 && err.message?.includes("api_key")) {
        setError("Please configure your OpenAI or Gemini API key in Settings before generating papers.");
      } else {
        setError(err.message || "Generation failed. Please try again.");
      }
      setGenerating(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 pt-20 pb-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Generate Question Paper</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your paper below — AI will generate it in seconds.
          </p>
        </div>

        {limitExceeded && (
          <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Free plan limit reached</h3>
                <p className="mt-1 text-sm text-orange-700">
                  You&apos;ve used all 5 free papers this month. Upgrade to Pro for unlimited generation.
                </p>
                <Link href="/apps/examforge/upgrade">
                  <Button className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade to Pro — ₹499/month
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
              {error.includes("API key") && (
                <Link href="/apps/examforge/settings" className="mt-1 text-xs text-red-600 underline">
                  Go to Settings →
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {/* Step 1: Exam */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">1</span>
                Select Exam Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {exams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExam(exam)}
                    className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                      selectedExam?.id === exam.id
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                  >
                    <BookOpen className="h-4 w-4 flex-shrink-0" />
                    {exam.name}
                    {selectedExam?.id === exam.id && <CheckCircle className="ml-auto h-4 w-4 text-indigo-500" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Subject */}
          <Card className={`border shadow-sm transition-opacity ${!selectedExam ? "opacity-50 pointer-events-none border-gray-100" : "border-gray-200"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">2</span>
                Select Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subjects.length === 0 && selectedExam ? (
                <p className="text-sm text-gray-400">Loading subjects...</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {subjects.map((subj) => (
                    <button
                      key={subj.id}
                      onClick={() => setSelectedSubject(subj)}
                      className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                        selectedSubject?.id === subj.id
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-indigo-50"
                      }`}
                    >
                      {subj.name}
                      {selectedSubject?.id === subj.id && <CheckCircle className="ml-auto h-4 w-4 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Topic */}
          <Card className={`border shadow-sm transition-opacity ${!selectedSubject ? "opacity-50 pointer-events-none border-gray-100" : "border-gray-200"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">3</span>
                Select Chapter / Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topics.length === 0 && selectedSubject ? (
                <p className="text-sm text-gray-400">Loading topics...</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`flex items-center rounded-lg border px-3 py-2 text-sm text-left transition-all ${
                        selectedTopic?.id === topic.id
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                          : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"
                      }`}
                    >
                      <ChevronRight className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      {topic.name}
                      {selectedTopic?.id === topic.id && (
                        <CheckCircle className="ml-auto h-4 w-4 text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 4: Config */}
          <Card className={`border shadow-sm transition-opacity ${!selectedTopic ? "opacity-50 pointer-events-none border-gray-100" : "border-gray-200"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-gray-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">4</span>
                Paper Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Difficulty Level</p>
                <div className="grid grid-cols-3 gap-3">
                  {DIFFICULTIES.map((d) => {
                    const colors: Record<Difficulty, string> = {
                      Easy: "border-green-500 bg-green-50 text-green-700",
                      Medium: "border-yellow-500 bg-yellow-50 text-yellow-700",
                      Hard: "border-red-500 bg-red-50 text-red-700",
                    };
                    const inactive = {
                      Easy: "border-gray-200 hover:border-green-300 hover:bg-green-50",
                      Medium: "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50",
                      Hard: "border-gray-200 hover:border-red-300 hover:bg-red-50",
                    };
                    return (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                          difficulty === d ? colors[d] : `text-gray-600 bg-white ${inactive[d]}`
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Number of Questions</p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {QUESTION_COUNTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setQuestionCount(c)}
                      className={`rounded-lg border-2 py-2 text-sm font-semibold transition-all ${
                        questionCount === c
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary + Generate */}
          {canGenerate && (
            <Card className="border border-indigo-200 bg-indigo-50 shadow-sm">
              <CardContent className="pt-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge className="bg-white text-indigo-700 border border-indigo-200">{selectedExam!.name}</Badge>
                  <Badge className="bg-white text-indigo-700 border border-indigo-200">{selectedSubject!.name}</Badge>
                  <Badge className="bg-white text-indigo-700 border border-indigo-200">{selectedTopic!.name}</Badge>
                  <Badge className="bg-white text-indigo-700 border border-indigo-200">{difficulty}</Badge>
                  <Badge className="bg-white text-indigo-700 border border-indigo-200">{questionCount} Questions</Badge>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base font-semibold gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating Paper... (may take 15–25s)
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Generate Paper with AI
                    </>
                  )}
                </Button>
                {generating && (
                  <p className="mt-2 text-center text-xs text-indigo-600">
                    🤖 AI is crafting curriculum-mapped questions for you...
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
