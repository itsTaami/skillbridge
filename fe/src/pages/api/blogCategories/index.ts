import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();

  if (req.method === "GET") {
    const { data, error } = await supabase.from("blog_categories").select("*").order("name");
    if (error) return res.status(500).json({ message: error.message });
    return res.json((data || []).map((c) => ({ _id: c.id, name: c.name })));
  }

  if (req.method === "POST") {
    const { data, error } = await supabase.from("blog_categories").insert(req.body).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json({ _id: data.id, name: data.name });
  }

  res.status(405).json({ message: "Method not allowed" });
}
