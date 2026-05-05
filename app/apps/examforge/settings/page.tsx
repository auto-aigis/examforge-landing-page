"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../_components/AuthProvider";
import AppNav from "../_components/AppNav";
import { apiFetch } from "../_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings, Key, Eye, EyeOff, CheckCircle, AlertCircle, Trash2, Loader2, Crown, ExternalLink
} from "lucide-react";

interface APIKey {
  provider: "openai" | "gemini";
  masked_key: string;
  created_at: string;
}

interface Usage {
  plan: "free" | "paid";
  papers_used: number;
  papers_limit: number | null;
  papers_remaining: number | null;
}

export default function SettingsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [provider, setProvider] = useState<"openai" | "gemini">("openai");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/apps/examforge/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiFetch<APIKey[]>("/api/settings/apikey"),
      apiFetch<Usage>("/api/usage"),
    ]).then(([keys, u]) => {
      setApiKeys(keys);
      setUsage(u);
      setLoadingData(false);
    }).catch(() => setLoadingData(false));
  }, [user]);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      await apiFetch("/api/settings/apikey", {
        method: "PUT",
        body: JSON.stringify({ provider, api_key: apiKeyInput.trim() }),
      });
      const updatedKeys = await apiFetch<APIKey[]>("/api/settings/apikey");
      setApiKeys(updatedKeys);
      setApiKeyInput("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save API key.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = async (p: string) => {
    if (!confirm(`Delete your ${p.toUpperCase()} API key?`)) return;
    setDeleting(p);
    try {
      await apiFetch(`/api/settings/apikey/${p}`, { method: "DELETE" });
      setApiKeys((prev) => prev.filter((k) => k.provider !== p));
    } catch {
      alert("Failed to delete key.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 pt-20 pb-12 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account & Plan */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Crown className="h-4 w-4 text-indigo-500" />
                Account & Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">Current Plan:</span>
                      {usage?.plan === "paid" ? (
                        <Badge className="bg-indigo-600 text-white border-0">Pro</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-0">Free</Badge>
                      )}
                    </div>
                    {usage?.plan === "free" && (
                      <p className="text-xs text-gray-500">
                        {usage.papers_used}/{usage.papers_limit} papers used this month
                      </p>
                    )}
                    {usage?.plan === "paid" && (
                      <p className="text-xs text-gray-500">Unlimited AI paper generation</p>
                    )}
                  </div>
                  {usage?.plan === "free" && (
                    <Link href="/apps/examforge/upgrade">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-sm">
                        <Crown className="h-4 w-4" />
                        Upgrade to Pro — ₹499/mo
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-indigo-500" />
                LLM API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-gray-600">
                ExamForge uses your own OpenAI or Gemini API key to generate questions. Your key is encrypted and never shared.
              </p>

              {/* Existing keys */}
              {apiKeys.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Configured Keys</p>
                  {apiKeys.map((k) => (
                    <div key={k.provider} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-md px-2 py-0.5 text-xs font-bold ${k.provider === "openai" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                          {k.provider === "openai" ? "OpenAI" : "Gemini"}
                        </div>
                        <span className="text-sm font-mono text-gray-700">{k.masked_key}</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <button
                        onClick={() => handleDeleteKey(k.provider)}
                        disabled={deleting === k.provider}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        {deleting === k.provider ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add/Update key */}
              <form onSubmit={handleSaveKey} className="space-y-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {apiKeys.length > 0 ? "Update / Add Key" : "Add API Key"}
                </p>

                {saveSuccess && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    API key saved successfully!
                  </div>
                )}
                {saveError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {saveError}
                  </div>
                )}

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Provider</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["openai", "gemini"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProvider(p)}
                        className={`rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${
                          provider === p
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
                        }`}
                      >
                        {p === "openai" ? "🤖 OpenAI" : "✨ Gemini"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">
                    {provider === "openai" ? "OpenAI API Key" : "Gemini API Key"}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showKey ? "text" : "password"}
                      placeholder={provider === "openai" ? "sk-proj-..." : "AIzaSy..."}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="h-10 pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    {provider === "openai" ? (
                      <>Get your key at{" "}
                        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 inline-flex items-center gap-0.5">
                          platform.openai.com <ExternalLink className="h-3 w-3" />
                        </a>
                      </>
                    ) : (
                      <>Get your key at{" "}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600 inline-flex items-center gap-0.5">
                          aistudio.google.com <ExternalLink className="h-3 w-3" />
                        </a>
                      </>
                    )}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={saving || !apiKeyInput.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save API Key
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border border-red-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-red-700">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Signed in as</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={async () => { await logout(); router.push("/apps/examforge/login"); }}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
