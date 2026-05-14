import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";
import { createServerClient } from "@/lib/supabase/server";
import { transformTutor, transformService } from "@/utils/transform";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { need, goal, level, budget, format, urgency } = req.body;

  const prompt = `You are an expert advisor for SkillBridge, a platform connecting students with tutors and freelancers.

A user has answered the following questions:
- What they need: ${need}
- Their goal: ${goal}
- Their current level: ${level}
- Budget: ${budget}
- Preferred format: ${format}
- Urgency: ${urgency}

Based on these answers, provide a personalized recommendation. Respond with ONLY valid JSON in this exact format:
{
  "recommendation": "2-3 sentence personalized paragraph recommending whether they should look for a tutor or a freelance service, and what specifically to look for",
  "bestType": "tutor" or "service",
  "traits": ["trait 1", "trait 2", "trait 3", "trait 4"],
  "matchedSubjects": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- bestType is "tutor" if they need to learn/improve a skill, "service" if they need something delivered/built
- traits are 4 specific things they should look for in their ideal match
- matchedSubjects are 2-3 keywords extracted from their need/goal that could match tutor subjects or service tags
- Keep recommendation warm, specific, and actionable`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const raw = completion.choices[0].message.content || "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const result = JSON.parse(jsonMatch[0]);

    // Fetch real matching listings from the DB
    const supabase = createServerClient();
    const subjects: string[] = result.matchedSubjects || [];

    let matchedListings: unknown[] = [];

    if (result.bestType === "tutor") {
      let query = supabase
        .from("tutors")
        .select("*, profiles!user_id(*), categories!category_id(*)")
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .limit(3);

      if (subjects.length > 0) {
        query = supabase
          .from("tutors")
          .select("*, profiles!user_id(*), categories!category_id(*)")
          .eq("is_active", true)
          .overlaps("subjects", subjects)
          .order("rating", { ascending: false })
          .limit(3);
      }

      const { data } = await query;
      const listings = (data || []).map(transformTutor);

      // Fallback to top-rated if no subject match
      if (listings.length === 0 && subjects.length > 0) {
        const { data: fallback } = await supabase
          .from("tutors")
          .select("*, profiles!user_id(*), categories!category_id(*)")
          .eq("is_active", true)
          .order("rating", { ascending: false })
          .limit(3);
        matchedListings = (fallback || []).map(transformTutor);
      } else {
        matchedListings = listings;
      }
    } else {
      const { data } = await supabase
        .from("services")
        .select("*, profiles!user_id(*), categories!category_id(*)")
        .eq("is_active", true)
        .order("rating", { ascending: false })
        .limit(3);
      matchedListings = (data || []).map(transformService);
    }

    res.json({ ...result, matchedListings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI match failed", error: String(err) });
  }
}
