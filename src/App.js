import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "./services/Api";
import PasswordModal from "./encryption/PasswordModal";
import { MdCloudUpload } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [showModal, setShowModal] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setShowModal(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleModalClose = () => {
    setShowModal(false);
    setFile(null);
  };

  const handleModalSubmit = async (password) => {
    setShowModal(false);
    if (file) {
      const data = new FormData();
      data.append("name", file.name);
      data.append("file", file);

      if (password) {
        data.append("password", password);
      }

      try {
        let response = await uploadFile(data);
        setDownloadLink(`http://localhost:5000/download/${response.fileId}`);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(downloadLink);
  };

  return (
    <div className="App flex flex-col justify-center items-center h-lvh  ">
      <div
        {...getRootProps()}
        className={`flex flex-col justify-center items-center  w-[40%]  h-[50%] bg-slate-800  rounded-xl hover:bg-rose-900  ease-in-out duration-300   cursor-pointer dropzone  ${
          isDragActive ? "active" : ""
        } `}
      >
        <MdCloudUpload className="text-9xl text-white-600 uploadIcon " />
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p className="text-lg font-extrabold">
            Drag 'n' drop a file here, or click to select a file
          </p>
        )}
      </div>

      {downloadLink && (
        <div className=" flex flex-col justify-center items-center mt-5 ">
          <p className=" text-lg">Share this link to download the file</p>
          <div className="  ">
            <a
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-700 downloadLink"
            >
              {downloadLink}
            </a>
            <button
              className="ml-2 text-lg copyLink  active:text-black"
              onClick={copyLink}
            >
              <FaCopy />
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <PasswordModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

export default App;
