export default function ConfirmModal({ open, text, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm Trade</h3>

        <pre
          style={{
            textAlign: "left",
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            marginTop: 15
          }}
        >
{text}
        </pre>

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
