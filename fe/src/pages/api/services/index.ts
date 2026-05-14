import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";
import { transformService } from "@/utils/transform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();

  if (req.method === "GET") {
    const { category, maxPrice, search } = req.query;

    let query = supabase
      .from("services")
      .select("*, profiles!user_id(*), categories!category_id(*)")
      .eq("is_active", true)
      .order("rating", { ascending: false });

    if (category) query = query.eq("category_id", category);
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (search) query = query.ilike("title", `%${search}%`);

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: error.message });
    return res.json((data || []).map(transformService));
  }

  if (req.method === "POST") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, price, deliveryDays, tags, imgs, categoryId } = req.body;
    const { data, error } = await supabase.from("services").insert({
      user_id: user.id,
      title,
      description,
      price,
      delivery_days: deliveryDays || 7,
      tags: tags || [],
      imgs: imgs || [],
      category_id: categoryId || null,
    }).select("*, profiles!user_id(*), categories!category_id(*)").single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(transformService(data));
  }

  res.status(405).json({ message: "Method not allowed" });
}
