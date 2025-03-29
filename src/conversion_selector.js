import React from "react";

const ConversionSelector = ({ onSelect }) => {
  const [selectedType, setSelectedType] = React.useState("");

  const handleSelectionChange = (event) => {
    const newValue = event.target.value;
    setSelectedType(newValue);
    onSelect(newValue); // Call the onSelect callback with the new value
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