"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Brain,
  CheckCircle,
  ChevronRight,
  Globe,
  MessageCircle,
  Sparkles,
  Star,
  Timer,
  Users,
  Zap,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  institute: string;
  city: string;
  content: string;
  rating: number;
}

const features: Feature[] = [
  {
    icon: <Brain className="w-6 h-6 text-indigo-500" />,
    title: "AI Question Paper Generator",
    description:
      "Generate chapter-wise, difficulty-calibrated question papers for JEE, NEET, and UPSC in seconds using advanced LLMs.",
  },
  {
    icon: <Globe className="w-6 h-6 text-emerald-500" />,
    title: "Multilingual Support",
    description:
      "Create papers and solve doubts in English, Telugu, Hindi, and Tamil — serving students in their native language.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-blue-500" />,
    title: "WhatsApp Doubt Bot",
    description:
      "AI bot trained on your own study material automatically answers repetitive student doubts on WhatsApp 24/7.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-violet-500" />,
    title: "Custom Study Material Training",
    description:
      "Upload your institute's notes, PDFs, and question banks. The AI learns from YOUR content to give accurate answers.",
  },
  {
    icon: <Timer className="w-6 h-6 text-orange-500" />,
    title: "Save 3-5 Hours Weekly",
    description:
      "Eliminate manual question paper creation. Faculty reclaim hours every week to focus on actual teaching.",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Instant Difficulty Calibration",
    description:
      "Set easy, medium, or hard filters. ExamForge balances the paper automatically based on chapter weightage.",
  },
];

const steps: Step[] = [
  {
    number: "01",
    title: "Upload Your Material",
    description:
      "Upload your notes, PDFs, or question banks. ExamForge indexes your content and trains the AI on it.",
  },
  {
    number: "02",
    title: "Configure Your Paper",
    description:
      "Select subject, chapter, exam type (JEE/NEET/UPSC), difficulty level, number of questions, and language.",
  },
  {
    number: "03",
    title: "Generate & Export",
    description:
      "Get a print-ready question paper in seconds. Export to PDF or Word. Edit any question with one click.",
  },
  {
    number: "04",
    title: "Activate Doubt Bot",
    description:
      "Connect WhatsApp. Your students get instant AI-powered answers — anytime, in their preferred language.",
  },
];

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for small institutes just getting started",
    features: [
      "Up to 50 students",
      "20 question papers/month",
      "English language only",
      "Basic doubt bot (100 queries/month)",
      "PDF export",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹2,499",
    period: "/month",
    description: "For growing institutes needing full multilingual power",
    features: [
      "Up to 200 students",
      "Unlimited question papers",
      "All 4 languages (EN, HI, TE, TA)",
      "WhatsApp doubt bot (unlimited)",
      "Custom material training (5 GB)",
      "PDF + Word export",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Institute",
    price: "₹5,999",
    period: "/month",
    description: "For large institutes with multiple branches",
    features: [
      "Unlimited students",
      "Unlimited question papers",
      "All 4 languages + custom",
      "WhatsApp bot + web widget",
      "Custom material training (50 GB)",
      "Analytics dashboard",
      "Dedicated account manager",
      "API access",
    ],
    highlighted: false,
    badge: "Best Value",
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Ramesh Naidu",
    role: "Director",
    institute: "Vijaya IIT Academy",
    city: "Guntur, AP",
    content:
      "We used to spend 4 hours every Sunday making test papers. Now it takes 5 minutes. The Telugu support is a game changer for our students.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Founder",
    institute: "Lakshya NEET Coaching",
    city: "Indore, MP",
    content:
      "Faculty was drowning in WhatsApp messages at midnight. The doubt bot has completely eliminated that. Students get answers instantly in Hindi.",
    rating: 5,
  },
  {
    name: "Karthik Rajan",
    role: "Head Faculty",
    institute: "Pioneer IIT Coaching",
    city: "Coimbatore, TN",
    content:
      "Tamil language question papers for Chemistry — something no other tool offered. Our regional students finally feel comfortable with exams.",
    rating: 5,
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">ExamForge</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Reviews
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Log in
              </Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered for Indian Coaching Institutes
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Generate{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Exam Papers
              </span>{" "}
              in Minutes.{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Solve Doubts
              </span>{" "}
              Automatically.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              ExamForge helps JEE/NEET/UPSC coaching institutes instantly create chapter-wise question papers in{" "}
              <strong>English, Hindi, Telugu & Tamil</strong> — and auto-answers student WhatsApp doubts using AI
              trained on your own study material.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-base font-semibold rounded-xl w-full sm:w-auto"
              >
                Start Free 14-Day Trial
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-8 py-4 text-base font-semibold rounded-xl w-full sm:w-auto"
              >
                Watch Demo
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Setup in under 10 minutes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Works with WhatsApp
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400 font-mono">ExamForge Dashboard</span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-indigo-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
                    Question Paper Generator
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 border border-gray-200 flex-1">
                        JEE Mains
                      </div>
                      <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 border border-gray-200 flex-1">
                        Physics - Ch.4 Motion
                      </div>
                      <div className="bg-indigo-600 rounded-lg px-3 py-2 text-xs text-white">
                        Telugu
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                      <div className="text-xs font-medium text-gray-800">
                        1. ఒక వస్తువు 5 m/s వేగంతో ప్రారంభమై 2 m/s² త్వరణంతో కదులుతోంది. 10 సెకన్ల తర్వాత వేగం ఎంత?
                      </div>
                      <div className="flex gap-2">
                        {["(A) 15 m/s", "(B) 20 m/s", "(C) 25 m/s", "(D) 30 m/s"].map((opt) => (
                          <span
                            key={opt}
                            className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-emerald-600 mb-3 uppercase tracking-wide">
                    WhatsApp Doubt Bot
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 text-xs text-gray-700 border border-gray-200 max-w-fit">
                      Sir, Newton{"'"}s 3rd law explain chesandi 🙏
                    </div>
                    <div className="bg-emerald-600 rounded-lg rounded-tr-none px-3 py-2 text-xs text-white ml-auto max-w-fit">
                      ప్రతి చర్యకు సమాన మరియు వ్యతిరేక ప్రతిచర్య ఉంటుంది. మీ notes లో page 34 చూడండి...
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2 text-xs text-gray-600 text-center">
                      Answered in 2 seconds ⚡
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg hidden md:block">
              Live Preview
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Institutes Onboarded" },
              { value: "3 hrs", label: "Saved per Faculty/Week" },
              { value: "4", label: "Indian Languages Supported" },
              { value: "98%", label: "Doubt Answer Accuracy" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-indigo-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Everything a coaching institute needs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for Tier 2/3 city coaching institutes handling JEE, NEET, and UPSC — not a generic
              tool, but a product that understands your problems.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 rounded-2xl"
              >
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Serving students in their mother tongue
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Students learn better in the language they think in. ExamForge bridges the language gap in Indian
              competitive exam preparation.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { lang: "English", script: "Aa", color: "bg-blue-50 border-blue-200 text-blue-700", exams: "JEE, NEET, UPSC" },
              { lang: "Hindi", script: "अ", color: "bg-orange-50 border-orange-200 text-orange-700", exams: "UPSC, JEE, NEET" },
              { lang: "Telugu", script: "అ", color: "bg-green-50 border-green-200 text-green-700", exams: "EAMCET, JEE, NEET" },
              { lang: "Tamil", script: "அ", color: "bg-red-50 border-red-200 text-red-700", exams: "JEE, NEET, TNPSC" },
            ].map((item) => (
              <div
                key={item.lang}
                className={`rounded-2xl border-2 p-6 text-center ${item.color} transition-transform hover:scale-105`}
              >
                <div className="text-5xl font-bold mb-2">{item.script}</div>
                <div className="font-bold text-lg mb-1">{item.lang}</div>
                <div className="text-xs opacity-70">{item.exams}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Up and running in 4 simple steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No technical expertise needed. If you can use WhatsApp, you can use ExamForge.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent z-0 -translate-x-4" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Tabs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Built for every exam type
            </h2>
          </div>
          <Tabs defaultValue="jee" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="jee">JEE</TabsTrigger>
              <TabsTrigger value="neet">NEET</TabsTrigger>
              <TabsTrigger value="upsc">UPSC</TabsTrigger>
            </TabsList>
            <TabsContent value="jee">
              <Card className="border-indigo-100 rounded-2xl">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                        JEE Mains & Advanced
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Physics, Chemistry & Mathematics
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Generate papers aligned with NTA syllabus. Chapter-wise, full syllabus, or mock test formats.
                        Supports integer type, MCQ, and assertion-reason questions.
                      </p>
                      <ul className="space-y-2">
                        {["NTA-aligned difficulty levels", "Chapter-wise weightage calibration", "Integer, MCQ, Matrix match formats"].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-6 space-y-3">
                      <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                        Sample Generated Question
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-indigo-100 text-sm text-gray-800">
                        <div className="font-medium mb-2">Q. A particle moves in a circle of radius 5m with uniform speed. Time period is 4s. Find centripetal acceleration.</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["(A) 2π² m/s²", "(B) π² m/s²", "(C) 5π²/4 m/s²", "(D) 4π²/5 m/s²"].map((opt) => (
                            <span key={opt} className="text-xs bg-gray-50 border rounded px-2 py-1">{opt}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">✓ Correct: (C) | Difficulty: Medium</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="neet">
              <Card className="border-emerald-100 rounded-2xl">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                        NEET UG & PG
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Biology, Physics & Chemistry
                      </h3>
                      <p className="text-gray-600 mb-4">
                        NCERT-mapped question generation with clinical case-based questions for NEET PG. Perfect for
                        both UG aspirants and medical coaching.
                      </p>
                      <ul className="space-y-2">
                        {["NCERT chapter mapping", "Clinical case-based questions", "Assertion-reason format support"].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-6 space-y-3">
                      <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                        Sample Generated Question
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-emerald-100 text-sm text-gray-800">
                        <div className="font-medium mb-2">Q. Mitosis occurs in which phase of the cell cycle? What is the significance of cytokinesis?</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["(A) S phase", "(B) M phase", "(C) G1 phase", "(D) G2 phase"].map((opt) => (
                            <span key={opt} className="text-xs bg-gray-50 border rounded px-2 py-1">{opt}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">✓ Correct: (B) | Difficulty: Easy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upsc">
              <Card className="border-violet-100 rounded-2xl">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">
                        UPSC CSE & State PSC
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        GS, CSAT & Optional Subjects
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Current affairs-integrated question generation. Supports Hindi medium coaching institutes with
                        full GS paper 1-4 coverage.
                      </p>
                      <ul className="space-y-2">
                        {["Current affairs integration", "Hindi medium full support", "GS Papers 1–4 coverage"].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-6 space-y-3">
                      <div className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-2">
                        Sample Generated Question
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-violet-100 text-sm text-gray-800">
                        <div className="font-medium mb-2">Q. संविधान की किस अनुसूची में राजभाषाओं की सूची दी गई है? (Which schedule lists official languages?)</div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["(A) 6वीं अनुसूची", "(B) 7वीं अनुसूची", "(C) 8वीं अनुसूची", "(D) 9वीं अनुसूची"].map((opt) => (
                            <span key={opt} className="text-xs bg-gray-50 border rounded px-2 py-1">{opt}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">✓ Correct: (C) | Difficulty: Medium</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Trusted by coaching institutes across India
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border border-gray-100 rounded-2xl hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">{`"${t.content}"`}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">
                        {t.role}, {t.institute}
                      </div>
                      <div className="text-xs text-indigo-500">{t.city}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Affordable for every coaching institute
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No expensive enterprise contracts. Pay for what you use. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`rounded-2xl relative ${
                  tier.highlighted
                    ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-100"
                    : "border border-gray-200"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white border-0 px-4 py-1 text-sm">
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                {tier.badge && !tier.highlighted && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-orange-500 text-white border-0 text-xs">
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className={`pb-4 ${tier.highlighted ? "pt-8" : ""}`}>
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {tier.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 text-sm">{tier.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full mb-6 rounded-xl ${
                      tier.highlighted
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                    }`}
                  >
                    Get Started
                  </Button>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* Problem Statement Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 to-violet-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            The problem we solve is real
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Timer className="w-8 h-8 text-yellow-400 mx-auto mb-3" />,
                stat: "3–5 hours",
                desc: "Spent by faculty every week manually creating exam papers",
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />,
                stat: "50+ times",
                desc: "The same WhatsApp doubt answered by faculty every week",
              },
              {
                icon: <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />,
                stat: "0 tools",
                desc: "Affordable AI tools existed for Tier 2/3 coaching institutes — until now",
              },
            ].map((item) => (
              <div key={item.stat} className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                {item.icon}
                <div className="text-2xl font-extrabold text-white mb-2">{item.stat}</div>
                <div className="text-indigo-200 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
            Get Early Access
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Ready to transform your coaching institute?
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Join 500+ coaching institutes already saving time and delighting students with ExamForge. Start your free
            14-day trial — no credit card, no commitment.
          </p>
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">You{"'"}re on the list!</h3>
              <p className="text-gray-600">
                We{"'"}ll reach out within 24 hours to set up your free trial and onboarding call.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-xl border-gray-200 h-12 text-base"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 h-12 whitespace-nowrap"
              >
                Start Free Trial
              </Button>
            </form>
          )}
          <p className="text-xs text-gray-400 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">ExamForge</span>
              </div>
              <p className="text-sm leading-relaxed">
                AI-powered multilingual question paper generator and doubt solver for Indian coaching institutes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                {["Features", "Pricing", "How It Works", "Demo"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Exams</h4>
              <ul className="space-y-2 text-sm">
                {["JEE Mains & Advanced", "NEET UG & PG", "UPSC CSE", "State PSC"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                {["About Us", "Blog", "Contact", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              {`© ${new Date().getFullYear()} ExamForge. All rights reserved.`}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>Made with</span>
              <span className="text-red-400">♥</span>
              <span>for Indian coaching institutes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}