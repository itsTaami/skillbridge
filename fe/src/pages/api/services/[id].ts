import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";
import { transformService } from "@/utils/transform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("services")
      .select("*, profiles!user_id(*), categories!category_id(*)")
      .eq("id", id)
      .single();
    if (error || !data) return res.status(404).json({ message: "Service not found" });
    return res.json(transformService(data));
  }

  if (req.method === "PUT") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { data, error } = await supabase.from("services").update(req.body).eq("id", id).select("*, profiles!user_id(*), categories!category_id(*)").single();
    if (error) return res.status(500).json({ message: error.message });
    return res.json(transformService(data));
  }

  if (req.method === "DELETE") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: "Service deleted" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
