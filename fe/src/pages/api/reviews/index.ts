import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const supabase = createServerClient();
  const user = await getUserFromToken(req.headers.authorization);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { listingId, listingType, rating, comment } = req.body;

  const { error: insertErr } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    listing_id: listingId,
    listing_type: listingType,
    rating,
    comment: comment || "",
  });
  if (insertErr) return res.status(500).json({ message: insertErr.message });

  // Recalculate average rating on the listing
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("listing_id", listingId)
    .eq("listing_type", listingType);

  if (reviews && reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const table = listingType === "tutor" ? "tutors" : "services";
    await supabase.from(table).update({ rating: avg, review_count: reviews.length }).eq("id", listingId);
  }

  res.status(201).json({ message: "Review submitted" });
}
