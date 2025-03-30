import React from "react";

const ConversionSelector = ({ onSelect }) => {
  const [prompt, setPrompt] = React.useState("");

  const handlePromptChange = (event) => {
    const newValue = event.target.value;
    setPrompt(newValue);
    onSelect(newValue); // Call the onSelect callback with the new value
  };

  return (
    <div className="prompt-selector">
      <label htmlFor="prompt">Enter your prompt:</label>
      <input
        type="text"
        id="prompt"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Enter your prompt here..."
        className="prompt-input"
      />
      {prompt && <p className="selected-prompt">Prompt: {prompt}</p>}
    </div>
  );
};

export default ConversionSelector;