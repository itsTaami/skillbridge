import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();

  if (req.method === "GET") {
    const { type } = req.query;
    let query = supabase.from("categories").select("*").order("name");
    if (type) query = query.eq("type", type);
    const { data, error } = await query;
    if (error) return res.status(500).json({ message: error.message });
    return res.json((data || []).map((c) => ({ _id: c.id, name: c.name, type: c.type, icon: c.icon || "" })));
  }

  if (req.method === "POST") {
    const { data, error } = await supabase.from("categories").insert(req.body).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json({ _id: data.id, ...data });
  }

  res.status(405).json({ message: "Method not allowed" });
}
