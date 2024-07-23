// PasswordModal.js
import React, { useState } from "react";
import "../App.css";

const PasswordModal = ({ onClose, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(usePassword ? password : null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-[35%] h-[35%] bg-slate-600  flex justify-center items-center flex-col rounded-xl ">
        <h2 className="text-lg font-bold">Protect Your File</h2>
        <form onSubmit={handleSubmit} className=" text-center">
          <div>
            <label className=" flex mx-2 text-center h-8 text-lg font-bold ">
              <input
                type="checkbox"
                class="checkbox checkbox-accent mx-1  "
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
              />
              Protect with password
            </label>
          </div>
          {usePassword && (
            <div>
              <input
                type="password"
                className="input input-bordered input-info w-full max-w-xs  "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          )}
          <div>
            <button
              className="btn passwordModal-btn btn-xs sm:btn-sm  btn-outline btn-info"
              type="submit"
            >
              Upload
            </button>

            <button
              className="btn passwordModal-btn btn-xs sm:btn-sm  btn-outline btn-warning"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
