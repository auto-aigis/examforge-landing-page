"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../_components/AuthProvider";
import AppNav from "../_components/AppNav";
import { apiFetch } from "../_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle, Crown, Zap, Loader2, AlertCircle, FileText, BarChart2, Shield, ArrowLeft
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

const PRO_FEATURES = [
  { icon: Zap, text: "Unlimited AI question paper generation" },
  { icon: FileText, text: "All exam boards: JEE, NEET, State Board" },
  { icon: BarChart2, text: "Student performance analytics & heatmaps" },
  { icon: Shield, text: "PDF export — questions & answer keys" },
  { icon: Crown, text: "Priority support" },
];

function UpgradeContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rzpLoaded, setRzpLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/apps/examforge/login");
  }, [user, loading, router]);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).Razorpay) { setRzpLoaded(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRzpLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleUpgrade = async () => {
    if (!rzpLoaded) {
      setError("Payment SDK not loaded. Please refresh and try again.");
      return;
    }
    setProcessing(true);
    setError("");

    try {
      const order = await apiFetch<{
        order_id: string; amount: number; currency: string; key_id: string;
      }>("/api/payments/create-order", { method: "POST" });

      const rzp = new window.Razorpay({
        key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "ExamForge",
        description: "Pro Plan — ₹499/month",
        order_id: order.order_id,
        prefill: { email: user?.email || "" },
        theme: { color: "#4f46e5" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await apiFetch("/api/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            setSuccess(true);
            setTimeout(() => router.push("/apps/examforge/dashboard?payment=success"), 2000);
          } catch {
            setError("Payment verification failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Failed to create payment order. Please try again.");
      setProcessing(false);
    }
  };

  if (loading || !user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="flex min-h-screen items-center justify-center pt-16">
          <Card className="w-full max-w-md border border-green-200 shadow-sm text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Pro!</h2>
            <p className="text-gray-500 text-sm mb-1">Payment verified. Your plan has been upgraded.</p>
            <p className="text-gray-400 text-xs">Redirecting to dashboard...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <main className="mx-auto max-w-2xl px-4 pt-20 pb-12 sm:px-6">
        <Link
          href="/apps/examforge/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Upgrade to Pro</h1>
          <p className="mt-2 text-gray-500">Unlock unlimited AI paper generation and all features</p>
        </div>

        <Card className="border-2 border-indigo-500 shadow-xl shadow-indigo-100 mb-6">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto mb-2 inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
              Pro Plan
            </div>
            <div className="flex items-end justify-center gap-1">
              <span className="text-5xl font-bold text-gray-900">₹499</span>
              <span className="text-gray-500 mb-2">/month</span>
            </div>
            <p className="text-sm text-gray-500">One-time payment, month-to-month</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {PRO_FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button
              onClick={handleUpgrade}
              disabled={processing || !rzpLoaded}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base font-semibold gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="h-5 w-5" />
                  Pay ₹499 & Upgrade Now
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                Secured by Razorpay
              </div>
              <span>•</span>
              <span>Instant activation</span>
              <span>•</span>
              <span>Indian payment methods</span>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          By upgrading, you agree to our terms of service. The plan renews monthly.
          Cancel anytime by contacting support.
        </p>
      </main>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense>
      <UpgradeContent />
    </Suspense>
  );
}
