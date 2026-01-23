import { useState, useEffect } from "react";
import api from "../../api/api";
import { Star } from "lucide-react";

const UserFeedback = () => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(null);

  // Clear errors when user starts interacting again
  useEffect(() => {
    if (rating > 0) setError("");
  }, [rating]);

  const submitFeedback = async () => {
    if (rating === 0) {
      setError("Please select a rating before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Ensure this endpoint matches your backend route exactly
      // Change this
const res = await api.post("/feedback/user-feedback", { rating, comments });

      setSubmittedFeedback({
        rating,
        comments,
        createdAt: new Date(),
      });

      setSuccess("Thank you for your valuable feedback!");
      setRating(0);
      setComments("");

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("❌ Feedback error:", err);
      setError(
        err.response?.data?.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-xl w-full mx-auto">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
    Trainer Feedback
  </h2>
  <p className="text-xs sm:text-sm text-gray-500 mb-4">
    Rate your experience and leave a comment
  </p>

  {/* ⭐ Rating Stars */}
  <div className="flex gap-2 mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        onClick={() => setRating(star)}
        className={`w-7 h-7 sm:w-8 sm:h-8 cursor-pointer transition-transform duration-150 hover:scale-110 ${
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))}
  </div>

  <textarea
    rows="4"
    placeholder="Write your feedback (optional)"
    className="
      w-full
      border border-gray-300
      rounded-lg
      p-3
      text-sm
      resize-none
      focus:ring-2 focus:ring-indigo-500
      focus:border-indigo-500
      outline-none
    "
    value={comments}
    onChange={(e) => setComments(e.target.value)}
  />

  {success && (
    <p className="text-green-600 text-sm mt-3 font-medium">
      {success}
    </p>
  )}
  {error && (
    <p className="text-red-600 text-sm mt-3 font-medium">
      {error}
    </p>
  )}

  <button
    onClick={submitFeedback}
    disabled={loading || rating === 0}
    className={`w-full mt-4 py-2.5 rounded-lg text-white font-medium transition
      ${
        loading || rating === 0
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`}
  >
    {loading ? "Submitting..." : "Submit Feedback"}
  </button>

  {submittedFeedback && (
    <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
      <h4 className="font-semibold text-gray-800 mb-2">
        Your Submitted Feedback
      </h4>

      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              star <= submittedFeedback.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {submittedFeedback.comments && (
        <p className="text-sm text-gray-700 italic leading-relaxed">
          “{submittedFeedback.comments}”
        </p>
      )}
    </div>
  )}
</div>

  );
};

export default UserFeedback;