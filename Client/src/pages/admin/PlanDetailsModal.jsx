// PlanDetailsModal.jsx
import React from "react";


const PlanDetailsModal = ({ planData, closeModal, setShowFormModal, setIsEditMode, setSelectedPlanId }) => {

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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white p-6 rounded-xl shadow-xl w-11/12 md:w-1/2 pointer-events-auto relative">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold">×</button>
        <h3 className="font-semibold mb-4">Plan Details</h3>
        <p><strong>Name:</strong> {planData.planName}</p>
        <p><strong>Monthly:</strong> ₹{planData.monthlyPlanAmount}</p>
        <p><strong>Yearly:</strong> ₹{planData.yearlyPlanAmount}</p>
        <ul className="ml-5 mt-2 space-y-1">
          {Object.keys(defaultPlanState).filter(key => !["planName","monthlyPlanAmount","yearlyPlanAmount"].includes(key))
            .map(feature => planData[feature] && <li key={feature}>✔ {feature.replace(/([A-Z])/g," $1")}</li>)
          }
        </ul>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => { setShowFormModal(true); setIsEditMode(true); setSelectedPlanId(planData._id); closeModal(); }}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
