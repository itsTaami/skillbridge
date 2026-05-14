import { useState, useEffect } from "react";
import { Service, Category } from "@/utils/types";
import ServiceCard from "@/components/ServiceCard";
import api from "@/utils/api";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (maxPrice) params.set("maxPrice", maxPrice);
    const { data } = await api.get(`/api/services?${params}`);
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    api.get("/api/categories?type=skill").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => { fetchServices(); }, [category, maxPrice]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchServices(); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Services</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Hire skilled freelancers for design, dev, writing, and more.</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input className="input flex-1" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Max Budget ($)</label>
            <input className="input" type="number" placeholder="e.g. 100" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
          <button onClick={() => { setCategory(""); setMaxPrice(""); setSearch(""); }} className="text-sm text-gray-400 hover:text-primary underline">
            Clear filters
          </button>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><p className="text-lg">No services found.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((s) => <ServiceCard key={s._id} service={s} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
