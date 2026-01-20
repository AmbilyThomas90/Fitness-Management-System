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

        // ✅ Ensure feedbacks is always an array
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
    return <p className="text-gray-500 text-center mt-6">Loading feedbacks...</p>;
  if (error)
    return <p className="text-red-600 text-center font-medium mt-6">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        User Feedback
      </h2>

      {/* ✅ Empty state */}
      {(!feedbacks || feedbacks.length === 0) && (
        <p className="text-gray-500 text-center">No feedback has been submitted yet.</p>
      )}

      {/* ✅ Feedback list */}
      <div className="space-y-4 mt-4">
        {feedbacks?.map((fb) => (
          <div
            key={fb._id}
            className="bg-white p-5 rounded-2xl shadow-md border border-gray-100"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {fb.user?.name || "Anonymous"}
                </h4>
                <p className="text-xs text-gray-400">
                  {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ⭐ Rating */}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= fb.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 💬 Comments */}
            {fb.comments && (
              <p className="text-gray-700 mt-2 italic">{fb.comments}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerFeedback;
