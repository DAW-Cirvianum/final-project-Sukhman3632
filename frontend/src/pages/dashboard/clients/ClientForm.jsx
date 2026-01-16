export default function ClientForm({ isOpen, onClose, onSubmit, form, setForm, errors, serverErrors, isSubmitting, editingId }) {
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
            <h5 className="modal-title">{editingId ? "Edit" : "New"} Client</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="e.g., John Doe"
                  required
                />
                {errors.full_name && <div className="text-danger small">{errors.full_name}</div>}
                {serverErrors.full_name && <div className="text-danger small">{serverErrors.full_name[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., 612345678"
                  required
                />
                {errors.phone && <div className="text-danger small">{errors.phone}</div>}
                {serverErrors.phone && <div className="text-danger small">{serverErrors.phone[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g., john@example.com"
                  required
                />
                {errors.email && <div className="text-danger small">{errors.email}</div>}
                {serverErrors.email && <div className="text-danger small">{serverErrors.email[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g., C/ Example 123, Barcelona"
                  required
                />
                {errors.address && <div className="text-danger small">{errors.address}</div>}
                {serverErrors.address && <div className="text-danger small">{serverErrors.address[0]}</div>}
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
