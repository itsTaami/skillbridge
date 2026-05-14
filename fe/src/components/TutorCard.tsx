import Link from "next/link";
import { Tutor } from "@/utils/types";
import StarRating from "./StarRating";
import { useSaved } from "@/context/SavedContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface Props {
  tutor: Tutor;
}

const FORMAT_LABEL: Record<string, string> = {
  online: "Online",
  "in-person": "In-Person",
  both: "Online & In-Person",
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
  all: "bg-gray-100 text-gray-600",
};

export default function TutorCard({ tutor }: Props) {
  const { user } = useAuth();
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(tutor._id);

  return (
    <motion.div
      className="card p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <img
          src={tutor.user.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.user.name)}&background=6366f1&color=fff`}
          alt={tutor.user.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{tutor.user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{tutor.subjects.slice(0, 3).join(", ")}</p>
          <StarRating rating={tutor.rating} reviewCount={tutor.reviewCount} />
        </div>
        {user && (
          <button onClick={() => toggleSaved(tutor._id)} className="text-gray-300 hover:text-primary flex-shrink-0">
            <svg className={`w-5 h-5 ${saved ? "text-primary fill-primary" : ""}`} fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{tutor.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`badge ${LEVEL_COLOR[tutor.level]}`}>{tutor.level}</span>
        <span className="badge bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">{FORMAT_LABEL[tutor.format]}</span>
        {tutor.category && <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">{tutor.category.name}</span>}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="font-bold text-gray-900 dark:text-white">${tutor.hourlyRate}<span className="text-sm font-normal text-gray-400">/hr</span></span>
        <Link href={`/tutors/${tutor._id}`} className="btn-primary text-sm py-2 px-4">View Profile</Link>
      </div>
    </motion.div>
  );
}
