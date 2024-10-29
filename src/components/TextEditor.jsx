import { Box } from "@mui/material";
import React from "react";
import "react-quill/dist/quill.snow.css";
import Images from "../assets/images";

const TextEditor = ({ content, setContent, htmlFile, setHtmlFile, setChecked, check }) => {

  const handleEditorTextChange = (event) => setContent(event.target.value);

  // Handle changes in the HTML textarea
  const handleHtmlTextChange = (event) => setHtmlFile(event.target.value);
  const toggleCheck = () => {
    setChecked(!check);
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    height: "250px", // Set consistent height
    backgroundColor: "#2A2A2A",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const editorStyle = {
    width: "50%",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  };

  const quillContainerStyle = {
    flex: 1,
    overflowY: "auto", // Make the Quill editor scrollable
    border: "1px solid #444",
    borderRadius: "4px",
    backgroundColor: "#333",
    color: "white",
  };

  const htmlViewStyle = {
    width: "50%",
    padding: "10px",
    backgroundColor: "#2C2C2C",
    borderLeft: "1px solid #444",
    display: "flex",
    flexDirection: "column",
  };

  const textareaStyle = {
    flex: 1,
    width: "100%",
    height: "100%", // Full height of the container
    resize: "none", // Disable manual resizing
    overflowY: "auto", // Make the textarea scrollable
    boxSizing: "border-box", // Include padding in width/height calculation
    backgroundColor: "#444", // Dark background for textarea
    color: "#fff", // White text
    border: "1px solid #444",
    borderRadius: "4px",
  };

  return (
    <div style={containerStyle}>
      {/* Rich Text Editor */}
      <div style={editorStyle}>
        <Box style={{ color: "#ffffff" }} fontWeight="Bold">
          Message (Body)
        </Box>
        <div style={quillContainerStyle}>
          <textarea
            value={content} // Use content for the rich text editor state
            onChange={handleEditorTextChange}
            style={{ height: "100%", width: "100%", backgroundColor: "white" }}
          />
        </div>
      </div>

      {/* HTML Input */}
      <div style={htmlViewStyle}>
        <Box
          style={{ color: "#ffffff", cursor: "pointer" }}
          fontWeight="Bold"
          display="flex"
          alignItems="center"
          onClick={toggleCheck} // Toggle when clicked
        >
          Attachment{" "}
          {!check ? (
            <img
              src={Images.UnCheckIcon}
              alt="unchecked"
              width={20}
              height={20}
            />
          ) : (
            <img src={Images.CheckIcon} alt="checked" width={20} height={20} />
          )}
        </Box>

        <textarea
          value={htmlFile} // Use htmlFile for the HTML textarea state
          onChange={handleHtmlTextChange} // Allow users to input or paste HTML code
          style={textareaStyle}
        />
      </div>
    </div>
  );
};

export default TextEditor;