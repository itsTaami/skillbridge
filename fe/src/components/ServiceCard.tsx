import Link from "next/link";
import { Service } from "@/utils/types";
import StarRating from "./StarRating";
import { motion } from "framer-motion";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  const img = service.imgs?.[0]?.src;

  return (
    <motion.div
      className="card overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-44 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 relative overflow-hidden">
        {img ? (
          <img src={img} alt={service.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-indigo-200 dark:text-indigo-800">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <img
            src={service.user.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.user.name)}&background=6366f1&color=fff`}
            alt={service.user.name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">{service.user.name}</span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{service.title}</h3>
        <StarRating rating={service.rating} reviewCount={service.reviewCount} />

        <div className="flex flex-wrap gap-1 mt-auto">
          {service.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 text-xs">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-xs text-gray-400">Starting at</span>
            <p className="font-bold text-gray-900 dark:text-white">${service.price}</p>
          </div>
          <Link href={`/services/${service._id}`} className="btn-primary text-sm py-2 px-4">View</Link>
        </div>
      </div>
    </motion.div>
  );
}
