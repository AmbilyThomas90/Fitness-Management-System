import React, { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState(null); // Store trainer data
  const [loading, setLoading] = useState(true); // Loading state
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const [preview, setPreview] = useState(null); // Preview selected image
  const [error, setError] = useState(""); // Image/file errors

  const [form, setForm] = useState({
    phoneNumber: "",
    specialization: "",
    experience: "",
    bio: "",
    profileImage: null, // file object
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/trainer/profile"); // Fetch trainer data
        setTrainer(res.data.trainer);
        setForm({
          phoneNumber: res.data.trainer.phoneNumber || "",
          specialization: res.data.trainer.specialization || "",
          experience: res.data.trainer.experience || "",
          bio: res.data.trainer.bio || "",
          profileImage: null,
        });
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ================= HANDLE IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed (JPG, PNG, WEBP).");
      setForm({ ...form, profileImage: null });
      setPreview(null);
      e.target.value = "";
      return;
    }

    setError(""); // clear previous errors
    setForm({ ...form, profileImage: file });
    setPreview(URL.createObjectURL(file));
  };

  /* ================= CLEAN UP PREVIEW URL ================= */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview); // Avoid memory leaks
    };
  }, [preview]);

  /* ================= SAVE UPDATED PROFILE ================= */
  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Only append fields that are not null/empty
      if (form.phoneNumber) formData.append("phoneNumber", form.phoneNumber);
      if (form.specialization) formData.append("specialization", form.specialization);
      if (form.experience) formData.append("experience", form.experience);
      if (form.bio) formData.append("bio", form.bio);
      if (form.profileImage) formData.append("profileImage", form.profileImage);

      const res = await api.put("/trainer/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTrainer(res.data.trainer);
      setIsEditing(false);
      setPreview(null);
      setError("");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err.response?.data || err);
      alert(err.response?.data?.message || "Profile update failed!");
    }
  };

  /* ================= LOADING OR ERROR STATES ================= */

  if (loading) 
  {
    return(<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
      )}
  if (!trainer) return <p className="p-6">Profile not found</p>;

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-blue-50 px-4 sm:px-6 py-6 flex justify-center items-start">
  <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">

    {/* ================= HEADER ================= */}
    <div className="bg-indigo-500 px-4 sm:px-8 py-5 sm:py-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
        Trainer Profile
      </h2>
    </div>

    {/* ================= CONTENT ================= */}
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">

        {/* ================= IMAGE UPLOAD ================= */}
        <div className="flex flex-col items-center md:w-1/3 gap-4">
          <div className="relative">
            <img
              src={
                preview
                  ? preview
                  : trainer.profileImage
                  ? `http://localhost:5000/uploads/${trainer.profileImage}`
                  : "https://via.placeholder.com/150"
              }
              alt="Trainer"
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>

          {isEditing && (
            <>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profileImage"
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow hover:bg-indigo-700 transition"
              >
                Select Profile Image
              </label>

              {error && (
                <p className="text-xs text-red-500 text-center">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* ================= INFO ================= */}
        <div className="md:w-2/3 space-y-5">

          <p className="text-gray-800 text-sm sm:text-base">
            <span className="font-semibold">Name:</span>{" "}
            {trainer.user?.name}
          </p>

          <p className="text-gray-800 text-sm sm:text-base break-all">
            <span className="font-semibold">Email:</span>{" "}
            {trainer.user?.email}
          </p>

          {/* Phone */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            {isEditing ? (
              <input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            ) : (
              <p className="text-gray-800 text-sm sm:text-base">
                {trainer.phoneNumber}
              </p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Specialization</p>
            {isEditing ? (
              <select
                value={form.specialization}
                onChange={(e) =>
                  setForm({ ...form, specialization: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              >
                <option value="">Select</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="yoga and endurance">Yoga and Endurance</option>
                <option value="flexibility">Flexibility</option>
              </select>
            ) : (
              <p className="text-gray-800 capitalize text-sm sm:text-base">
                {trainer.specialization}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Experience</p>
            {isEditing ? (
              <input
                type="number"
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              />
            ) : (
              <p className="text-gray-800 text-sm sm:text-base">
                {trainer.experience} years
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
            >
              Save
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setPreview(null);
                setError("");
              }}
              className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  </div>
</div>


  );
};

export default TrainerProfile;
