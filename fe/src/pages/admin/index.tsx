import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";
import { GetServerSideProps } from "next";
import toast from "react-hot-toast";

interface UserRow { id: string; name: string; email: string; role: string; created_at: string; }
interface TutorRow { id: string; profiles: { name: string }; subjects: string[]; hourly_rate: number; is_active: boolean; }
interface ServiceRow { id: string; profiles: { name: string }; title: string; price: number; is_active: boolean; }
interface BlogRow { id: string; title: string; profiles: { name: string }; created_at: string; }

interface Props {
  users: UserRow[];
  tutors: TutorRow[];
  services: ServiceRow[];
  blogs: BlogRow[];
}

export default function AdminPage({ users: initUsers, tutors: initTutors, services: initServices, blogs: initBlogs }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "tutors" | "services" | "blogs">("users");
  const [users, setUsers] = useState(initUsers);
  const [tutors, setTutors] = useState(initTutors);
  const [services, setServices] = useState(initServices);
  const [blogs, setBlogs] = useState(initBlogs);

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  const deleteTutor = async (id: string) => {
    await supabase.from("tutors").delete().eq("id", id);
    setTutors((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tutor listing deleted");
  };

  const deleteService = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service deleted");
  };

  const deleteBlog = async (id: string) => {
    await supabase.from("blogs").delete().eq("id", id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    toast.success("Blog deleted");
  };

  const deleteUser = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="flex border-b border-gray-200 mb-8 gap-0">
        {(["users", "tutors", "services", "blogs"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>

      {tab === "users" && (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Email</th><th className="pb-3 pr-4">Role</th><th className="pb-3 pr-4">Joined</th><th className="pb-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-3 pr-4 font-medium">{u.name}</td>
                <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                <td className="py-3 pr-4 capitalize"><span className="badge bg-indigo-50 text-indigo-600">{u.role}</span></td>
                <td className="py-3 pr-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="py-3"><button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "tutors" && (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="pb-3 pr-4">Tutor</th><th className="pb-3 pr-4">Subjects</th><th className="pb-3 pr-4">Rate</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {tutors.map((t) => (
              <tr key={t.id}>
                <td className="py-3 pr-4 font-medium">{t.profiles?.name || "—"}</td>
                <td className="py-3 pr-4 text-gray-500">{t.subjects.join(", ")}</td>
                <td className="py-3 pr-4">${t.hourly_rate}/hr</td>
                <td className="py-3 pr-4"><span className={`badge ${t.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{t.is_active ? "Active" : "Hidden"}</span></td>
                <td className="py-3"><button onClick={() => deleteTutor(t.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "services" && (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="pb-3 pr-4">Title</th><th className="pb-3 pr-4">Provider</th><th className="pb-3 pr-4">Price</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((s) => (
              <tr key={s.id}>
                <td className="py-3 pr-4 font-medium">{s.title}</td>
                <td className="py-3 pr-4 text-gray-500">{s.profiles?.name || "—"}</td>
                <td className="py-3 pr-4">${s.price}</td>
                <td className="py-3 pr-4"><span className={`badge ${s.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{s.is_active ? "Active" : "Hidden"}</span></td>
                <td className="py-3"><button onClick={() => deleteService(s.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "blogs" && (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500 border-b"><th className="pb-3 pr-4">Title</th><th className="pb-3 pr-4">Author</th><th className="pb-3 pr-4">Date</th><th className="pb-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.map((b) => (
              <tr key={b.id}>
                <td className="py-3 pr-4 font-medium">{b.title}</td>
                <td className="py-3 pr-4 text-gray-500">{b.profiles?.name || "—"}</td>
                <td className="py-3 pr-4 text-gray-400">{new Date(b.created_at).toLocaleDateString()}</td>
                <td className="py-3"><button onClick={() => deleteBlog(b.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const supabase = createServerClient();
  const [usersRes, tutorsRes, servicesRes, blogsRes] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("tutors").select("*, profiles!user_id(name)").order("created_at", { ascending: false }),
    supabase.from("services").select("*, profiles!user_id(name)").order("created_at", { ascending: false }),
    supabase.from("blogs").select("*, profiles!published_by(name)").order("created_at", { ascending: false }),
  ]);
  return {
    props: {
      users: usersRes.data || [],
      tutors: tutorsRes.data || [],
      services: servicesRes.data || [],
      blogs: blogsRes.data || [],
    },
  };
};
