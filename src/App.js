// import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import ConversionSelector from "./conversion_selector.js";

function App() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    console.log("Event object:", event);
    const selectedFile = event.target.files ? event.target.files[0] : null;
    console.log("Selected file:", selectedFile);
    if (selectedFile) {
      setFile(selectedFile); // Store the file when selected
    }
  };

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        alert("Please select a file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("selectedType", selectedType);

      console.log("File name:", file.name);
      console.log("Selected type:", selectedType);
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
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
    setSelectedType(value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>HTR AI to Latex</h1>
        <h2>Upload the document you'd like converted to LaTeX:</h2>
        <div className="upload-section">
          <label className="upload-button">
            Upload File
            <input
              type="file"
              accept=".txt,.pdf,.png,.jpg,.jpeg,.gif"
              onChange={handleFileChange}
              id="fileInput:"
            />
          </label>
        </div>
        <div>
          <ConversionSelector onSelect={handleConversionTypeChange} />
          <button onClick={handleFileUpload} disabled={!file || !selectedType}>
            Submit
          </button>
        </div>

        <div className="text-display">
          {error && <div className="error-message">{error}</div>}
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
