import { useRef, useState } from "react";

export default function UploadArea({ onFilesSelected }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (fileList) => {
    if (fileList && fileList.length) {
      onFilesSelected(fileList);
    }
  };

  return (
    <div
      className={`upload-card ${isDragOver ? "dragover" : ""}`}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
      </svg>
      <h3>Drag &amp; Drop your Excel file(s) here or click to browse</h3>
      <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.25rem" }}>
        (Supports .xlsx, .xls formats — you can select multiple files at once)
      </p>
      <label htmlFor="fileInput" className="upload-btn">
        Upload Excel File(s)
      </label>
      <input
        ref={inputRef}
        type="file"
        id="fileInput"
        accept=".xlsx, .xls"
        multiple
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = ""; // allow re-selecting the same file(s) later
        }}
      />
    </div>
  );
}
