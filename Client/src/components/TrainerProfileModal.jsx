import { useState } from "react";
import api from "../api/api";

const TrainerProfileModal = ({ onClose }) => {
  const [form, setForm] = useState({
    phoneNumber: "",
    specialization: "",
    experience: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("specialization", form.specialization);
      formData.append("experience", form.experience);

      if (image) {
        formData.append("profileImage", image);
      }

      await api.post("/trainer/create-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Trainer profile created successfully");
      onClose();
    } catch (err) {
      console.error("Create profile error:", err);
      setError(err?.response?.data?.message || "Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Trainer Profile</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Image */}
          <div className="mb-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover mb-3"
              />
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border p-2 rounded mb-3"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value })
            }
            required
          />

          <select
            className="w-full border p-2 rounded mb-3"
            value={form.specialization}
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
            required
          >
            <option value="">Select Specialization</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="endurance">Endurance</option>
            <option value="flexibility">Flexibility</option>
          </select>

          <input
            type="number"
            placeholder="Experience (years)"
            className="w-full border p-2 rounded mb-4"
            value={form.experience}
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? "Saving..." : "Create Profile"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerProfileModal;
