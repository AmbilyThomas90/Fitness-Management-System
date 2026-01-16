import React, { useEffect, useState } from "react";
import api from "../../api/api";

/** Default empty profile */
const emptyProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  healthCondition: "NONE",
  fitnessLevel: "BEGINNER", // added fitnessLevel
  isActive: true,
};

const Profile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);
  const [hasProfile, setHasProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);

  /** Fetch profile from backend */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        const data = res.data;

        if (data.hasProfile === false) {
          const tempProfile = {
            ...emptyProfile,
            name: data.user.name,
            email: data.user.email,
          };
          setProfile(tempProfile);
          setOriginalProfile(tempProfile);
          setHasProfile(false);
          setEditMode(true);
          setIsReadOnly(true);
        } else {
          const tempProfile = { ...emptyProfile, ...data.profile };
          setProfile(tempProfile);
          setOriginalProfile(tempProfile);
          setHasProfile(true);
          setEditMode(false);
          setIsReadOnly(true);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setMessage("Failed to load profile ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /** Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: ["age", "height", "weight"].includes(name) ? Number(value) : value,
    }));
  };

  /** Submit create/update */
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    // Send API request to create or update profile
    const res = hasProfile
      ? await api.put("/user/update-profile", profile)
      : await api.post("/user/create-profile", profile);

    // Get updated profile from response
    const updatedProfile = res.data.profile;

    if (!updatedProfile) {
      throw new Error("No profile data returned from API");
    }

    // Update state immediately so the UI reflects latest data
    setProfile({
      ...emptyProfile,
      ...updatedProfile,
      name: updatedProfile.name || profile.name,
      email: updatedProfile.email || profile.email,
    });

    // Update originalProfile for change tracking
    setOriginalProfile({
      ...emptyProfile,
      ...updatedProfile,
      name: updatedProfile.name || profile.name,
      email: updatedProfile.email || profile.email,
    });

    // Mark as having a profile now (important for first-time creation)
    setHasProfile(true);

    // Name & Email display
    setIsReadOnly(false);

    // Switch to view mode
    setEditMode(false);

    // Show success message
    setMessage("Profile saved successfully ✅");
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || err.message || "Failed to save profile ❌");
  }
};

  /** Enable editing */
  const handleEditClick = () => {
    setEditMode(true);
    setIsReadOnly(true); // Name & Email read-only while editing
  };

  /** Check if profile fields changed (excluding Name & Email) */
  const hasChanges = () => {
    const keysToCheck = [
      "phoneNumber",
      "age",
      "gender",
      "height",
      "weight",
      "healthCondition",
      "fitnessLevel", // added fitnessLevel
    ];
    return keysToCheck.some((key) => profile[key] !== originalProfile[key]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Fitness Profile</h2>
        {hasProfile && !editMode && (
          <button
            onClick={handleEditClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* View Mode */}
      {hasProfile && !editMode && (
        <div className="grid gap-4 bg-gray-100 p-4 rounded">
          <ProfileRow label="Name" value={profile.name} />
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow label="Phone" value={profile.phoneNumber} />
          <ProfileRow label="Age" value={profile.age} />
          <ProfileRow label="Gender" value={profile.gender} />
          <ProfileRow label="Height" value={`${profile.height} cm`} />
          <ProfileRow label="Weight" value={`${profile.weight} kg`} />
          <ProfileRow label="Health Condition" value={profile.healthCondition} />
          <ProfileRow label="Fitness Level" value={profile.fitnessLevel} /> {/* added */}
        </div>
      )}

      {/* Edit/Create Mode */}
      {editMode && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Email */}
          <Input label="Name" name="name" value={profile.name} readOnly={isReadOnly} />
          <Input label="Email" name="email" value={profile.email} readOnly={isReadOnly} />

          {/* Other Fields */}
          <Input label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
          <Input label="Age" name="age" type="number" value={profile.age} onChange={handleChange} />

          <div>
            <label className="block mb-1 text-sm font-medium">Gender</label>
            <select name="gender" value={profile.gender} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Input label="Height (cm)" name="height" type="number" value={profile.height} onChange={handleChange} />
          <Input label="Weight (kg)" name="weight" type="number" value={profile.weight} onChange={handleChange} />

          <div>
            <label className="block mb-1 text-sm font-medium">Health Condition</label>
            <select
              name="healthCondition"
              value={profile.healthCondition}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="NONE">None</option>
              <option value="DIABETES">Diabetes</option>
              <option value="HYPERTENSION">Hypertension</option>
              <option value="ASTHMA">Asthma</option>
              <option value="CARDIAC">Heart Condition</option>
              <option value="THYROID">Thyroid</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Fitness Level Dropdown */}
          <div>
            <label className="block mb-1 text-sm font-medium">Fitness Level</label>
            <select
              name="fitnessLevel"
              value={profile.fitnessLevel}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className={`flex-1 py-2 rounded text-white ${
                hasChanges() ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!hasChanges()}
            >
              {hasProfile ? "Update Profile" : "Create Profile"}
            </button>

            {hasProfile && (
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 bg-blue-400 text-white py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

/** ProfileRow component */
const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between border-b py-2">
    <span className="font-semibold">{label}:</span>
    <span className="text-gray-600">{value !== null && value !== undefined && value !== "" ? value : "Not Set"}</span>
  </div>
);

/** Input component */
const Input = ({ label, disabled, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input {...props} disabled={disabled} className="w-full border p-2 rounded disabled:bg-gray-100" />
  </div>
);

export default Profile;
