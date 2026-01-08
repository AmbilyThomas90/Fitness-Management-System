import React, { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import plan3 from "../../images/plan3.jpg";

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
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(defaultPlanState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  //  refresh trigger
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    fetchPlans();
  }, [refresh]);

 const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/plans");
      setPlans(res.data);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setPlanData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    if (value === "") {
      setPlanData(prev => ({ ...prev, [name]: "", ...(name === "monthlyPlanAmount" && { yearlyPlanAmount: "" }) }));
      return;
    }
    if (!/^\d+$/.test(value) && name !== "planName") return;
    if (name === "monthlyPlanAmount") {
      setPlanData(prev => ({ ...prev, monthlyPlanAmount: value, yearlyPlanAmount: Number(value) * 12 }));
      return;
    }
    setPlanData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...planData, monthlyPlanAmount: Number(planData.monthlyPlanAmount), yearlyPlanAmount: Number(planData.monthlyPlanAmount) * 12 };

    try {
      if (isEditMode) {
        const res = await api.put(`/admin/plans/${selectedPlanId}`, payload);
        setPlans(prev => prev.map(p => p._id === selectedPlanId ? res.data : p));
      } else {
        const res = await api.post("/admin/create-plan", payload);
        setPlans(prev => [res.data, ...prev]);
      }
        setRefresh(prev => !prev);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Failed to save plan");
    } finally { setLoading(false); }
  };

  const handleEdit = (plan) => {
    setPlanData({ ...plan, monthlyPlanAmount: plan.monthlyPlanAmount.toString(), yearlyPlanAmount: plan.yearlyPlanAmount.toString() });
    setSelectedPlanId(plan._id);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/admin/plans/${planId}`);
      setPlans(prev => prev.filter(p => p._id !== planId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete plan");
    }
  };

  const handleView = (plan) => {
    setPlanData(plan);
    setShowDetails(true);
  };

  const resetForm = () => {
    setPlanData(defaultPlanState);
    setIsEditMode(false);
    setSelectedPlanId(null);
    setShowForm(false);
    setShowDetails(false);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">Plans</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full md:w-auto hover:bg-indigo-700 transition"
        >
          Create Plan
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded shadow mb-6 w-full max-w-lg mx-auto">
          <h3 className="font-semibold mb-4 text-lg">{isEditMode ? "Edit Plan" : "Create New Plan"}</h3>
          <input type="text" name="planName" placeholder="Plan Name" value={planData.planName} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input type="text" name="monthlyPlanAmount" placeholder="Monthly Amount" value={planData.monthlyPlanAmount} onChange={handleChange} className="border p-2 rounded" required />
            <input type="text" name="yearlyPlanAmount" placeholder="Yearly Amount" value={planData.yearlyPlanAmount} readOnly className="border p-2 rounded bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {Object.keys(defaultPlanState).filter(k => !["planName","monthlyPlanAmount","yearlyPlanAmount"].includes(k)).map(feature => (
              <label key={feature} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={feature} checked={planData[feature]} onChange={handleChange} />
                {feature.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto">{loading ? "Saving..." : isEditMode ? "Update Plan" : "Save Plan"}</button>
            <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto">Cancel</button>
          </div>
        </form>
      )}

      {/* Details */}
      {showDetails && (
        <div className="bg-white p-4 md:p-6 rounded shadow mb-6 w-full max-w-md mx-auto">
          <h3 className="font-semibold mb-4 text-lg">Plan Details</h3>
          <p><strong>Name:</strong> {planData.planName}</p>
          <p><strong>Monthly:</strong> ₹{planData.monthlyPlanAmount}</p>
          <p><strong>Yearly:</strong> ₹{planData.yearlyPlanAmount}</p>
          <ul className="ml-5 mt-2 space-y-1">
            {Object.keys(defaultPlanState).filter(k => !["planName","monthlyPlanAmount","yearlyPlanAmount"].includes(k)).map(f => planData[f] && <li key={f}>✔ {f.replace(/([A-Z])/g, " $1")}</li>)}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button onClick={() => { setShowForm(true); setIsEditMode(true); setSelectedPlanId(planData._id); }} className="bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto">Edit</button>
            <button onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto">Close</button>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
            <img src={plan3} alt={plan.planName} className="w-full h-44 object-cover" />
            <div className="p-5">
              <h4 className="text-xl font-bold mb-2">{plan.planName}</h4>
              <p className="text-lg font-semibold text-indigo-600">
                ₹{plan.monthlyPlanAmount} <span className="text-sm text-gray-500">/ month</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ₹{plan.yearlyPlanAmount} / year
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={() => handleView(plan)} className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">View</button>
                <button onClick={() => handleEdit(plan)} className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(plan._id)} className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">Delete</button>
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



