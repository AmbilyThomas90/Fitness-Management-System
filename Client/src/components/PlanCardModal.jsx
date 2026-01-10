import React from "react";

const PlanCard = ({ plan, onViewDetails }) => {
  if (!plan) return null; //  SAFETY CHECK

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col border">
      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

      <p className="text-gray-600 mb-4">{plan.description}</p>

      <p className="text-2xl font-bold text-indigo-600 mb-4">
        ₹{plan.price}/month
      </p>

      <ul className="text-sm text-gray-600 mb-6 space-y-1">
        {plan.features?.map((f, i) => (
          <li key={i}>✔ {f}</li>
        ))}
      </ul>

      <button
        onClick={onViewDetails}
        className="mt-auto bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        View Details
      </button>
    </div>
  );
};

export default PlanCard;
