import Modal from "./Modal";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger", 
}) {
  return (
    <Modal isOpen={isOpen} onClose={isLoading ? undefined : onClose} title={title}>
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>{message}</p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          style={{
            padding: "0.625rem 1.25rem",
            background: "#e5e7eb",
            color: "#374151",
            border: "none",
            borderRadius: "0.5rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "1rem",
          }}
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          style={{
            padding: "0.625rem 1.25rem",
            background: variant === "danger" ? "#dc2626" : variant === "warning" ? "#f59e0b" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "1rem",
            opacity: isLoading ? 0.7 : 1,
          }}
          aria-busy={isLoading}
        >
          {isLoading ? "Processing..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
