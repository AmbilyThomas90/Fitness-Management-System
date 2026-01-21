import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Axios instance for API calls
import plan3 from "../../images/plan3.jpg"; // Default plan image

// Default state for a plan (used when creating or resetting a plan)
const defaultPlanState = {
  planName: "",
  monthlyPlanAmount: "",
  yearlyPlanAmount: "",
  waterStations: false,
  lockerRooms: false,
  wifiService: false,
  cardioClass: false,
  refreshment: false,
  groupFitnessClasses: false,
  personalTrainer: false,
  specialEvents: false,
  cafeOrLounge: false,
};

const Plans = () => {
  const navigate = useNavigate();

  // State variables
  const [plans, setPlans] = useState([]); // List of all plans
  const [showForm, setShowForm] = useState(false); // Show/hide create/edit plan form
  const [showDetails, setShowDetails] = useState(false); // Show/hide plan details
  const [loading, setLoading] = useState(false); // Loading indicator for API requests
  const [planData, setPlanData] = useState(defaultPlanState); // Current plan being created/edited/viewed
  const [isEditMode, setIsEditMode] = useState(false); // True when editing a plan, false for creating
  const [selectedPlanId, setSelectedPlanId] = useState(null); // Holds the plan ID being edited
  const [refresh, setRefresh] = useState(false); // Trigger to refetch plans after add/update/delete

  // Fetch plans when component mounts or refresh state changes
  useEffect(() => {
    fetchPlans();
  }, [refresh]);

  // Fetch all plans from backend
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/plans"); // API GET request
      setPlans(res.data); // Store fetched plans in state
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for text fields and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Update boolean features
      setPlanData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (value === "") {
      // If input cleared, also clear yearlyPlanAmount if monthlyPlanAmount cleared
      setPlanData(prev => ({
        ...prev,
        [name]: "",
        ...(name === "monthlyPlanAmount" && { yearlyPlanAmount: "" }),
      }));
      return;
    }

    // Only allow numbers for numeric fields (except planName)
    if (!/^\d+$/.test(value) && name !== "planName") return;

    // Automatically calculate yearlyPlanAmount from monthlyPlanAmount
    if (name === "monthlyPlanAmount") {
      setPlanData(prev => ({ ...prev, monthlyPlanAmount: value, yearlyPlanAmount: Number(value) * 11}));
      return;
    }

    // Update other fields normally
    setPlanData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create or update a plan
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Prepare payload
  const payload = {
    planName: planData.planName,
    monthlyPlanAmount: Number(planData.monthlyPlanAmount),
    yearlyPlanAmount: Number(planData.monthlyPlanAmount) * 11,
    waterStations: planData.waterStations,
    lockerRooms: planData.lockerRooms,
    wifiService: planData.wifiService,
    cardioClass: planData.cardioClass,
    refreshment: planData.refreshment,
    groupFitnessClasses: planData.groupFitnessClasses,
    personalTrainer: planData.personalTrainer,
    specialEvents: planData.specialEvents,
    cafeOrLounge: planData.cafeOrLounge,
  };

  try {
    let res;
    if (isEditMode) {
      res = await api.put(`/admin/plans/${selectedPlanId}`, payload);
      setPlans(prev => prev.map(p => p._id === selectedPlanId ? res.data : p));
    } else {
      res = await api.post("/admin/create-plan", payload);
      setPlans(prev => [res.data, ...prev]);
    }

    resetForm();
    setRefresh(prev => !prev);
  } catch (error) {
    console.error("Failed to save plan:", error.response?.data || error.message);
    alert(error.response?.data?.error || "Failed to save plan");
  } finally {
    setLoading(false);
  }
};

  // Populate form with existing plan for editing
  const handleEdit = (plan) => {
    setPlanData({
      ...plan,
      monthlyPlanAmount: plan.monthlyPlanAmount.toString(),
      yearlyPlanAmount: plan.yearlyPlanAmount.toString(),
    });
    setSelectedPlanId(plan._id);
    setIsEditMode(true);
    setShowForm(true); // Show form with plan data
  };

  // Delete a plan
  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/admin/plans/${planId}`);
      setPlans(prev => prev.filter(p => p._id !== planId)); // Remove plan from list
    } catch (error) {
      console.error(error);
      alert("Failed to delete plan");
    }
  };

  // Show plan details
  const handleView = (plan) => {
    setPlanData(plan);
    setShowDetails(true);
  };

  // Reset form and modal states
  const resetForm = () => {
    setPlanData(defaultPlanState); // Reset all fields
    setIsEditMode(false);
    setSelectedPlanId(null);
    setShowForm(false);
    setShowDetails(false);
  };

  return (
   <div className="p-4 sm:p-5 md:p-6">
  {/* Header with title and "Create Plan" button */}
  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
    <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 dark:text-white">
      Plans
    </h2>
    <button
      onClick={() => { resetForm(); setShowForm(true); }}
      className="bg-indigo-600 text-white px-4 py-2 rounded w-full md:w-auto hover:bg-indigo-700 transition"
    >
      Create Plan
    </button>
  </div>

  {/* Create/Edit Plan Form */}
  {showForm && (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-4 sm:p-5 md:p-6 rounded-xl shadow mb-6 w-full max-w-lg mx-auto">
      <h3 className="font-semibold mb-4 text-lg sm:text-xl">{isEditMode ? "Edit Plan" : "Create New Plan"}</h3>

      {/* Plan Name */}
      <input
        type="text"
        name="planName"
        placeholder="Plan Name"
        value={planData.planName}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-indigo-400"
        required
      />

      {/* Monthly & Yearly Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="monthlyPlanAmount"
          placeholder="Monthly Amount"
          value={planData.monthlyPlanAmount}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          type="text"
          name="yearlyPlanAmount"
          placeholder="Yearly Amount"
          value={planData.yearlyPlanAmount}
          readOnly
          className="border p-2 rounded bg-gray-100 dark:bg-slate-700"
        />
      </div>

      {/* Feature checkboxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {Object.keys(defaultPlanState)
          .filter(k => !["planName", "monthlyPlanAmount", "yearlyPlanAmount"].includes(k))
          .map(feature => (
            <label key={feature} className="flex items-center gap-2 text-sm sm:text-base">
              <input
                type="checkbox"
                name={feature}
                checked={planData[feature]}
                onChange={handleChange}
                className="accent-indigo-600"
              />
              {feature.replace(/([A-Z])/g, " $1")}
            </label>
          ))}
      </div>

      {/* Form buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-green-700 transition"
        >
          {loading ? "Saving..." : isEditMode ? "Update Plan" : "Save Plan"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded w-full sm:w-auto hover:bg-gray-400 dark:hover:bg-slate-500 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )}

  {/* Plan Details Modal */}
  {showDetails && (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 md:p-6 rounded-xl shadow mb-6 w-full max-w-md mx-auto">
      <h3 className="font-semibold mb-4 text-lg sm:text-xl">Plan Details</h3>
      <p><strong>Name:</strong> {planData.planName}</p>
      <p><strong>Monthly:</strong> ₹{planData.monthlyPlanAmount}</p>
      <p><strong>Yearly:</strong> ₹{planData.yearlyPlanAmount}</p>
      <ul className="ml-5 mt-2 space-y-1">
        {Object.keys(defaultPlanState)
          .filter(k => !["planName", "monthlyPlanAmount", "yearlyPlanAmount"].includes(k))
          .map(f => planData[f] && <li key={f}>✔ {f.replace(/([A-Z])/g, " $1")}</li>)}
      </ul>

      {/* Detail buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={() => { setShowForm(true); setIsEditMode(true); setSelectedPlanId(planData._id); }}
          className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={resetForm}
          className="bg-gray-300 dark:bg-slate-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded w-full sm:w-auto hover:bg-gray-400 dark:hover:bg-slate-500 transition"
        >
          Close
        </button>
      </div>
    </div>
  )}

  {/* List of all plans */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {plans.map(plan => (
      <div key={plan._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
        <img src={plan3} alt={plan.planName} className="w-full h-40 sm:h-44 object-cover" />
        <div className="p-4 sm:p-5">
          <h4 className="text-lg sm:text-xl font-bold mb-1">{plan.planName}</h4>
          <p className="text-md sm:text-lg font-semibold text-indigo-600">
            ₹{plan.monthlyPlanAmount} <span className="text-sm text-gray-500">/ month</span>
          </p>
          <p className="text-sm text-gray-500 mb-3">
            ₹{plan.yearlyPlanAmount} / year
          </p>
          {/* Buttons for each plan */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => handleView(plan)} className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              View
            </button>
            <button onClick={() => handleEdit(plan)} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition">
              Edit
            </button>
            <button onClick={() => handleDelete(plan._id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Plans;




//Plans.jsx handile PlanFormModal.jsx and PlanDetailsModal
// import React, { useEffect, useState } from "react";
// import api from "../../api/api";
// import plan3 from "../../images/plan3.jpg";
// import PlanFormModal from "./PlanFormModal";
// import PlanDetailsModal from "./PlanDetailsModal";

// const defaultPlanState = {
//   planName: "",
//   monthlyPlanAmount: "",
//   yearlyPlanAmount: "",
//   waterStations: false,
//   lockerRooms: false,
//   wifiService: false,
//   cardioClass: false,
//   refreshment: false,
//   groupFitnessClasses: false,
//   personalTrainer: false,
//   specialEvents: false,
//   cafeOrLounge: false,
// };

// const Plans = () => {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Modal states
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   // Plan data & mode
//   const [planData, setPlanData] = useState(defaultPlanState);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedPlanId, setSelectedPlanId] = useState(null);

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       const res = await api.get("/plans");
//       setPlans(res.data);
//     } catch (error) {
//       console.error("Failed to fetch plans:", error);
//     }
//   };

//   const handleDelete = async (planId) => {
//     if (!window.confirm("Are you sure you want to delete this plan?")) return;
//     try {
//       await api.delete(`/admin/plans/${planId}`);
//       setPlans(prev => prev.filter(p => p._id !== planId));
//     } catch (error) {
//       console.error(error);
//       alert("Failed to delete plan");
//     }
//   };

//   const resetModals = () => {
//     setPlanData(defaultPlanState);
//     setIsEditMode(false);
//     setSelectedPlanId(null);
//     setShowFormModal(false);
//     setShowDetailsModal(false);
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Plans</h2>
//         <button
//           onClick={() => { resetModals(); setShowFormModal(true); }}
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           Create Plan
//         </button>
//       </div>

//       {/* Plans List */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {plans.map(plan => (
//           <div key={plan._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
//             <img src={plan3} alt={plan.planName} className="w-full h-44 object-cover" />
//             <div className="p-5">
//               <h4 className="text-xl font-bold mb-2">{plan.planName}</h4>
//               <p className="text-lg font-semibold text-indigo-600">
//                 ₹{plan.monthlyPlanAmount} <span className="text-sm text-gray-500">/ month</span>
//               </p>
//               <p className="text-sm text-gray-500 mb-4">
//                 ₹{plan.yearlyPlanAmount} / year
//               </p>
//               <div className="flex gap-2">
//                 <button onClick={() => { setPlanData(plan); setShowDetailsModal(true); }} className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">View</button>
//                 <button onClick={() => { setPlanData(plan); setSelectedPlanId(plan._id); setIsEditMode(true); setShowFormModal(true); }} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Edit</button>
//                 <button onClick={() => handleDelete(plan._id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">Delete</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modals */}
//       {showFormModal && (
//         <PlanFormModal
//           planData={planData}
//           setPlanData={setPlanData}
//           isEditMode={isEditMode}
//           setIsEditMode={setIsEditMode}
//           selectedPlanId={selectedPlanId}
//           setSelectedPlanId={setSelectedPlanId}
//           setPlans={setPlans}
//           loading={loading}
//           setLoading={setLoading}
//           closeModal={resetModals}
//         />
//       )}

//       {showDetailsModal && (
//         <PlanDetailsModal
//           planData={planData}
//           closeModal={resetModals}
//           setShowFormModal={setShowFormModal}
//           setIsEditMode={setIsEditMode}
//           setSelectedPlanId={setSelectedPlanId}
//         />
//       )}
//     </div>
//   );
// };

// export default Plans;


// import React, { useEffect, useState } from "react";
// import api from "../../api/api";
// import plan3 from "../../images/plan3.jpg";

// const defaultPlanState = {
//   planName: "",
//   monthlyPlanAmount: "",
//   yearlyPlanAmount: "",
//   waterStations: false,
//   lockerRooms: false,
//   wifiService: false,
//   cardioClass: false,
//   refreshment: false,
//   groupFitnessClasses: false,
//   personalTrainer: false,
//   specialEvents: false,
//   cafeOrLounge: false,
// };

// const Plans = () => {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Modal states
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   // Plan data & mode
//   const [planData, setPlanData] = useState(defaultPlanState);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedPlanId, setSelectedPlanId] = useState(null);

//   // Fetch all plans
//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       const res = await api.get("/plans");
//       setPlans(res.data);
//     } catch (error) {
//       console.error("Failed to fetch plans:", error);
//     }
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") return setPlanData(prev => ({ ...prev, [name]: checked }));
//     if (value === "") return setPlanData(prev => ({ ...prev, [name]: "", ...(name === "monthlyPlanAmount" && { yearlyPlanAmount: "" }) }));
//     if (!/^\d+$/.test(value) && name !== "planName") return;
//     if (name === "monthlyPlanAmount") return setPlanData(prev => ({ ...prev, monthlyPlanAmount: value, yearlyPlanAmount: Number(value) * 12 }));
//     setPlanData(prev => ({ ...prev, [name]: value }));
//   };

//   // Create or update plan
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const payload = { ...planData, monthlyPlanAmount: Number(planData.monthlyPlanAmount), yearlyPlanAmount: Number(planData.monthlyPlanAmount) * 12 };
//     try {
//       if (isEditMode) {
//         const res = await api.put(`/admin/plans/${selectedPlanId}`, payload);
//         setPlans(prev => prev.map(p => p._id === selectedPlanId ? res.data : p));
//       } else {
//         const res = await api.post("/admin/create-plan", payload);
//         setPlans(prev => [res.data, ...prev]);
//       }
//       closeModals();
//     } catch (error) {
//       console.error(error);
//       alert("Failed to save plan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (plan) => {
//     setPlanData({ ...plan, monthlyPlanAmount: plan.monthlyPlanAmount.toString(), yearlyPlanAmount: plan.yearlyPlanAmount.toString() });
//     setSelectedPlanId(plan._id);
//     setIsEditMode(true);
//     setShowFormModal(true);
//   };

//   const handleDelete = async (planId) => {
//     if (!window.confirm("Are you sure you want to delete this plan?")) return;
//     try {
//       await api.delete(`/admin/plans/${planId}`);
//       setPlans(prev => prev.filter(p => p._id !== planId));
//     } catch (error) {
//       console.error(error);
//       alert("Failed to delete plan");
//     }
//   };

//   const handleView = (plan) => {
//     setPlanData(plan);
//     setShowDetailsModal(true);
//   };

//   const closeModals = () => {
//     setPlanData(defaultPlanState);
//     setIsEditMode(false);
//     setSelectedPlanId(null);
//     setShowFormModal(false);
//     setShowDetailsModal(false);
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Plans</h2>
//         <button
//           onClick={() => { closeModals(); setShowFormModal(true); }}
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           Create Plan
//         </button>
//       </div>

//       {/* Plan List */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {plans.map(plan => (
//           <div key={plan._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
//             <img src={plan3} alt={plan.planName} className="w-full h-44 object-cover" />
//             <div className="p-5">
//               <h4 className="text-xl font-bold mb-2">{plan.planName}</h4>
//               <p className="text-lg font-semibold text-indigo-600">
//                 ₹{plan.monthlyPlanAmount} <span className="text-sm text-gray-500">/ month</span>
//               </p>
//               <p className="text-sm text-gray-500 mb-4">
//                 ₹{plan.yearlyPlanAmount} / year
//               </p>
//               <div className="flex gap-2">
//                 <button onClick={() => handleView(plan)} className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">View</button>
//                 <button onClick={() => handleEdit(plan)} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Edit</button>
//                 <button onClick={() => handleDelete(plan._id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">Delete</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ------------------- MODALS ------------------- */}

//       {/* Create/Edit Plan Modal */}
//       {showFormModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
//           <div className="bg-white p-6 rounded-xl shadow-xl w-11/12 md:w-1/2 pointer-events-auto relative">
//             <button onClick={closeModals} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold">×</button>
//             <h3 className="font-semibold mb-4">{isEditMode ? "Edit Plan" : "Create Plan"}</h3>
//             <form onSubmit={handleSubmit}>
//               <input type="text" name="planName" placeholder="Plan Name" value={planData.planName} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <input type="text" name="monthlyPlanAmount" placeholder="Monthly Amount" value={planData.monthlyPlanAmount} onChange={handleChange} className="border p-2 rounded" required />
//                 <input type="text" name="yearlyPlanAmount" placeholder="Yearly Amount" value={planData.yearlyPlanAmount} readOnly className="border p-2 rounded bg-gray-100" />
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
//                 {Object.keys(defaultPlanState).filter(key => !["planName","monthlyPlanAmount","yearlyPlanAmount"].includes(key)).map(feature => (
//                   <label key={feature} className="flex items-center gap-2">
//                     <input type="checkbox" name={feature} checked={planData[feature]} onChange={handleChange} />
//                     {feature.replace(/([A-Z])/g," $1")}
//                   </label>
//                 ))}
//               </div>
//               <div className="flex gap-3">
//                 <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//                   {loading ? "Saving..." : isEditMode ? "Update Plan" : "Save Plan"}
//                 </button>
//                 <button type="button" onClick={closeModals} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Details Modal */}
//       {showDetailsModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
//           <div className="bg-white p-6 rounded-xl shadow-xl w-11/12 md:w-1/2 pointer-events-auto relative">
//             <button onClick={closeModals} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold">×</button>
//             <h3 className="font-semibold mb-4">Plan Details</h3>
//             <p><strong>Name:</strong> {planData.planName}</p>
//             <p><strong>Monthly:</strong> ₹{planData.monthlyPlanAmount}</p>
//             <p><strong>Yearly:</strong> ₹{planData.yearlyPlanAmount}</p>
//             <ul className="ml-5 mt-2 space-y-1">
//               {Object.keys(defaultPlanState).filter(key => !["planName","monthlyPlanAmount","yearlyPlanAmount"].includes(key)).map(feature => planData[feature] && <li key={feature}>✔ {feature.replace(/([A-Z])/g," $1")}</li>)}
//             </ul>
//             <div className="flex gap-3 mt-4">
//               <button onClick={() => { setShowFormModal(true); setIsEditMode(true); setSelectedPlanId(planData._id); setShowDetailsModal(false); }} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
//               <button onClick={closeModals} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Plans;



