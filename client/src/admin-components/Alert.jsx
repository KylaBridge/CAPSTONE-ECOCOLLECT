import React from "react";
import "./styles/Alert.css";

export default function Alert({
  type = "alert", // "alert" or "confirm"
  title = "Alert",
  message = "",
  onConfirm = () => {},
  onCancel = () => {},
  isOpen = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  okText = "OK",
}) {
  if (!isOpen) return null;

  const isConfirmType = type === "confirm";

  return (
    <div className="alert-backdrop" onClick={onCancel}>
      <div className="alert-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="alert-header">
          <h2 className="alert-title">{title}</h2>
          <button
            className="alert-close-btn"
            onClick={onCancel}
            aria-label="Close alert"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        <div className="alert-body">
          <p className="alert-message">{message}</p>
        </div>

        {/* Footer with Buttons */}
        <div className="alert-footer">
          {isConfirmType ? (
            <>
              <button
                className="alert-btn alert-btn-cancel"
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button
                className="alert-btn alert-btn-confirm"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              className="alert-btn alert-btn-ok"
              onClick={onConfirm}
            >
              {okText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
