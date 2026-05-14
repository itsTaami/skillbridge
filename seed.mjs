const PROJECT_URL = "https://yehbqrfdvgiwmtlmlmoh.supabase.co";
const SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaGJxcmZkdmdpd210bG1sbW9oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY3MTUyOCwiZXhwIjoyMDk0MjQ3NTI4fQ.9uqGUpYBFax8KP5xvRgY75WZhnHThqD5E6k8JWJvxQ8";

const headers = {
  "Content-Type": "application/json",
  "apikey": SERVICE_ROLE,
  "Authorization": `Bearer ${SERVICE_ROLE}`,
  "Prefer": "return=representation",
};

const post = (path, body) =>
  fetch(`${PROJECT_URL}${path}`, { method: "POST", headers, body: JSON.stringify(body) });

const get = (path) =>
  fetch(`${PROJECT_URL}${path}`, { method: "GET", headers });

// --- Demo profile UUIDs (fixed so we can re-run safely) ---
const DEMO_USERS = [
  { id: "00000000-0000-0000-0000-000000000001", name: "Alex Carter",    email: "alex@demo.skillbridge.com",    role: "tutor", bio: "Math & Physics tutor with 4 years of experience." },
  { id: "00000000-0000-0000-0000-000000000002", name: "Priya Sharma",   email: "priya@demo.skillbridge.com",   role: "tutor", bio: "Senior data scientist teaching Python and ML from scratch." },
  { id: "00000000-0000-0000-0000-000000000003", name: "James Okafor",   email: "james@demo.skillbridge.com",   role: "tutor", bio: "Certified English teacher specialising in IELTS prep." },
  { id: "00000000-0000-0000-0000-000000000004", name: "Lena Fischer",   email: "lena@demo.skillbridge.com",    role: "both",  bio: "Graphic designer and branding consultant." },
  { id: "00000000-0000-0000-0000-000000000005", name: "Marco Santos",   email: "marco@demo.skillbridge.com",   role: "both",  bio: "Full-stack developer, Next.js enthusiast." },
  { id: "00000000-0000-0000-0000-000000000006", name: "Yui Tanaka",     email: "yui@demo.skillbridge.com",     role: "both",  bio: "Video editor and content creator." },
  { id: "00000000-0000-0000-0000-000000000007", name: "Omar Al-Hassan", email: "omar@demo.skillbridge.com",    role: "tutor", bio: "Chemistry lecturer with MSc from AUM." },
  { id: "00000000-0000-0000-0000-000000000008", name: "Sofia Reyes",    email: "sofia@demo.skillbridge.com",   role: "both",  bio: "Freelance writer and content strategist." },
  { id: "00000000-0000-0000-0000-000000000009", name: "Admin User",     email: "admin@skillbridge.com",        role: "admin", bio: "Platform administrator." },
];

const AVATARS = [
  "https://ui-avatars.com/api/?name=Alex+Carter&background=6366f1&color=fff",
  "https://ui-avatars.com/api/?name=Priya+Sharma&background=ec4899&color=fff",
  "https://ui-avatars.com/api/?name=James+Okafor&background=f59e0b&color=fff",
  "https://ui-avatars.com/api/?name=Lena+Fischer&background=10b981&color=fff",
  "https://ui-avatars.com/api/?name=Marco+Santos&background=3b82f6&color=fff",
  "https://ui-avatars.com/api/?name=Yui+Tanaka&background=8b5cf6&color=fff",
  "https://ui-avatars.com/api/?name=Omar+Al-Hassan&background=ef4444&color=fff",
  "https://ui-avatars.com/api/?name=Sofia+Reyes&background=14b8a6&color=fff",
  "https://ui-avatars.com/api/?name=Admin+User&background=374151&color=fff",
];

// --- Step 1: Insert profiles ---
console.log("Inserting profiles...");
for (let i = 0; i < DEMO_USERS.length; i++) {
  const u = DEMO_USERS[i];
  const res = await post("/rest/v1/profiles", { ...u, profile_img: AVATARS[i] });
  const txt = await res.text();
  if (res.status === 201) {
    console.log(`  ✓ ${u.name}`);
  } else if (txt.includes("duplicate") || txt.includes("already exists") || txt.includes("23505")) {
    console.log(`  ~ ${u.name} (already exists, skipping)`);
  } else {
    console.log(`  ✗ ${u.name} — ${res.status} ${txt}`);
  }
}

// --- Step 2: Get category IDs ---
const catRes = await get("/rest/v1/categories?select=id,name");
const cats = await catRes.json();
const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));
console.log("\n✓ Categories loaded");

// --- Step 3: Insert tutors ---
console.log("\nInserting tutors...");
const tutors = [
  {
    user_id: "00000000-0000-0000-0000-000000000001",
    subjects: ["Mathematics", "Physics"],
    level: "intermediate",
    hourly_rate: 30,
    format: "online",
    availability: "Weekdays 5–9pm, Saturday mornings",
    description: "BSc in Applied Mathematics, 4 years of tutoring. I specialise in making calculus and mechanics simple and intuitive. Students consistently improve by at least one grade within 3 sessions.",
    imgs: [],
    rating: 4.8,
    review_count: 24,
    category_id: catMap["Mathematics"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000002",
    subjects: ["Computer Science", "Data Science"],
    level: "beginner",
    hourly_rate: 45,
    format: "both",
    availability: "Flexible — book anytime",
    description: "Senior data scientist with 6 years at a tech startup. I teach Python from zero to real ML models. Project-based curriculum — you leave with a portfolio piece after 4 sessions.",
    imgs: [],
    rating: 4.9,
    review_count: 41,
    category_id: catMap["Data Science"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000003",
    subjects: ["English"],
    level: "all",
    hourly_rate: 25,
    format: "online",
    availability: "Mon–Fri 8am–8pm",
    description: "Certified English teacher, 7 years of experience. Academic writing, grammar, and IELTS/TOEFL prep. My students average a 1.5 band score improvement in IELTS within 8 weeks.",
    imgs: [],
    rating: 4.7,
    review_count: 38,
    category_id: catMap["English"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000007",
    subjects: ["Chemistry", "Biology"],
    level: "advanced",
    hourly_rate: 35,
    format: "in-person",
    availability: "Weekends + Tuesday evenings",
    description: "MSc Chemistry lecturer helping students master organic chemistry and biochemistry. I use past-paper drills and concept mapping. Ideal for exam preparation at university level.",
    imgs: [],
    rating: 4.6,
    review_count: 19,
    category_id: catMap["Chemistry"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000005",
    subjects: ["Computer Science"],
    level: "intermediate",
    hourly_rate: 40,
    format: "online",
    availability: "Evenings and weekends",
    description: "Full-stack developer with 5 years of professional experience. I tutor web development — HTML, CSS, JavaScript, React, and Next.js. By end of month 1 you'll have a deployed project on the web.",
    imgs: [],
    rating: 4.8,
    review_count: 15,
    category_id: catMap["Computer Science"],
    is_active: true,
  },
];

for (const t of tutors) {
  const res = await post("/rest/v1/tutors", t);
  const ok = res.status === 201;
  console.log(`  ${ok ? "✓" : "✗"} ${t.subjects.join(", ")} (${t.hourly_rate}/hr) — ${ok ? "created" : res.status}`);
}

// --- Step 4: Insert services ---
console.log("\nInserting services...");
const services = [
  {
    user_id: "00000000-0000-0000-0000-000000000004",
    title: "Professional Logo & Brand Identity Design",
    description: "Full brand identity package: logo (primary + variations), color palette, typography guide, and brand usage guidelines. Delivered in AI, SVG, PNG, and PDF. Unlimited revisions until 100% satisfied.",
    price: 75,
    delivery_days: 5,
    tags: ["logo", "branding", "Figma", "Illustrator"],
    imgs: [],
    rating: 4.9,
    review_count: 17,
    category_id: catMap["Graphic Design"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000005",
    title: "Responsive Next.js Website for Your Startup",
    description: "Full responsive web app with Next.js + Tailwind CSS. Includes landing page, about, services, contact form, and basic SEO. Clean modern design, deployed to Vercel. Source code included.",
    price: 150,
    delivery_days: 10,
    tags: ["Next.js", "React", "Tailwind", "web development"],
    imgs: [],
    rating: 5.0,
    review_count: 8,
    category_id: catMap["Web Development"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000006",
    title: "YouTube Video Editing — Shorts & Long-Form",
    description: "Professional editing for YouTube channels. Color grading, captions, intro/outro, background music. Fast turnaround. Specialised in educational and tech content. Packages from 5-min clips to 30-min deep dives.",
    price: 50,
    delivery_days: 3,
    tags: ["video editing", "YouTube", "Premiere Pro", "After Effects"],
    imgs: [],
    rating: 4.8,
    review_count: 22,
    category_id: catMap["Video Editing"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000008",
    title: "SEO Blog Writing — 1000-Word Articles",
    description: "Research-backed, SEO-optimised blog articles on any topic. Keyword integration, meta description, internal link suggestions, and readability scoring. Delivered in Google Docs or Markdown. Revisions included.",
    price: 40,
    delivery_days: 2,
    tags: ["writing", "SEO", "blog", "content"],
    imgs: [],
    rating: 4.7,
    review_count: 33,
    category_id: catMap["Writing & Editing"],
    is_active: true,
  },
  {
    user_id: "00000000-0000-0000-0000-000000000004",
    title: "Social Media Graphics Pack (10 Posts)",
    description: "10 custom-designed social media graphics for Instagram, LinkedIn, or Twitter. On-brand colors, typography, and layout. Includes editable Figma file. Perfect for content creators and small businesses.",
    price: 55,
    delivery_days: 4,
    tags: ["social media", "Canva", "Figma", "Instagram"],
    imgs: [],
    rating: 4.6,
    review_count: 14,
    category_id: catMap["Graphic Design"],
    is_active: true,
  },
];

for (const s of services) {
  const res = await post("/rest/v1/services", s);
  const ok = res.status === 201;
  console.log(`  ${ok ? "✓" : "✗"} ${s.title.slice(0, 55)} — ${ok ? "created" : res.status}`);
}

// --- Step 5: Insert blogs ---
console.log("\nInserting blogs...");
const blogCatRes = await get("/rest/v1/blog_categories?select=id,name");
const blogCats = await blogCatRes.json();
const blogCatMap = Object.fromEntries(blogCats.map(c => [c.name, c.id]));

const blogs = [
  {
    title: "5 Proven Study Techniques That Actually Work",
    description: "Most students study harder, not smarter. In this post I break down 5 evidence-based techniques — spaced repetition, active recall, the Feynman method, interleaving, and retrieval practice — with practical tips to implement each one this week.",
    img_list: [],
    published_by: "00000000-0000-0000-0000-000000000003",
    blog_category_id: blogCatMap["Study Tips"],
  },
  {
    title: "How to Land Your First Freelance Client in 30 Days",
    description: "Starting freelancing feels overwhelming — no portfolio, no reviews, no clients. I built my freelance business from zero using a 4-step system: niche down, build a one-page portfolio, cold outreach to 10 people a day, and over-deliver on your first project. Here's exactly how.",
    img_list: [],
    published_by: "00000000-0000-0000-0000-000000000008",
    blog_category_id: blogCatMap["Freelancing"],
  },
  {
    title: "Python for Beginners: Your First Machine Learning Model",
    description: "You don't need a CS degree to build your first ML model. In this tutorial, we train a simple decision tree classifier on the Titanic dataset using pandas and scikit-learn. By the end you'll understand data cleaning, feature engineering, model training, and evaluation — all in under 50 lines of code.",
    img_list: [],
    published_by: "00000000-0000-0000-0000-000000000002",
    blog_category_id: blogCatMap["Technology"],
  },
  {
    title: "Top 10 In-Demand Skills to Learn in 2025",
    description: "The job market is shifting fast. Based on LinkedIn hiring data and Glassdoor salary trends, these are the 10 skills employers are willing to pay the most for in 2025: AI prompt engineering, data analysis, UX design, cloud architecture, video production, and more.",
    img_list: [],
    published_by: "00000000-0000-0000-0000-000000000009",
    blog_category_id: blogCatMap["Skill Building"],
  },
  {
    title: "From Student to Professional: Building Your Personal Brand",
    description: "Your personal brand is your reputation before you walk in the room. I'll show you how to build a consistent presence on LinkedIn and GitHub that gets recruiters reaching out to you. No followers needed — just consistency and these 6 concrete steps.",
    img_list: [],
    published_by: "00000000-0000-0000-0000-000000000008",
    blog_category_id: blogCatMap["Career Advice"],
  },
];

for (const b of blogs) {
  const res = await post("/rest/v1/blogs", b);
  const ok = res.status === 201;
  console.log(`  ${ok ? "✓" : "✗"} "${b.title.slice(0, 50)}" — ${ok ? "created" : res.status}`);
}

console.log("\n✅ Seed complete!");
console.log("   8 profiles · 5 tutors · 5 services · 5 blogs");
console.log("   Open http://localhost:3000 to see the data.");
