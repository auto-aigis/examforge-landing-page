"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../_components/AuthProvider";
import AppNav from "../../../_components/AppNav";
import { apiFetch } from "../../../_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Plus, Loader2, AlertCircle, Users, BarChart2, Trash2 } from "lucide-react";

interface Student { id: string; name: string; created_at: string }
interface ScoreRow { student_id: string; topic_id: string | null; score: number; max_score: number }
interface StudentScore {
  student_id: string;
  student_name: string;
  total_score: number;
  total_max: number;
  overall_percentage: number;
  topics: {
    topic_id: string;
    topic_name: string;
    score: number;
    max_score: number;
    percentage: number;
    is_weak: boolean;
  }[];
}

export default function ScoresPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const paperId = params.id as string;

  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState("");
  const [addingStudent, setAddingStudent] = useState(false);

  const [scores, setScores] = useState<StudentScore[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);

  // Score entry: { [studentId]: { score: string, maxScore: string } }
  const [scoreInputs, setScoreInputs] = useState<Record<string, { score: string; maxScore: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/apps/examforge/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiFetch<Student[]>("/api/students"),
      apiFetch<{ students: StudentScore[] }>(`/api/students/papers/${paperId}/scores`),
    ]).then(([s, sc]) => {
      setStudents(s);
      setScores(sc.students || []);
      setLoadingScores(false);
    }).catch(() => setLoadingScores(false));
  }, [user, paperId]);

  const handleAddStudent = async () => {
    if (!newStudentName.trim()) return;
    setAddingStudent(true);
    try {
      const s = await apiFetch<Student>("/api/students", {
        method: "POST",
        body: JSON.stringify({ name: newStudentName.trim() }),
      });
      setStudents((prev) => [...prev, s]);
      setNewStudentName("");
    } catch {
      alert("Failed to add student.");
    } finally {
      setAddingStudent(false);
    }
  };

  const handleSubmitScores = async () => {
    const entries = Object.entries(scoreInputs).filter(([, v]) => v.score !== "" && v.maxScore !== "");
    if (entries.length === 0) return;

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    const payload: ScoreRow[] = entries.map(([studentId, v]) => ({
      student_id: studentId,
      topic_id: null,
      score: parseFloat(v.score),
      max_score: parseFloat(v.maxScore),
    }));

    try {
      await apiFetch(`/api/students/papers/${paperId}/scores`, {
        method: "POST",
        body: JSON.stringify({ scores: payload }),
      });
      const updated = await apiFetch<{ students: StudentScore[] }>(`/api/students/papers/${paperId}/scores`);
      setScores(updated.students || []);
      setScoreInputs({});
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save scores.");
    } finally {
      setSubmitting(false);
    }
  };

  const getHeatmapColor = (percentage: number, isWeak: boolean) => {
    if (isWeak) return "bg-red-100 text-red-700 border-red-200";
    if (percentage >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 pt-20 pb-12 sm:px-6">
        <Link
          href={`/apps/examforge/papers/${paperId}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Paper
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-indigo-500" />
            Student Scores & Analysis
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter student scores and see weak-topic analysis for each student.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Student Management + Score Entry */}
          <div className="lg:col-span-1 space-y-5">
            {/* Add Student */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Student name"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddStudent()}
                    className="h-9 text-sm"
                  />
                  <Button
                    onClick={handleAddStudent}
                    disabled={addingStudent || !newStudentName.trim()}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {addingStudent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                {students.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">No students yet. Add one above.</p>
                ) : (
                  <ul className="space-y-1">
                    {students.map((s) => (
                      <li key={s.id} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Score Entry */}
            {students.length > 0 && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Enter Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {submitError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}
                  {submitSuccess && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-2 text-xs text-green-700 text-center">
                      ✓ Scores saved successfully!
                    </div>
                  )}
                  {students.map((s) => (
                    <div key={s.id} className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">{s.name}</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Score"
                          min={0}
                          value={scoreInputs[s.id]?.score ?? ""}
                          onChange={(e) =>
                            setScoreInputs((prev) => ({
                              ...prev,
                              [s.id]: { ...prev[s.id], score: e.target.value },
                            }))
                          }
                          className="h-8 text-sm"
                        />
                        <span className="text-gray-400 text-sm">/</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          min={1}
                          value={scoreInputs[s.id]?.maxScore ?? ""}
                          onChange={(e) =>
                            setScoreInputs((prev) => ({
                              ...prev,
                              [s.id]: { ...prev[s.id], maxScore: e.target.value },
                            }))
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={handleSubmitScores}
                    disabled={submitting || Object.keys(scoreInputs).length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-9"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Scores
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Heatmap */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-indigo-500" />
                  Performance Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingScores ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  </div>
                ) : scores.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <BarChart2 className="h-10 w-10 text-gray-200 mb-3" />
                    <p className="text-sm text-gray-500">No scores yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Add students and enter their scores to see the analysis.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 text-xs mb-4">
                      <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-green-100 border border-green-200" /><span className="text-gray-600">≥80% Strong</span></div>
                      <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-yellow-100 border border-yellow-200" /><span className="text-gray-600">60–79% OK</span></div>
                      <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-orange-100 border border-orange-200" /><span className="text-gray-600">50–59% Needs work</span></div>
                      <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-red-100 border border-red-200" /><span className="text-gray-600">&lt;50% Weak</span></div>
                    </div>

                    {scores.map((student) => (
                      <div key={student.student_id} className="rounded-xl border border-gray-100 bg-white p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                              {student.student_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{student.student_name}</p>
                              <p className="text-xs text-gray-500">
                                {student.total_score}/{student.total_max} marks
                              </p>
                            </div>
                          </div>
                          <div className={`rounded-full px-3 py-1 text-sm font-bold border ${getHeatmapColor(student.overall_percentage, student.overall_percentage < 50)}`}>
                            {student.overall_percentage.toFixed(0)}%
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3 h-2 w-full rounded-full bg-gray-100">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              student.overall_percentage >= 80
                                ? "bg-green-500"
                                : student.overall_percentage >= 60
                                ? "bg-yellow-500"
                                : student.overall_percentage >= 50
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(student.overall_percentage, 100)}%` }}
                          />
                        </div>

                        {/* Topic breakdown */}
                        {student.topics.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {student.topics.map((t) => (
                              <div
                                key={t.topic_id}
                                className={`rounded-lg border px-3 py-2 text-xs ${getHeatmapColor(t.percentage, t.is_weak)}`}
                              >
                                <p className="font-medium truncate">{t.topic_name}</p>
                                <p className="mt-0.5 font-bold">{t.percentage.toFixed(0)}%</p>
                                <p className="text-xs opacity-70">{t.score}/{t.max_score}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {student.topics.some((t) => t.is_weak) && (
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                            <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                            <p className="text-xs text-red-700">
                              Weak topics:{" "}
                              {student.topics.filter((t) => t.is_weak).map((t) => t.topic_name).join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
