import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TutorCard from "@/components/TutorCard";
import ServiceCard from "@/components/ServiceCard";
import { Tutor, Service } from "@/utils/types";

interface MatchResult {
  recommendation: string;
  bestType: "tutor" | "service";
  traits: string[];
  matchedListings: (Tutor | Service)[];
}

const QUESTIONS = [
  { key: "need", label: "What do you need help with?", placeholder: "e.g. I want to learn Python for data science, or I need a logo designed for my startup" },
  { key: "goal", label: "What's your main goal?", placeholder: "e.g. Pass my exam, launch a project, build a skill for my career..." },
  { key: "level", label: "What's your current level?", type: "select", options: ["Complete beginner", "Some experience", "Intermediate", "Advanced — just need specific help"] },
  { key: "budget", label: "What's your budget?", type: "select", options: ["Under $20", "$20 – $50", "$50 – $100", "Over $100 / flexible"] },
  { key: "format", label: "Preferred format?", type: "select", options: ["Online sessions", "In-person", "No preference", "I just need a deliverable (not sessions)"] },
  { key: "urgency", label: "How urgent is this?", type: "select", options: ["ASAP (within a week)", "Within a month", "No rush, I'm planning ahead"] },
];

export default function MatchPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const current = QUESTIONS[step];
  const answer = answers[current.key] || "";

  const next = () => {
    if (!answer.trim()) return;
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Match failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const isTutor = result.bestType === "tutor";
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your AI Match is Ready!</h2>
            <p className="text-gray-500 dark:text-gray-400">Based on your answers, here&apos;s what we recommend:</p>
          </div>

          <div className="card p-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.recommendation}</p>
          </div>

          {result.traits.length > 0 && (
            <div className="card p-6 mb-8">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">What to look for:</h3>
              <ul className="space-y-2">
                {result.traits.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-primary mt-0.5">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.matchedListings?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Top {isTutor ? "Tutors" : "Services"} for You
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isTutor
                  ? result.matchedListings.map((item) => <TutorCard key={(item as Tutor)._id} tutor={item as Tutor} />)
                  : result.matchedListings.map((item) => <ServiceCard key={(item as Service)._id} service={item as Service} />)
                }
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href={isTutor ? "/tutors" : "/services"}
              className="btn-primary flex-1 text-center"
            >
              Browse All {isTutor ? "Tutors" : "Services"}
            </Link>
            <button
              onClick={() => { setResult(null); setStep(0); setAnswers({}); }}
              className="btn-outline flex-1"
            >
              Start Over
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Match</h1>
        <p className="text-gray-500 dark:text-gray-400">Answer {QUESTIONS.length} quick questions and let AI find your perfect tutor or service.</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-8">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((step) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="card p-8"
        >
          <p className="text-xs text-gray-400 mb-2">Question {step + 1} of {QUESTIONS.length}</p>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{current.label}</h2>

          {current.type === "select" ? (
            <div className="space-y-3">
              {current.options!.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [current.key]: opt })}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    answer === opt
                      ? "border-primary bg-indigo-50 dark:bg-indigo-900/30 text-primary"
                      : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className="input"
              rows={4}
              placeholder={current.placeholder}
              value={answer}
              onChange={(e) => setAnswers({ ...answers, [current.key]: e.target.value })}
            />
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-0"
            >
              ← Back
            </button>
            <button
              onClick={next}
              disabled={!answer.trim() || loading}
              className="btn-primary"
            >
              {loading ? "Analyzing..." : step === QUESTIONS.length - 1 ? "Find My Match →" : "Next →"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
