import { useState, useEffect } from "react";
import api from "../../api/api";
import { Star } from "lucide-react";

const TrainerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get("/feedback/trainer-feedback");
        console.log("✅ Trainer feedbacks:", res.data);

        //  Ensure feedbacks is always an array
        setFeedbacks(res.data?.feedbacks || []);
      } catch (err) {
        console.error("❌ Error fetching feedback:", err);
        setError(
          err.response?.data?.message || "Failed to load feedbacks"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  
  if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}
  if (error)
    return <p className="text-red-600 text-center font-medium mt-6">{error}</p>;

  return (
<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6
                bg-transparent dark:bg-slate-900">
  <h2 className="text-xl sm:text-2xl font-bold mb-6
                 text-gray-200 dark:text-slate-100
                 text-center sm:text-left">
    User Feedback
  </h2>

  {/* Empty state */}
  {(!feedbacks || feedbacks.length === 0) && (
    <p className="text-gray-500 dark:text-slate-400 text-center py-12">
      No feedback has been submitted yet.
    </p>
  )}

  {/* Feedback list */}
  <div className="space-y-4">
    {feedbacks?.map((fb) => (
      <div
        key={fb._id}
        className="
          bg-white dark:bg-slate-800
          p-4 sm:p-5
          rounded-2xl
          border border-gray-100 dark:border-slate-700
          shadow-sm hover:shadow-md
          transition
        "
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-slate-100 text-sm sm:text-base">
              {fb.user?.name || "Anonymous"}
            </h4>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              {new Date(fb.createdAt).toLocaleString()}
            </p>
          </div>

          {/* ⭐ Rating */}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  star <= fb.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-slate-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 💬 Comments */}
        {fb.comments && (
          <p className="text-gray-700 dark:text-slate-300 mt-3
                        text-sm sm:text-base italic leading-relaxed">
            {fb.comments}
          </p>
        )}
      </div>
    ))}
  </div>
</div>


  );
};

export default TrainerFeedback;
