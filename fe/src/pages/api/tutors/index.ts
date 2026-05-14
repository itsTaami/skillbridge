import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";
import { transformTutor } from "@/utils/transform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();

  if (req.method === "GET") {
    const { category, level, format, maxRate, search } = req.query;

    let query = supabase
      .from("tutors")
      .select("*, profiles!user_id(*), categories!category_id(*)")
      .eq("is_active", true)
      .order("rating", { ascending: false });

    if (category) query = query.eq("category_id", category);
    if (level) query = query.eq("level", level);
    if (format) query = query.eq("format", format);
    if (maxRate) query = query.lte("hourly_rate", Number(maxRate));
    if (search) query = query.contains("subjects", [search as string]);

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: error.message });
    return res.json((data || []).map(transformTutor));
  }

  if (req.method === "POST") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { subjects, level, hourlyRate, format, availability, description, imgs, categoryId } = req.body;
    const { data, error } = await supabase.from("tutors").insert({
      user_id: user.id,
      subjects,
      level,
      hourly_rate: hourlyRate,
      format,
      availability,
      description,
      imgs: imgs || [],
      category_id: categoryId || null,
    }).select("*, profiles!user_id(*), categories!category_id(*)").single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(transformTutor(data));
  }

  res.status(405).json({ message: "Method not allowed" });
}
