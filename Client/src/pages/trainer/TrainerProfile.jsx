import React, { useEffect, useState } from "react";
import api from "../../api/api";

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    phoneNumber: "",
    specialization: "",
    experience: "",
    bio: "",
    profileImage: null, // for file upload
  });

  /* Fetch Profile */
  const fetchProfile = async () => {
    try {
      const res = await api.get("/trainer/profile");
      setTrainer(res.data.trainer);

      setForm({
        phoneNumber: res.data.trainer.phoneNumber || "",
        specialization: res.data.trainer.specialization || "",
        experience: res.data.trainer.experience || "",
        bio: res.data.trainer.bio || "",
        profileImage: null,
      });
    } catch (error) {
      console.error("Profile fetch error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* Handle Save with FormData for image upload */
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("specialization", form.specialization);
      formData.append("experience", form.experience);
      formData.append("bio", form.bio);

      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }

      const res = await api.put("/trainer/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTrainer(res.data.trainer);
      setIsEditing(false);
    } catch (error) {
      alert("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!trainer) return <p className="p-6">Profile not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-6 text-center">Trainer Profile</h2>

        {/* Profile Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Profile Image */}
          <div className="flex flex-col items-center md:w-1/3 gap-4">
            <img
              src={
                form.profileImage
                  ? URL.createObjectURL(form.profileImage)
                  : trainer.profileImage
                  ? `http://localhost:5000/uploads/${trainer.profileImage}`
                  : "https://via.placeholder.com/150"
              }
              alt="Trainer"
              className="w-40 h-40 rounded-full object-cover border"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, profileImage: e.target.files[0] })
                }
                className="mt-2"
              />
            )}
          </div>

          {/* Right: Profile Info */}
          <div className="md:w-2/3 space-y-4">
            <ProfileRow label="Name" value={trainer.user?.name} />
            <ProfileRow label="Email" value={trainer.user?.email} />

            {/* Phone Number */}
            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              {isEditing ? (
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="font-medium text-gray-800">{trainer.phoneNumber}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <p className="text-gray-500 text-sm">Specialization</p>
              {isEditing ? (
                <select
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select specialization</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="yoga and endurance">Yoga and Endurance</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              ) : (
                <p className="font-medium text-gray-800">{trainer.specialization}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <p className="text-gray-500 text-sm">Experience (years)</p>
              {isEditing ? (
                <input
                  type="number"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="font-medium text-gray-800">{trainer.experience} years</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <p className="text-gray-500 text-sm">Bio</p>
              {isEditing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="font-medium text-gray-800">{trainer.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Edit / Save Buttons */}
        <div className="mt-8 text-center flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium text-gray-800">{value || "—"}</p>
  </div>
);

export default TrainerProfile;
