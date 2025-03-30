import "./App.css";
import { useState } from "react";
import React from "react";
import Latex from "react-latex";
import "katex/dist/katex.min.css";

function App() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [latexCode, setLatexCode] = useState("");
  const [modifiedResult, setModifiedResult] = useState(""); // State for the modified LaTeX content

  const API_ENDPOINT =
    process.env.REACT_APP_API_ENDPOINT || "http://127.0.0.1:3001";

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(""); // Clear error when file is selected
      console.log("Selected file:", file.name, file.type); // Log the file name and type
    }
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
    setError(""); // Clear error when prompt is entered
  };

  const handlePromptConfirm = () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }
    setError(""); // Clear error when prompt is confirmed
  };

  const handleFileUpload = async () => {
    try {
      setResult("");
      setError("");

      if (!selectedFile) {
        throw new Error("Please select a file first");
      }
      if (!prompt) {
        throw new Error("Please enter a prompt");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Add the prompt as a query parameter
      const uploadUrl = `${API_ENDPOINT}/uploads?prompt=${encodeURIComponent(
        prompt
      )}`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Server response:", responseText);

        try {
          const errorData = await response.json();
          if (errorData.detail) {
            throw new Error(errorData.detail[0].msg || "Failed to upload file");
          }
          throw new Error(errorData.message || "Failed to upload file");
        } catch (jsonError) {
          if (responseText.startsWith("<!DOCTYPE html")) {
            throw new Error(
              "Invalid response from server. Please check the backend."
            );
          }
          throw new Error("Invalid JSON response from server: " + responseText);
        }
      }

      const data = await response.json();
      if (data.status === "success") {
        console.log("Success:", data);
        setResult(data.latex_code || "Couldn't find latex code");
        setError("");

        const extractLatexContent = (fullLatex) => {
          if (!fullLatex) return "Error: No LaTeX content found.";

          // Regular expression to match content inside \begin{document} and \end{document}
          const match = fullLatex.match(
            /\\begin{document}([\s\S]*?)\\end{document}/
          );

          if (match && match[1]) {
            // Return the content inside \begin{document} and \end{document}, trimmed of extra whitespace
            return match[1].trim();
          } else {
            return "Error: Could not extract content.";
          }
        };

        // Set the modified result
        setModifiedResult(
          extractLatexContent(data.latex_code) ||
            "Error: Could not extract content."
        );
      } else {
        setError(data.message || "An error occurred during upload.");
        setResult("");
        setModifiedResult("");
      }
    } catch (error) {
      console.error("Error sending file:", error);
      setError(error.message || "An error occurred while sending the file.");
      setResult("");
      setModifiedResult("");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>tex-it</h1>
      </header>
      <h2>Please upload the document you'd like converted to LaTeX.</h2>
      <div className="box-container">
        <div
          className={`upload-section ${!selectedFile && error ? "error" : ""}`}
        >
          <p>
            {" "}
            Select a file and submit a prompt. If you'd like the default
            settings, type "LaTeX".
          </p>
          <label className="upload-button">
            Upload File
            <input
              type="file"
              accept=".txt,.pdf,.png,.jpg,.jpeg,.gif"
              onChange={handleFileChange}
              id="fileInput"
            />
            <p>File types accepted: .txt,.pdf,.png,.jpg,.jpeg,.gif</p>
          </label>
        </div>
        <div className="button-container">
          <div className="prompt-input-container">
            <input
              type="text"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={handlePromptChange}
              className="prompt-input"
            />
            <button
              className="prompt-button"
              onClick={handlePromptConfirm}
              disabled={!prompt}
            >
              {prompt ? "Prompt Set" : "Set Prompt"}
            </button>
          </div>
          <button
            className="submit-button"
            onClick={handleFileUpload}
            disabled={!selectedFile || !prompt}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="text-display">
        {error && <div className="error-message">{error}</div>}
        <textarea
          className="text-output"
          rows="10"
          value={result}
          onChange={(e) => setResult(e.target.value)}
        ></textarea>
        <div className="latex-output">
          <Latex displayMode={true}>{modifiedResult}</Latex>
        </div>
      </div>
    </div>
  );
}

export default App;
