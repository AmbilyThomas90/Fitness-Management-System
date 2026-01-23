import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  UserCircle,
  Pencil,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Ruler,
  Scale,
  HeartPulse,
  Activity,
  CheckCircle,
  AlertCircle,
  Save,
  X
} from "lucide-react";

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
 <div className="mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl">

  {/* Header */}
  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-indigo-50 p-2 ring-1 ring-indigo-100">
        <UserCircle className="h-7 w-7 text-indigo-600" />
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
        My Fitness Profile
      </h2>
    </div>

    {hasProfile && !editMode && (
      <button
        onClick={handleEditClick}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        <Pencil className="h-4 w-4" />
        Update Profile
      </button>
    )}
  </div>

  {/* Message */}
  {message && (
    <div
      className={`mb-5 flex items-center gap-2 rounded-xl p-3 text-sm font-medium ${
        message.includes("✅")
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      {message.includes("✅") ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {message}
    </div>
  )}

  {/* View Mode */}
  {hasProfile && !editMode && (
    <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:p-5">
      <ProfileRow icon={User} label="Name" value={profile.name} />
      <ProfileRow icon={Mail} label="Email" value={profile.email} />
      <ProfileRow icon={Phone} label="Phone" value={profile.phoneNumber} />
      <ProfileRow icon={Calendar} label="Age" value={profile.age} />
      <ProfileRow icon={Users} label="Gender" value={profile.gender} />
      <ProfileRow icon={Ruler} label="Height" value={`${profile.height} cm`} />
      <ProfileRow icon={Scale} label="Weight" value={`${profile.weight} kg`} />
      <ProfileRow icon={HeartPulse} label="Health Condition" value={profile.healthCondition} />
      <ProfileRow icon={Activity} label="Fitness Level" value={profile.fitnessLevel} />
    </div>
  )}

  {/* Edit / Create Mode */}
  {editMode && (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input icon={User} label="Name" name="name" value={profile.name} readOnly={isReadOnly} />
      <Input icon={Mail} label="Email" name="email" value={profile.email} readOnly={isReadOnly} />

      <Input icon={Phone} label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
      <Input icon={Calendar} label="Age" name="age" type="number" value={profile.age} onChange={handleChange} />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <Input icon={Ruler} label="Height (cm)" name="height" type="number" value={profile.height} onChange={handleChange} />
      <Input icon={Scale} label="Weight (kg)" name="weight" type="number" value={profile.weight} onChange={handleChange} />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Health Condition</label>
        <select
          name="healthCondition"
          value={profile.healthCondition}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Fitness Level</label>
        <select
          name="fitnessLevel"
          value={profile.fitnessLevel}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={!hasChanges()}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition ${
            hasChanges()
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "cursor-not-allowed bg-slate-400"
          }`}
        >
          <Save className="h-4 w-4" />
          {hasProfile ? "Update Profile" : "Create Profile"}
        </button>

        {hasProfile && (
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-300"
          >
            <X className="h-4 w-4" />
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
