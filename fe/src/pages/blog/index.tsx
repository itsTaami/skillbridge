import { GetServerSideProps } from "next";
import { Blog } from "@/utils/types";
import BlogCard from "@/components/BlogCard";
import { createServerClient } from "@/lib/supabase/server";
import { transformBlog } from "@/utils/transform";

interface Props { blogs: Blog[]; }

export default function BlogPage({ blogs }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Study tips, career advice, and skill-building guides.</p>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blogs")
    .select("*, profiles!published_by(*), blog_categories!blog_category_id(*)")
    .order("created_at", { ascending: false });
  return { props: { blogs: (data || []).map(transformBlog) } };
};
