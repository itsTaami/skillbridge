import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";
import { transformTutor } from "@/utils/transform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("tutors")
      .select("*, profiles!user_id(*), categories!category_id(*)")
      .eq("id", id)
      .single();
    if (error || !data) return res.status(404).json({ message: "Tutor not found" });
    return res.json(transformTutor(data));
  }

  if (req.method === "PUT") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const updates: Record<string, unknown> = {};
    const map: Record<string, string> = { hourlyRate: "hourly_rate", deliveryDays: "delivery_days", categoryId: "category_id" };
    for (const [k, v] of Object.entries(req.body)) {
      updates[map[k] || k] = v;
    }

    const { data, error } = await supabase.from("tutors").update(updates).eq("id", id).select("*, profiles!user_id(*), categories!category_id(*)").single();
    if (error) return res.status(500).json({ message: error.message });
    return res.json(transformTutor(data));
  }

  if (req.method === "DELETE") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { error } = await supabase.from("tutors").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: "Tutor listing deleted" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
