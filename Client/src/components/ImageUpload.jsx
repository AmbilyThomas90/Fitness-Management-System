import { useState } from "react";

const ImageUpload = ({ value, onChange }) => {
  const [preview, setPreview] = useState(value || "");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    //  Validation
    if (!file.type.startsWith("image/")) {
      return alert("Only image files allowed");
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert("Image must be under 2MB");
    }

    // Preview
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trainer_profiles"); // Cloudinary preset

    try {
      setLoading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      onChange(data.secure_url); // return URL to parent
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="cursor-pointer">
        <div className="w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">Upload Image</span>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
      </label>

      {loading && <p className="text-xs text-blue-500">Uploading...</p>}
    </div>
  );
};

export default ImageUpload;
