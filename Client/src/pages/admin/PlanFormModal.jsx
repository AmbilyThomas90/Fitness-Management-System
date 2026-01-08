// PlanFormModal.jsx
import React from "react";
import api from "../../api/api";

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

const PlanFormModal = ({ planData, setPlanData, isEditMode, setIsEditMode, selectedPlanId, setSelectedPlanId, setPlans, loading, setLoading, closeModal }) => {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") return setPlanData(prev => ({ ...prev, [name]: checked }));
    if (value === "") return setPlanData(prev => ({ ...prev, [name]: "", ...(name==="monthlyPlanAmount" && { yearlyPlanAmount: "" }) }));
    if (!/^\d+$/.test(value) && name !== "planName") return;
    if (name === "monthlyPlanAmount") return setPlanData(prev => ({ ...prev, monthlyPlanAmount: value, yearlyPlanAmount: Number(value) * 12 }));
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
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save plan");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white p-6 rounded-xl shadow-xl w-11/12 md:w-1/2 pointer-events-auto relative">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold">×</button>
        <h3 className="font-semibold mb-4">{isEditMode ? "Edit Plan" : "Create Plan"}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="planName" placeholder="Plan Name" value={planData.planName} onChange={handleChange} className="w-full border p-2 rounded mb-3" required />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" name="monthlyPlanAmount" placeholder="Monthly Amount" value={planData.monthlyPlanAmount} onChange={handleChange} className="border p-2 rounded" required />
            <input type="text" name="yearlyPlanAmount" placeholder="Yearly Amount" value={planData.yearlyPlanAmount} readOnly className="border p-2 rounded bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {Object.keys(defaultPlanState).filter(key => !["planName","monthlyPlanAmount","yearlyPlanAmount"].includes(key)).map(feature => (
              <label key={feature} className="flex items-center gap-2">
                <input type="checkbox" name={feature} checked={planData[feature]} onChange={handleChange} />
                {feature.replace(/([A-Z])/g," $1")}
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {loading ? "Saving..." : isEditMode ? "Update Plan" : "Save Plan"}
            </button>
            <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanFormModal;
