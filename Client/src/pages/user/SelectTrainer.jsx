import React, { useEffect, useState } from "react";
import api from "../../api/api";

// Backend URL (local + production safe)
const BACKEND_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://fitness-management-system-yl6n.onrender.com";

const SelectTrainer = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);

  //  Fetch active trainers
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await api.get("/user/trainers");
        setTrainers(res.data?.trainers || []);
      } catch (error) {
        console.error("Fetch trainers error:", error);
        alert("Failed to load trainers");
      }
    };

    fetchTrainers();
  }, []);

  //  Assign trainer
  const handleAssignTrainer = async () => {
    if (!selectedTrainer?._id || !timeSlot) {
      alert("Please select a trainer and time slot");
      return;
    }

    try {
      setLoading(true);

      //  Get active subscription
      const subRes = await api.get("/user/my-subscription");
      const subscription = subRes.data?.subscription;

      if (!subscription?.plan?._id) {
        alert("No active subscription found");
        return;
      }

      //  Get user goals
      const goalsRes = await api.get("/user/goal");
      const goals = goalsRes.data?.goals || [];

      const activeGoal = goals.find((g) => g.status === "active");

      if (!activeGoal?._id) {
        alert("No active goal found");
        return;
      }

      //  Assign trainer
       await api.post("/trainer-assignment/assign-trainer", {
        trainerId: selectedTrainer._id,
        planId: subscription.plan._id,
        goalId: activeGoal._id,
        timeSlot,
      });

      alert("Trainer assigned successfully ✅");

      // reset state
      setSelectedTrainer(null);
      setTimeSlot("");
    } catch (error) {
      console.error("Assign trainer error:", error);
      alert(error.response?.data?.message || "Trainer assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Select Your Trainer
      </h2>

      {/* Trainer List */}
      {trainers.length === 0 ? (
        <p className="text-gray-500 text-center">No trainers available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <div
              key={trainer._id}
              onClick={() => setSelectedTrainer(trainer)}
              className={`border p-4 rounded-lg cursor-pointer transition-all ${
                selectedTrainer?._id === trainer._id
                  ? "border-blue-600 bg-blue-50 shadow"
                  : "hover:shadow"
              }`}
            >
              <img
                src={
                  trainer.profileImage
                    ? `${BACKEND_URL}/uploads/${trainer.profileImage}`
                    : "/default-avatar.png"
                }
                alt={trainer.user?.name || "Trainer"}
                className="w-30 h-40 object-cover rounded"
              />

              <h3 className="font-semibold mt-3">
                {trainer.user?.name || "Trainer"}
              </h3>

              <p className="text-sm text-gray-600">
                Specialization: {trainer.specialization || "N/A"}
              </p>

              <p className="text-sm">
                Experience: {trainer.experience || 0} years
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Time Slot */}
      <div className="mt-8 max-w-sm mx-auto">
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
      <div className="flex justify-center">
        <button
          onClick={handleAssignTrainer}
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Assigning..." : "Assign Trainer"}
        </button>
      </div>
    </div>
  );
};

export default SelectTrainer;



// import React, { useEffect, useState } from "react";
// import api from "../../api/api";
 
// //  backend URL from env
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// const SelectTrainer = () => {
//   const [trainers, setTrainers] = useState([]);
//   const [selectedTrainer, setSelectedTrainer] = useState(null);
//   const [timeSlot, setTimeSlot] = useState("");
//   const [loading, setLoading] = useState(false);

//   //  Fetch active trainers
//   useEffect(() => {
//     const fetchTrainers = async () => {
//       try {
//         const res = await api.get("/user/trainers");
//         setTrainers(res.data?.trainers || []);
//       } catch (error) {
//         console.error("Fetch trainers error:", error);
//         alert("Failed to load trainers");
//       }
//     };
//     fetchTrainers();
//   }, []);

//   //  Assign trainer
//   const handleAssignTrainer = async () => {
//     if (!selectedTrainer || !timeSlot) {
//       alert("Please select a trainer and time slot");
//       return;
//     }

//     try {
//       setLoading(true);

//       // fetch active subscription
//       const res = await api.get("/user/my-subscription");

//       const planId = res.data?.subscription?.plan?._id;

//       if (!planId) {
//         alert("No active subscription found");
//         return;
//       }

//       await api.post("/trainer-assignment/assign-trainer", {
//         trainerId: selectedTrainer._id,
//         planId,
//         timeSlot,
//       });

//       alert("Trainer assigned successfully ✅");
//     } catch (error) {
//       console.error("Assign trainer error:", error);
//       alert(error.response?.data?.message || "Assignment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Select Your Trainer</h2>

//       {/* Trainer List */}
//       {trainers.length === 0 ? (
//         <p className="text-gray-500">No trainers available</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {trainers.map((trainer) => (
//             <div
//               key={trainer._id}
//               onClick={() => setSelectedTrainer(trainer)}
//               className={`border p-4 rounded-lg cursor-pointer transition ${
//                 selectedTrainer?._id === trainer._id
//                   ? "border-green-600 bg-blue-100"
//                   : "hover:shadow"
//               }`}
//             >
//               <img
//                 src={
//                   trainer.profileImage
//                     ? `${BACKEND_URL}/uploads/${trainer.profileImage}`
//                     : "/default-avatar.png"
//                 }
//                 alt={trainer.user?.name || "Trainer"}
//                 className="w-32 h-40 object-cover rounded"
//               />

//               <h3 className="font-semibold mt-3">
//                 {trainer.user?.name || "Trainer"}
//               </h3>
//               <p className="text-sm text-gray-600">
//                 {trainer.specialization}
//               </p>
//               <p className="text-sm">
//                 Experience: {trainer.experience} years
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Time Slot */}
//       <div className="mt-6 max-w-sm">
//         <label className="block mb-2 font-semibold">
//           Select Time Slot
//         </label>
//         <select
//           value={timeSlot}
//           onChange={(e) => setTimeSlot(e.target.value)}
//           className="border p-2 rounded w-full"
//         >
//           <option value="">Select</option>
//           <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM</option>
//           <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
//           <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
//         </select>
//       </div>

//       {/* Assign Button */}
//       <button
//         onClick={handleAssignTrainer}
//         disabled={loading}
//         className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
//       >
//         {loading ? "Assigning..." : "Assign Trainer"}
//       </button>
//     </div>
//   );
// };

// export default SelectTrainer;
