import Link from "next/link";
import { GetServerSideProps } from "next";
import TutorCard from "@/components/TutorCard";
import ServiceCard from "@/components/ServiceCard";
import { Tutor, Service } from "@/utils/types";
import { motion } from "framer-motion";
import { createServerClient } from "@/lib/supabase/server";
import { transformTutor, transformService } from "@/utils/transform";

interface Props {
  featuredTutors: Tutor[];
  featuredServices: Service[];
  stats: { tutors: number; subjects: number; sessions: number; students: number };
}

const HOW_IT_WORKS = [
  { step: "1", title: "Describe your need", desc: "Tell us what you want to learn or get done." },
  { step: "2", title: "AI finds your match", desc: "Our AI analyzes your needs and recommends the best tutors or freelancers." },
  { step: "3", title: "Connect & grow", desc: "Book a session or hire a service and start achieving your goals." },
];

export default function Home({ featuredTutors, featuredServices, stats }: Props) {
  const STATS = [
    { label: "Active Tutors", value: stats.tutors >= 10 ? `${stats.tutors}+` : String(stats.tutors) },
    { label: "Subjects Covered", value: stats.subjects >= 10 ? `${stats.subjects}+` : String(stats.subjects) },
    { label: "Sessions Booked", value: stats.sessions > 0 ? `${stats.sessions}+` : "0" },
    { label: "Members", value: stats.students >= 10 ? `${stats.students}+` : String(stats.students) },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Learn anything.<br />Hire anyone.
          </motion.h1>
          <motion.p
            className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            SkillBridge connects you with expert tutors and skilled freelancers. Let AI find your perfect match in seconds.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/match" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Find My Match (AI)
            </Link>
            <Link href="/tutors" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Browse Tutors
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 text-primary rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {featuredTutors.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Tutors</h2>
              <Link href="/tutors" className="text-primary font-medium hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTutors.map((tutor) => <TutorCard key={tutor._id} tutor={tutor} />)}
            </div>
          </div>
        </section>
      )}

      {featuredServices.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Services</h2>
              <Link href="/services" className="text-primary font-medium hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-indigo-200 mb-8">Join thousands of students and freelancers on SkillBridge.</p>
          <Link href="/auth/signup" className="bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const supabase = createServerClient();
    const [tutorsRes, servicesRes, tutorCount, profileCount, bookingCount, categoryCount] = await Promise.all([
      supabase.from("tutors").select("*, profiles!user_id(*), categories!category_id(*)").eq("is_active", true).order("rating", { ascending: false }).limit(3),
      supabase.from("services").select("*, profiles!user_id(*), categories!category_id(*)").eq("is_active", true).order("rating", { ascending: false }).limit(3),
      supabase.from("tutors").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);
    return {
      props: {
        featuredTutors: (tutorsRes.data || []).map(transformTutor),
        featuredServices: (servicesRes.data || []).map(transformService),
        stats: {
          tutors: tutorCount.count || 0,
          subjects: categoryCount.count || 0,
          sessions: bookingCount.count || 0,
          students: profileCount.count || 0,
        },
      },
    };
  } catch {
    return { props: { featuredTutors: [], featuredServices: [], stats: { tutors: 0, subjects: 0, sessions: 0, students: 0 } } };
  }
};
