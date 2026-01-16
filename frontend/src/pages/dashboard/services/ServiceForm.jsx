export default function ServiceForm({ isOpen, onClose, onSubmit, form, setForm, errors, serverErrors, isSubmitting, editingId }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingId ? "Edit" : "New"} Service</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <input 
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Oil Change"
                  required
                />
                {errors.name && <div className="text-danger small">{errors.name}</div>}
                {serverErrors.name && <div className="text-danger small">{serverErrors.name[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Price (€)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
                {errors.price && <div className="text-danger small">{errors.price}</div>}
                {serverErrors.price && <div className="text-danger small">{serverErrors.price[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Duration (minutes)</label>
                <input 
                  type="number"
                  className="form-control"
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  placeholder="e.g., 30"
                  min="1"
                  required
                />
                {errors.duration_minutes && <div className="text-danger small">{errors.duration_minutes}</div>}
                {serverErrors.duration_minutes && <div className="text-danger small">{serverErrors.duration_minutes[0]}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
