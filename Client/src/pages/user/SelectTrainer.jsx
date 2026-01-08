import React, { useEffect, useState } from "react";
import api from "../../api/api";

const SelectTrainer = () => {
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [timeSlot, setTimeSlot] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch active trainers
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await api.get("/user/trainers"); //  fetch trainers 
                setTrainers(res.data.trainers || []);
            } catch (error) {
                console.error("Fetch trainers error:", error);
                alert("Failed to load trainers");
            }
        };
        fetchTrainers();
    }, []);

    // Assign trainer to user
   const handleAssignTrainer = async () => {
  if (!selectedTrainer || !timeSlot) {
    alert("Please select a trainer and time slot");
    return;
  }

  try {
    setLoading(true);

    // ✅ fetch active subscription
    const res = await api.get("/user/my-subscription");

    const planId = res.data.subscription.plan._id;

    await api.post("/trainer-assignment/assign-trainer", {
      trainerId: selectedTrainer._id,
      planId,
      timeSlot,
    });

    alert("Trainer assigned successfully ✅");
  } catch (error) {
    console.error("Assign trainer error:", error);
    alert(error.response?.data?.message || "Assignment failed");
  } finally {
    setLoading(false);
  }
};


    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Select Your Trainer</h2>

            {/* Trainer List */}
            {trainers.length === 0 ? (
                <p className="text-gray-500">No trainers available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trainers.map((trainer) => (
                        <div
                            key={trainer._id}
                            onClick={() => setSelectedTrainer(trainer)}
                            className={`border p-4 rounded-lg cursor-pointer transition ${selectedTrainer?._id === trainer._id
                                    ? "border-green-600 bg-blue-100"
                                    : "hover:shadow"
                                }`}
                        >
                            <img
                                src={`http://localhost:5000/uploads/${trainer.profileImage}`}
                                alt={trainer.name}
                                className="w-35 h-40 object-cover rounded"
                            />

                            <h3 className="font-semibold mt-3">{trainer.user?.name}</h3>
                            <p className="text-sm text-gray-600">
                                {trainer.specialization}
                            </p>
                            <p className="text-sm">
                                Experience: {trainer.experience} years
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Time Slot */}
            <div className="mt-6 max-w-sm">
                <label className="block mb-2 font-semibold">
                    Select Time Slot
                </label>
                <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Select</option>
                    <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM</option>
                    <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                    <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                </select>
            </div>

            {/* Assign Button */}
            <button
                onClick={handleAssignTrainer}
                disabled={loading}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
                {loading ? "Assigning..." : "Assign Trainer"}
            </button>
        </div>
    );
};

export default SelectTrainer;
