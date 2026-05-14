import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();
  const user = await getUserFromToken(req.headers.authorization);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    return res.json(
      (data || []).map((b) => ({
        _id: b.id,
        client: b.client_id,
        listingId: b.listing_id,
        listingType: b.listing_type,
        message: b.message,
        status: b.status,
        scheduledAt: b.scheduled_at,
        createdAt: b.created_at,
      }))
    );
  }

  if (req.method === "POST") {
    const { listingId, listingType, message, scheduledAt } = req.body;
    const { data, error } = await supabase.from("bookings").insert({
      client_id: user.id,
      listing_id: listingId,
      listing_type: listingType,
      message: message || "",
      scheduled_at: scheduledAt || null,
    }).select().single();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(data);
  }

  res.status(405).json({ message: "Method not allowed" });
}
