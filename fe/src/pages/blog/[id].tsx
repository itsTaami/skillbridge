import { GetServerSideProps } from "next";
import { Blog } from "@/utils/types";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { transformBlog } from "@/utils/transform";

interface Props { blog: Blog | null; }

export default function BlogDetail({ blog }: Props) {
  if (!blog) return <div className="text-center py-20">Post not found.</div>;
  const date = new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/blog" className="text-sm text-primary hover:underline">← Back to Blog</Link>
        {blog.blogCategory && <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{blog.blogCategory.name}</span>}
      </div>
      {blog.imgList?.[0] && <img src={blog.imgList[0]} alt={blog.title} className="w-full h-64 object-cover rounded-2xl mb-8" />}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h1>
      <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
        <img src={blog.publishedBy.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.publishedBy.name)}&background=6366f1&color=fff`} alt={blog.publishedBy.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">{blog.publishedBy.name}</p>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>
      <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{blog.description}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blogs")
    .select("*, profiles!published_by(*), blog_categories!blog_category_id(*)")
    .eq("id", ctx.params?.id)
    .single();
  return { props: { blog: data ? transformBlog(data) : null } };
};
