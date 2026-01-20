import { useState, useEffect } from "react";
import api from "../../api/api";
import { Star } from "lucide-react";

const UserFeedback = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Store submitted feedback
  const [submittedFeedback, setSubmittedFeedback] = useState(null);

  // ===============================
  // Fetch Approved Trainer
  // ===============================
  useEffect(() => {
    const fetchApprovedTrainer = async () => {
      try {
        const res = await api.get(
          "/trainer-assignment/my-approved-trainer"
        );

        console.log("✅ Approved trainer response:", res.data);

        const assignment = res.data.trainerAssignment;

        if (assignment?.trainerId && assignment?.name) {
          setTrainers([
            {
              _id: assignment.trainerId,
              name: assignment.name,
            },
          ]);
          setSelectedTrainerId(assignment.trainerId);
        }
      } catch (err) {
        console.error("❌ Fetch trainer error:", err);
        setError(
          err.response?.data?.message ||
            "No approved trainer found"
        );
      }
    };

    fetchApprovedTrainer();
  }, []);

  // ===============================
  // Submit Feedback
  // ===============================
  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!selectedTrainerId) {
      setError("Please select a trainer.");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/feedback/user-feedback", {
        trainerId: selectedTrainerId,
        rating,
        comments,
      });

      console.log("✅ Feedback submitted:", res.data);

      // ✅ Save feedback locally to show instantly
      setSubmittedFeedback({
        trainerName: trainers[0]?.name,
        rating,
        comments,
        createdAt: new Date(),
      });

      // ✅ UI reset + success
      setSuccess("Thank you for your valuable feedback!");
      setRating(0);
      setComments("");

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("❌ Feedback error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Trainer Feedback
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Help us improve by sharing your experience
      </p>

      {/* 🏋️ Trainer */}
      <select
        value={selectedTrainerId}
        onChange={(e) =>
          setSelectedTrainerId(e.target.value)
        }
        className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select a trainer</option>
        {trainers.map((trainer) => (
          <option key={trainer._id} value={trainer._id}>
            {trainer.name}
          </option>
        ))}
      </select>

      {/* ⭐ Rating */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            onClick={() => setRating(star)}
            className={`w-7 h-7 cursor-pointer ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* 💬 Comment */}
      <textarea
        rows="4"
        placeholder="Write your feedback (optional)"
        className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />

      {/* ✅ Success */}
      {success && (
        <p className="text-green-600 text-sm mt-3 font-medium">
          {success}
        </p>
      )}

      {/* ❌ Error */}
      {error && (
        <p className="text-red-600 text-sm mt-3 font-medium">
          {error}
        </p>
      )}

      {/* 🚀 Submit */}
      <button
        onClick={submitFeedback}
        disabled={loading || rating === 0}
        className={`w-full mt-4 py-2.5 rounded-lg text-white font-medium ${
          loading || rating === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>

      {/* 📝 Submitted Feedback */}
      {submittedFeedback && (
        <div className="mt-6 bg-gray-50 border rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-2">
            Your Feedback
          </h4>

          <p className="text-sm text-gray-600">
            Trainer:{" "}
            <span className="font-medium">
              {submittedFeedback.trainerName}
            </span>
          </p>

          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= submittedFeedback.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {submittedFeedback.comments && (
            <p className="text-sm text-gray-700 italic mt-2">
              “{submittedFeedback.comments}”
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFeedback;
