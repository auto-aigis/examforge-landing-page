"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Zap,
  BarChart2,
  BookOpen,
  CheckCircle,
  Star,
  ArrowRight,
  Brain,
  Target,
  Clock,
  Shield,
  Users,
  Download,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const features: Feature[] = [
  {
    icon: <Brain className="h-6 w-6 text-indigo-500" />,
    title: "AI-Powered Question Generation",
    description:
      "Generate hundreds of curriculum-mapped questions in seconds using advanced NLP trained on JEE, NEET, GATE, and state board patterns.",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
    title: "India-Specific Syllabus Mapping",
    description:
      "Pre-loaded topic trees for JEE Mains, NEET, GATE, UPSC, and 15+ state boards including Telangana, AP, Maharashtra, and Tamil Nadu.",
  },
  {
    icon: <FileText className="h-6 w-6 text-indigo-500" />,
    title: "Instant PDF Export",
    description:
      "Get fully formatted question papers with answer keys, marking schemes, and topic labels — ready to print in one click.",
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-indigo-500" />,
    title: "Student Performance Analytics",
    description:
      "Track weak topics per student, visualize progress over time, and get AI suggestions for the next test focus area.",
  },
  {
    icon: <Target className="h-6 w-6 text-indigo-500" />,
    title: "Difficulty Level Control",
    description:
      "Set easy, medium, or hard ratios. Mix question types — MCQ, integer type, assertion-reason, and subjective in one paper.",
  },
  {
    icon: <Zap className="h-6 w-6 text-indigo-500" />,
    title: "Lightning Fast Creation",
    description:
      "What used to take 3 hours of manual work now takes under 3 minutes. Spend more time teaching, less time preparing.",
  },
];

const steps: Step[] = [
  {
    number: "01",
    title: "Choose Your Exam & Topics",
    description:
      "Select from our pre-mapped JEE, NEET, or state board topic trees — or upload your own syllabus document.",
  },
  {
    number: "02",
    title: "Configure Your Paper",
    description:
      "Set the number of questions, difficulty distribution, question types, marks per question, and time duration.",
  },
  {
    number: "03",
    title: "Generate & Customize",
    description:
      "AI generates your paper in seconds. Review, swap individual questions, or regenerate specific sections instantly.",
  },
  {
    number: "04",
    title: "Export & Distribute",
    description:
      "Download a print-ready PDF with answer key. Share digitally with students or print for your offline classroom.",
  },
];

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹299",
    period: "/month",
    description: "Perfect for solo tutors just getting started",
    features: [
      "20 question papers per month",
      "JEE Mains & NEET topics",
      "PDF export with answer key",
      "Up to 30 students",
      "Basic performance reports",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹799",
    period: "/month",
    description: "Best for small coaching centres",
    features: [
      "Unlimited question papers",
      "All exam boards including state boards",
      "Advanced analytics dashboard",
      "Up to 150 students",
      "Custom branding on PDFs",
      "Regional language support",
      "Priority support",
      "Team collaboration (3 teachers)",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Institute",
    price: "₹1,999",
    period: "/month",
    description: "For growing coaching institutes",
    features: [
      "Everything in Growth",
      "Unlimited students",
      "Up to 10 teacher accounts",
      "API access",
      "Custom syllabus upload",
      "Dedicated account manager",
      "Bulk paper scheduling",
      "White-label option",
    ],
    highlighted: false,
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Ramesh Kumar",
    role: "JEE Physics Tutor, Hyderabad",
    content:
      "I used to spend Sunday evenings making test papers. Now I generate a full JEE-pattern paper in 2 minutes. My students think I work even harder — they do not know my secret!",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "NEET Biology Coach, Kochi",
    content:
      "The NEET unit mapping is spot-on. ExamForge understands the difference between NCERT-level and NEET-level questions. The analytics help me identify which students need extra revision before the exam.",
    rating: 5,
  },
  {
    name: "Suresh Patil",
    role: "Director, Patil Coaching Classes, Pune",
    content:
      "We have 5 teachers and 200 students. ExamForge replaced our ₹1,800/month printed question bank subscription and gives us 10x more flexibility. ROI was immediate.",
    rating: 5,
  },
];

const stats = [
  { value: "800K+", label: "Solo tutors in India" },
  { value: "3 min", label: "Average paper creation time" },
  { value: "15+", label: "Indian exam boards supported" },
  { value: "98%", label: "Teacher satisfaction rate" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ExamForge</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              Log In
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Start Free Trial
            </Button>
          </div>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white md:hidden">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20 pt-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
              🎯 Built for Indian Coaching Institutes
            </Badge>
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Generate{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                JEE, NEET & State Board
              </span>{" "}
              Question Papers in Minutes
            </h1>
            <p className="mb-8 text-lg text-gray-600 sm:text-xl max-w-3xl mx-auto">
              ExamForge is the AI question paper generator built for India&apos;s 800,000+ solo tutors and small coaching centres.
              Stop copy-pasting from old papers. Generate curriculum-mapped exams in under 3 minutes — with answer keys.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-indigo-200">
                Start Free Trial — No Credit Card
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base rounded-xl">
                Watch 2-Min Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free 14-day trial • No setup fee • Cancel anytime
            </p>
          </div>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white border border-gray-100 p-4 text-center shadow-sm"
              >
                <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-1 shadow-2xl shadow-indigo-100">
              <div className="rounded-xl bg-white p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <div className="ml-4 h-6 flex-1 rounded-md bg-gray-100 max-w-sm" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-3 col-span-1">
                    <div className="h-4 rounded bg-indigo-100 w-3/4" />
                    <div className="space-y-2">
                      {["JEE Mains", "NEET UG", "GATE CSE", "TS Intermediate"].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-lg border border-gray-100 p-2 hover:border-indigo-200 cursor-pointer"
                        >
                          <div className="h-2 w-2 rounded-full bg-indigo-400" />
                          <span className="text-xs text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 rounded bg-gray-100 w-1/3" />
                      <Badge className="bg-green-100 text-green-700 text-xs border-0">Ready</Badge>
                    </div>
                    <div className="rounded-lg border border-gray-100 p-4 space-y-2">
                      {[
                        "Q1. A particle moves in a circle of radius R...",
                        "Q2. In the Bohr model of hydrogen atom...",
                        "Q3. The work done by the force F = 3i + 4j...",
                      ].map((q, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-indigo-100 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500">{q}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-indigo-600 text-white text-xs hover:bg-indigo-700">
                        <Download className="h-3 w-3 mr-1" />
                        Export PDF
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs border-gray-200">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to run a modern coaching centre
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From question generation to student analytics — ExamForge handles the paperwork so you can focus on teaching.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200">
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Boards Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Supports all major Indian exam boards
            </h2>
            <p className="mt-3 text-gray-600">Pre-mapped syllabi, updated for the latest curriculum changes</p>
          </div>
          <Tabs defaultValue="competitive" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8 bg-gray-100">
              <TabsTrigger value="competitive" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">
                Competitive
              </TabsTrigger>
              <TabsTrigger value="state" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">
                State Boards
              </TabsTrigger>
              <TabsTrigger value="central" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600">
                Central Boards
              </TabsTrigger>
            </TabsList>
            <TabsContent value="competitive">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto">
                {["JEE Mains", "JEE Advanced", "NEET UG", "GATE", "UPSC Prelims", "CAT", "NDA", "BITSAT"].map((exam) => (
                  <div
                    key={exam}
                    className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 p-3 shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{exam}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="state">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto">
                {["Telangana TS Inter", "AP Intermediate", "Maharashtra HSC", "Tamil Nadu +2", "Karnataka PUC", "Kerala HSE", "Rajasthan RBSE", "UP Board"].map((board) => (
                  <div
                    key={board}
                    className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 p-3 shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{board}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="central">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto">
                {["CBSE Class 10", "CBSE Class 12", "ICSE", "ISC", "NCERT-based", "CBSE Sample Papers", "Class 9 Foundation", "Class 8 Olympiad"].map((board) => (
                  <div
                    key={board}
                    className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 p-3 shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{board}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              From zero to exam-ready in 4 steps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              No technical skills needed. If you can use WhatsApp, you can use ExamForge.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-full hidden lg:block w-full h-0.5 bg-indigo-100 z-0" />
                )}
                <div className="relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white text-xl font-bold shadow-lg shadow-indigo-200">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by teachers across India
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-white border border-gray-100 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Affordable for every coaching centre
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Starting at just ₹299/month — less than what you pay for a printed question bank. All plans include a 14-day free trial.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border ${plan.highlighted ? "border-indigo-500 shadow-xl shadow-indigo-100" : "border-gray-200 shadow-sm"}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white border-0 px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 mb-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.highlighted ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200" : "bg-gray-900 hover:bg-gray-800 text-white"}`}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span>No hidden fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Stop wasting Sundays making question papers
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of Indian tutors and coaching centres already using ExamForge to save time, impress students, and grow their business.
          </p>
          {submitted ? (
            <div className="bg-white/10 rounded-2xl p-8 max-w-md mx-auto">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-xl mb-2">You&apos;re on the list!</h3>
              <p className="text-indigo-200 text-sm">
                We&apos;ll send your free trial access shortly. Check your inbox!
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
                className="bg-white/10 border-white/20 text-white placeholder:text-indigo-300 focus:border-white focus:bg-white/20 h-12"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold whitespace-nowrap h-12 px-6"
              >
                Get Free Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
          <p className="mt-4 text-indigo-300 text-xs">
            No spam. No credit card. Just your free 14-day trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ExamForge</span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              AI question paper generator for Indian coaching institutes
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            {`© ${new Date().getFullYear()} ExamForge. Made with ❤️ for Indian educators.`}
          </div>
        </div>
      </footer>
    </main>
  );
}