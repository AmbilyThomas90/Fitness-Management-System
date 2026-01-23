import React from "react";

const SearchInput = ({ setExercises, bodyPart, setBodyPart }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search exercise..."
        className="w-full p-2 rounded-md text-black"
        onChange={(e) => setBodyPart(e.target.value.toLowerCase())}
      />
    </div>
  );
};

export default SearchInput;
