import React, { useEffect, useState } from "react";
// instance (with baseURL + auth interceptor)
import api from "../../api/api";
/**
 * Default empty profile structure
 * Used when:
 * - profile does not exist yet
 * - initializing state safely
 */
const emptyProfile = {
  name: "",
  email: "",
  phoneNumber: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  healthCondition: "none",
  isActive: true,
};

const Profile = () => {
  // Stores user profile data
  const [profile, setProfile] = useState(emptyProfile);

  // Tells whether profile already exists in DB
  const [hasProfile, setHasProfile] = useState(false);

  // Controls view mode vs edit mode
  const [editMode, setEditMode] = useState(false);

  // Loading state while fetching profile
  const [loading, setLoading] = useState(true);

  // Success / error message
  const [message, setMessage] = useState("");

  /**
   *  Fetch profile on component mount
   * Runs only once (empty dependency array)
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Call backend to fetch logged-in user's profile
        const res = await api.get("/user/profile");

        // Handle different backend response formats safely
        const profileData = res.data.profile || res.data;

        // Set profile state
        setProfile(profileData);

        // Profile exists → view mode
        setHasProfile(true);
        setEditMode(false);
      } catch (err) {
        // If profile not found → allow user to create profile
        if (err.response?.status === 404) {
          setHasProfile(false);
          setEditMode(true);
        } else {
          // Any other error
          setMessage("Failed to load profile ❌");
        }
      } finally {
        // Stop loading spinner
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /**
   *  Handle input field changes
   * Dynamically updates profile object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  /**
   *  Create or Update profile
   * - PUT → update existing profile
   * - POST → create new profile
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let res;

      if (hasProfile) {
        // Update profile
        res = await api.put("/user/update-profile", profile);
      } else {
        // Create profile
        res = await api.post("/user/create-profile", profile);
      }

      // Extract updated profile safely
      const updatedData = res.data.profile || res.data;

      // Update UI state
      setProfile(updatedData);
      setHasProfile(true);
      setEditMode(false);

      setMessage("Profile saved successfully ✅");
      alert("Profile saved successfully ✅");
    } catch (err) {
      console.error("Profile Save Error:", err.response?.data || err.message);

      // Show backend validation error if exists
      const errorMsg =
        err.response?.data?.message || "Failed to save profile";
      setMessage(`${errorMsg} ❌`);
    }
  };

  // Loading UI
  if (loading) return <p className="p-6 text-center">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg mt-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          My Fitness Profile
        </h2>

        {/* Edit button only when profile exists */}
        {hasProfile && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Update Profile
          </button>
        )}
      </div>

      {/* Success / Error message */}
      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/*  PROFILE DISPLAY MODE */}
      {hasProfile && !editMode && (
        <div className="grid grid-cols-1 gap-4 bg-gray-200 p-4 rounded-lg">
          <ProfileRow label="Name" value={profile.name} />
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow label="Phone" value={profile.phoneNumber} />
          <ProfileRow label="Age" value={profile.age} />
          <ProfileRow label="Gender" value={profile.gender} />
          <ProfileRow label="Height" value={`${profile.height} cm`} />
          <ProfileRow label="Weight" value={`${profile.weight} kg`} />
          <ProfileRow label="Health" value={profile.healthCondition} />
        </div>
      )}

      {/* CREATE / EDIT FORM */}
      {editMode && (
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Read-only fields */}
          <Input label="Name" value={profile.name} disabled />
          <Input label="Email" value={profile.email} disabled />

          {/* Editable fields */}
          <Input
            label="Phone Number"
            name="phoneNumber"
            value={profile.phoneNumber || ""}
            onChange={handleChange}
          />

          <Input
            label="Age"
            name="age"
            type="number"
            value={profile.age || ""}
            onChange={handleChange}
          />

          <Input
            label="Height (cm)"
            name="height"
            type="number"
            value={profile.height || ""}
            onChange={handleChange}
          />

          <Input
            label="Weight (kg)"
            name="weight"
            type="number"
            value={profile.weight || ""}
            onChange={handleChange}
          />

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition"
            >
              {hasProfile ? "Update Profile" : "Create Profile"}
            </button>

            {hasProfile && (
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded font-bold hover:bg-gray-500 transition"
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

/*  Reusable profile row */
const ProfileRow = ({ label, value }) => {
  const isEmail = label.toLowerCase() === "email";

  return (
    <div className="flex justify-between border-b border-gray-200 py-2">
      <span className="font-semibold text-gray-700">{label}:</span>

      <span
        className={`text-sm font-medium ${
          isEmail ? "text-gray-700" : "text-gray-600 uppercase"
        }`}
      >
        {value || "Not Set"}
      </span>
    </div>
  );
};

/*  Reusable input field */
const Input = ({ label, disabled, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-medium">{label}</label>
    <input
      {...props}
      disabled={disabled}
      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
      required={!disabled}
    />
  </div>
);

export default Profile;
