import { useEffect, useState } from "react";
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

  //  Image validation handler
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  //  Allow ALL image types
  if (!file.type.startsWith("image/")) {
    setError("Only image files are allowed.");
    setImage(null);
    setPreview("");
    e.target.value = null;
    return;
  }

  //  Valid image
  setError("");
  setImage(file);
  setPreview(URL.createObjectURL(file));
};


  //  Cleanup preview URL
  useEffect(() => {
    return () => {
      preview && URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
          {/* Image Upload */}
          <div className="mb-4 flex flex-col items-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover mb-3 border"
              />
            )}

            {/* Hidden file input */}
            <input
              type="file"
              id="profileImage"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Custom button */}
            <label
              htmlFor="profileImage"
              className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm"
            >
              Select Your Profile Image
            </label>

            {/* Helper text */}
            <p className="text-gray-500 text-xs mt-2">
              JPG, PNG or WEBP • Max 2MB
            </p>
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
            <option value="yoga and endurance">Yoga and Endurance</option>
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
