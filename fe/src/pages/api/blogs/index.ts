import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";
import { transformBlog } from "@/utils/transform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("blogs")
      .select("*, profiles!published_by(*), blog_categories!blog_category_id(*)")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json((data || []).map(transformBlog));
  }

  if (req.method === "POST") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { title, description, imgList, blogCategoryId } = req.body;
    const { data, error } = await supabase.from("blogs").insert({
      title,
      description,
      img_list: imgList || [],
      published_by: user.id,
      blog_category_id: blogCategoryId || null,
    }).select("*, profiles!published_by(*), blog_categories!blog_category_id(*)").single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(transformBlog(data));
  }

  res.status(405).json({ message: "Method not allowed" });
}
