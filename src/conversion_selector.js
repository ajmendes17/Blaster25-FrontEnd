import React, { useState } from "react";

const ConversionSelector = () => {
  const [selectedType, setSelectedType] = useState("");

  const handleSelectionChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div>
      <label htmlFor="conversion-type">Select Type:</label>
      <select
        id="conversion-type"
        value={selectedType}
        onChange={handleSelectionChange}
      >
        <option value="" disabled>
          -- Select an option --
        </option>
        <option value="one-pager-notes">One-Pager Notes Sheet</option>
        <option value="homework-assignment">Homework Assignment</option>
      </select>
      {selectedType && <p>You selected: {selectedType}</p>}
    </div>
  );
};

export default ConversionSelector;
