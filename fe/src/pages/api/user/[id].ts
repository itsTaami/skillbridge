import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient, getUserFromToken } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient();
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
    if (error || !data) return res.status(404).json({ message: "User not found" });
    return res.json({ id: data.id, name: data.name, email: data.email, role: data.role, profileImg: data.profile_img, bio: data.bio });
  }

  if (req.method === "PUT") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user || user.id !== id) return res.status(401).json({ message: "Unauthorized" });

    const { name, bio, profileImg } = req.body;
    const { error } = await supabase.from("profiles").update({
      name,
      bio,
      profile_img: profileImg,
    }).eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: "Profile updated" });
  }

  if (req.method === "DELETE") {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: "User deleted" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
