import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { transformReview } from "@/utils/transform";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const supabase = createServerClient();
  const { listingId, type } = req.query;

  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles!reviewer_id(*)")
    .eq("listing_id", listingId)
    .eq("listing_type", type)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json((data || []).map(transformReview));
}
