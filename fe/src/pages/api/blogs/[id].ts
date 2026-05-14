import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";
import { transformBlog } from "@/utils/transform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("blogs")
      .select("*, profiles!published_by(*), blog_categories!blog_category_id(*)")
      .eq("id", id)
      .single();
    if (error || !data) return res.status(404).json({ message: "Blog not found" });
    return res.json(transformBlog(data));
  }

  if (req.method === "DELETE") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: "Blog deleted" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
