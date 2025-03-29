import "./App.css";
import { useState } from "react";
import ConversionSelector from "./conversion_selector.js";

function App() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(""); // Clear error when file is selected
      console.log('Selected file:', file.name, file.type); // Log the file name and type
    }
  };

  const handleFileUpload = async () => {
    try {
      // Clear previous results and errors
      setResult("");
      setError("");

      if (!selectedFile) {
        throw new Error("Please select a file first");
      }
      if (!selectedType || selectedType === "") {
        throw new Error("Please select a conversion type");
      }

      console.log("Selected Type:", selectedType); // Debug log

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("selectedType", selectedType);

      const response = await fetch("http://127.0.0.1:3001/uploads", {
        method: "POST",
        body: formData,
        // Remove the Content-Type header as FormData handles it
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }

      const data = await response.json();
      if (data.status === "success") {
        console.log("Success:", data);
        setResult(data.message || "File sent successfully!");
        setError("");
      } else {
        setError(data.message || "An error occurred during upload.");
        setResult("");
      }
    } catch (error) {
      console.error("Error sending file:", error);
      setError(error.message || "An error occurred while sending the file.");
      setResult("");
    }
  };

  const handleConversionTypeChange = (value) => {
    console.log("Conversion type selected:", value); // Debug log
    setSelectedType(value);
    setError(""); // Clear error when conversion type is selected
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>HTR AI to Latex</h1>
        <h2>Upload the document you'd like converted to LaTeX:</h2>
        <div className={`upload-section ${!selectedFile && error ? 'error' : ''}`}>
          <label className="upload-button">
            Upload File
            <input
              type="file"
              accept=".txt,.pdf,.png,.jpg,.jpeg,.gif"
              onChange={handleFileChange}
              id="fileInput"
            />
          </label>
        </div>
        <div className="button-container">
          <ConversionSelector 
            onSelect={handleConversionTypeChange} 
            selectedType={selectedType}
          />
          <button 
            className="submit-button"
            onClick={handleFileUpload}
          >
            Submit
          </button>
        </div>

        <div className="text-display">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <textarea
            className="text-output"
            rows="10"
            value={result}
            readOnly
          ></textarea>
        </div>
      </header>
    </div>
  );
}

export default App;