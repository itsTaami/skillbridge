import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "listing" | "bookings">("profile");
  const [form, setForm] = useState({ name: "", bio: "", profileImg: "" });
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [listingType, setListingType] = useState<"tutor" | "service">("tutor");
  const [tutorForm, setTutorForm] = useState({ subjects: "", level: "all", hourlyRate: "", format: "both", availability: "", description: "" });
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", price: "", deliveryDays: "7", tags: "" });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!user) router.push("/auth/login");
    else setForm({ name: user.name, bio: user.bio || "", profileImg: user.profileImg || "" });
  }, [user, router]);

  useEffect(() => {
    if (tab === "bookings") api.get("/api/bookings").then(({ data }) => setBookings(data));
  }, [tab]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("profiles").update({ name: form.name, bio: form.bio, profile_img: form.profileImg }).eq("id", user.id);
      await refreshUser();
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const postListing = async () => {
    if (!user) return;
    setPosting(true);
    try {
      if (listingType === "tutor") {
        await api.post("/api/tutors", {
          subjects: tutorForm.subjects.split(",").map((s) => s.trim()),
          level: tutorForm.level,
          hourlyRate: Number(tutorForm.hourlyRate),
          format: tutorForm.format,
          availability: tutorForm.availability,
          description: tutorForm.description,
        });
      } else {
        await api.post("/api/services", {
          title: serviceForm.title,
          description: serviceForm.description,
          price: Number(serviceForm.price),
          deliveryDays: Number(serviceForm.deliveryDays),
          tags: serviceForm.tags.split(",").map((t) => t.trim()),
        });
      }
      toast.success("Listing posted!");
    } catch {
      toast.error("Failed to post listing");
    } finally {
      setPosting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=128`}
          alt={user.name}
          className="w-16 h-16 rounded-2xl object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">{user.role} · {user.email}</p>
        </div>
        <button onClick={() => { logout(); router.push("/"); }} className="ml-auto text-sm text-red-400 hover:text-red-500">Logout</button>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 gap-0">
        {(["profile", "listing", "bookings"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
            {t === "listing" ? "Post a Listing" : t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="card p-6 space-y-5 max-w-lg">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label><textarea className="input" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell others about yourself..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Profile Image URL</label><input className="input" value={form.profileImg} onChange={(e) => setForm({ ...form, profileImg: e.target.value })} placeholder="https://..." /></div>
          <button onClick={saveProfile} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      )}

      {tab === "listing" && (
        <div className="card p-6 max-w-lg">
          <div className="flex gap-3 mb-6">
            <button onClick={() => setListingType("tutor")} className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${listingType === "tutor" ? "border-primary bg-indigo-50 text-primary" : "border-gray-200 text-gray-600"}`}>Tutor Listing</button>
            <button onClick={() => setListingType("service")} className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${listingType === "service" ? "border-primary bg-indigo-50 text-primary" : "border-gray-200 text-gray-600"}`}>Service Listing</button>
          </div>
          {listingType === "tutor" ? (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subjects (comma-separated)</label><input className="input" placeholder="Math, Physics, Calculus" value={tutorForm.subjects} onChange={(e) => setTutorForm({ ...tutorForm, subjects: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label><select className="input" value={tutorForm.level} onChange={(e) => setTutorForm({ ...tutorForm, level: e.target.value })}><option value="all">All levels</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate ($)</label><input type="number" className="input" placeholder="25" value={tutorForm.hourlyRate} onChange={(e) => setTutorForm({ ...tutorForm, hourlyRate: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Format</label><select className="input" value={tutorForm.format} onChange={(e) => setTutorForm({ ...tutorForm, format: e.target.value })}><option value="both">Both</option><option value="online">Online</option><option value="in-person">In-Person</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Availability</label><input className="input" placeholder="Weekdays 6-9pm, weekends flexible" value={tutorForm.availability} onChange={(e) => setTutorForm({ ...tutorForm, availability: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label><textarea className="input" rows={4} placeholder="Describe your experience and teaching style..." value={tutorForm.description} onChange={(e) => setTutorForm({ ...tutorForm, description: e.target.value })} /></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Service Title</label><input className="input" placeholder="I will design a professional logo" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label><textarea className="input" rows={4} placeholder="Describe what you offer..." value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Starting Price ($)</label><input type="number" className="input" placeholder="50" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery (days)</label><input type="number" className="input" placeholder="7" value={serviceForm.deliveryDays} onChange={(e) => setServiceForm({ ...serviceForm, deliveryDays: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label><input className="input" placeholder="logo design, branding, Figma" value={serviceForm.tags} onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })} /></div>
            </div>
          )}
          <button onClick={postListing} disabled={posting} className="btn-primary mt-6">{posting ? "Posting..." : "Post Listing"}</button>
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No bookings yet.</p>
          ) : (
            (bookings as Array<{ _id: string; listingType: string; status: string; message: string; createdAt: string }>).map((b) => (
              <div key={b._id} className="card p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{b.listingType} Booking</p>
                  <p className="text-sm text-gray-500 mt-1">{b.message || "No message"}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge capitalize ${b.status === "accepted" ? "bg-green-100 text-green-700" : b.status === "declined" ? "bg-red-100 text-red-700" : b.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{b.status}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
