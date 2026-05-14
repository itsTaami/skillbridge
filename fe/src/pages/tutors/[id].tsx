import { GetServerSideProps } from "next";
import { Tutor, Review } from "@/utils/types";
import StarRating from "@/components/StarRating";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { createServerClient } from "@/lib/supabase/server";
import { transformTutor, transformReview } from "@/utils/transform";

interface Props {
  tutor: Tutor | null;
  reviews: Review[];
}

const FORMAT_LABEL: Record<string, string> = { online: "Online", "in-person": "In-Person", both: "Online & In-Person" };

export default function TutorDetail({ tutor, reviews: initialReviews }: Props) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviews, setReviews] = useState(initialReviews);

  if (!tutor) return <div className="text-center py-20">Tutor not found.</div>;

  const handleBook = async () => {
    if (!user) return toast.error("Please login to book a session.");
    setBooking(true);
    try {
      await api.post("/api/bookings", { listingId: tutor._id, listingType: "tutor", message });
      toast.success("Booking request sent!");
      setMessage("");
    } catch {
      toast.error("Failed to send booking.");
    } finally {
      setBooking(false);
    }
  };

  const handleReview = async () => {
    if (!user) return toast.error("Please login to leave a review.");
    try {
      await api.post("/api/reviews", { listingId: tutor._id, listingType: "tutor", rating: reviewRating, comment: reviewComment });
      toast.success("Review submitted!");
      const { data } = await api.get(`/api/reviews/${tutor._id}?type=tutor`);
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
          <div className="card p-6 flex gap-5 items-start">
            <img
              src={tutor.user.profileImg || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.user.name)}&background=6366f1&color=fff&size=128`}
              alt={tutor.user.name}
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tutor.user.name}</h1>
              <p className="text-gray-500 mt-1">{tutor.subjects.join(", ")}</p>
              <StarRating rating={tutor.rating} reviewCount={tutor.reviewCount} size="md" />
              <p className="text-sm text-gray-400 mt-1">{tutor.user.bio}</p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">About this tutor</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{tutor.description}</p>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400">Level taught</p><p className="font-medium dark:text-gray-200 capitalize">{tutor.level}</p></div>
              <div><p className="text-gray-400">Format</p><p className="font-medium dark:text-gray-200">{FORMAT_LABEL[tutor.format]}</p></div>
              <div><p className="text-gray-400">Availability</p><p className="font-medium dark:text-gray-200">{tutor.availability}</p></div>
              <div><p className="text-gray-400">Hourly rate</p><p className="font-medium dark:text-gray-200">${tutor.hourlyRate}/hr</p></div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
            ) : (
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
                      <svg className={`w-6 h-6 ${s <= reviewRating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
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
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">${tutor.hourlyRate}<span className="text-base font-normal text-gray-400">/hr</span></p>
            <p className="text-sm text-gray-400 mb-6">{FORMAT_LABEL[tutor.format]}</p>
            <textarea className="input mb-4" rows={4} placeholder="Describe what you need help with..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleBook} disabled={booking} className="btn-primary w-full">
              {booking ? "Sending..." : "Request Session"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">No payment required upfront</p>
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
    const [tutorRes, reviewsRes] = await Promise.all([
      supabase.from("tutors").select("*, profiles!user_id(*), categories!category_id(*)").eq("id", id).single(),
      supabase.from("reviews").select("*, profiles!reviewer_id(*)").eq("listing_id", id).eq("listing_type", "tutor").order("created_at", { ascending: false }),
    ]);
    return {
      props: {
        tutor: tutorRes.data ? transformTutor(tutorRes.data) : null,
        reviews: (reviewsRes.data || []).map(transformReview),
      },
    };
  } catch {
    return { props: { tutor: null, reviews: [] } };
  }
};
