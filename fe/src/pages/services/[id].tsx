import { GetServerSideProps } from "next";
import { Service, Review } from "@/utils/types";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { createServerClient } from "@/lib/supabase/server";
import { transformService, transformReview } from "@/utils/transform";

interface Props { service: Service | null; reviews: Review[]; }

export default function ServiceDetail({ service, reviews: initialReviews }: Props) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState(initialReviews);

  if (!service) return <div className="text-center py-20">Service not found.</div>;

  const handleOrder = async () => {
    if (!user) return toast.error("Please login to place an order.");
    setOrdering(true);
    try {
      await api.post("/api/bookings", { listingId: service._id, listingType: "service", message });
      toast.success("Order request sent!");
      setMessage("");
    } catch {
      toast.error("Failed to place order.");
    } finally {
      setOrdering(false);
    }
  };

  const handleReview = async () => {
    if (!user) return toast.error("Please login to leave a review.");
    try {
      await api.post("/api/reviews", { listingId: service._id, listingType: "service", rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted!");
      const { data } = await api.get(`/api/reviews/${service._id}?type=service`);
      setReviews(data);
      setReviewComment("");
    } catch {
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            {service.imgs?.[0]?.src ? (
              <img src={service.imgs[0].src} alt={service.title} className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <svg className="w-16 h-16 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
            )}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <img src={service.user.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.user.name)}&background=6366f1&color=fff`} alt={service.user.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{service.user.name}</span>
                <StarRating rating={service.rating} reviewCount={service.reviewCount} />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{service.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {service.tags.map((tag) => <span key={tag} className="badge bg-indigo-50 text-indigo-600">{tag}</span>)}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? <p className="text-sm text-gray-400">No reviews yet.</p> : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <img src={r.reviewer.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer.name)}&background=6366f1&color=fff`} alt={r.reviewer.name} className="w-7 h-7 rounded-full" />
                      <span className="text-sm font-medium dark:text-gray-200">{r.reviewer.name}</span>
                      <StarRating rating={r.rating} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
            {user && (
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Leave a Review</h3>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} onClick={() => setReviewRating(s)}>
                      <svg className={`w-6 h-6 ${s <= reviewRating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                  ))}
                </div>
                <textarea className="input mb-3" rows={3} placeholder="Share your experience..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
                <button onClick={handleReview} className="btn-primary text-sm">Submit Review</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${service.price}</p>
            <p className="text-sm text-gray-400 mb-6">Delivery in {service.deliveryDays} days</p>
            <textarea className="input mb-4" rows={4} placeholder="Describe your project requirements..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleOrder} disabled={ordering} className="btn-primary w-full">
              {ordering ? "Sending..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerClient();
  const id = ctx.params?.id as string;
  try {
    const [svcRes, reviewsRes] = await Promise.all([
      supabase.from("services").select("*, profiles!user_id(*), categories!category_id(*)").eq("id", id).single(),
      supabase.from("reviews").select("*, profiles!reviewer_id(*)").eq("listing_id", id).eq("listing_type", "service").order("created_at", { ascending: false }),
    ]);
    return {
      props: {
        service: svcRes.data ? transformService(svcRes.data) : null,
        reviews: (reviewsRes.data || []).map(transformReview),
      },
    };
  } catch {
    return { props: { service: null, reviews: [] } };
  }
};
