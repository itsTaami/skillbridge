import Link from "next/link";
import { Blog } from "@/utils/types";
import { motion } from "framer-motion";

interface Props {
  blog: Blog;
}

export default function BlogCard({ blog }: Props) {
  const img = blog.imgList?.[0];
  const date = new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div
      className="card overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40">
        {img ? (
          <img src={img} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-amber-200 dark:text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {blog.blogCategory && (
          <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 self-start">{blog.blogCategory.name}</span>
        )}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{blog.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{blog.description.replace(/<[^>]+>/g, "")}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img
              src={blog.publishedBy.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.publishedBy.name)}&background=6366f1&color=fff`}
              alt={blog.publishedBy.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{blog.publishedBy.name}</p>
              <p className="text-xs text-gray-400">{date}</p>
            </div>
          </div>
          <Link href={`/blog/${blog._id}`} className="text-primary text-sm font-medium hover:underline">Read →</Link>
        </div>
      </div>
    </motion.div>
  );
}
