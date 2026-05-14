import { useState, useEffect } from "react";
import { Tutor, Category } from "@/utils/types";
import TutorCard from "@/components/TutorCard";
import api from "@/utils/api";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [format, setFormat] = useState("");
  const [category, setCategory] = useState("");
  const [maxRate, setMaxRate] = useState("");

  const fetchTutors = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (level) params.set("level", level);
    if (format) params.set("format", format);
    if (category) params.set("category", category);
    if (maxRate) params.set("maxRate", maxRate);
    const { data } = await api.get(`/api/tutors?${params}`);
    setTutors(data);
    setLoading(false);
  };

  useEffect(() => {
    api.get("/api/categories?type=subject").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => { fetchTutors(); }, [level, format, category, maxRate]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchTutors(); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Tutors</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Find expert tutors across hundreds of subjects and skills.</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input className="input flex-1" placeholder="Search by subject (e.g. Math, Python, English...)" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-60 flex-shrink-0 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Level</label>
            <select className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Any level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Format</label>
            <select className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="">Any format</option>
              <option value="online">Online</option>
              <option value="in-person">In-Person</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Max Rate ($/hr)</label>
            <input className="input" type="number" placeholder="e.g. 50" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
          </div>
          <button onClick={() => { setLevel(""); setFormat(""); setCategory(""); setMaxRate(""); setSearch(""); }} className="text-sm text-gray-400 hover:text-primary underline">
            Clear filters
          </button>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="card p-5 h-64 animate-pulse bg-gray-100" />)}
            </div>
          ) : tutors.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No tutors found.</p>
              <p className="text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {tutors.map((t) => <TutorCard key={t._id} tutor={t} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
