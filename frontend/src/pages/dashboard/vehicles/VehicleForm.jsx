export default function VehicleForm({ isOpen, onClose, onSubmit, form, setForm, clients, errors, serverErrors, isSubmitting, editingId }) {
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
            <h5 className="modal-title">{editingId ? "Edit" : "New"} Vehicle</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Client</label>
                <select
                  className="form-select"
                  value={form.client_id}
                  onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Select client</option>
                  {clients?.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name} - {c.email}</option>
                  ))}
                </select>
                {errors.client_id && <div className="text-danger small">{errors.client_id}</div>}
                {serverErrors.client_id && <div className="text-danger small">{serverErrors.client_id[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g., Toyota"
                  required
                />
                {errors.brand && <div className="text-danger small">{errors.brand}</div>}
                {serverErrors.brand && <div className="text-danger small">{serverErrors.brand[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="e.g., Corolla"
                  required
                />
                {errors.model && <div className="text-danger small">{errors.model}</div>}
                {serverErrors.model && <div className="text-danger small">{serverErrors.model[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Plate</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.plate}
                  onChange={(e) => setForm({ ...form, plate: e.target.value })}
                  placeholder="e.g., ABC1234"
                  required
                />
                {errors.plate && <div className="text-danger small">{errors.plate}</div>}
                {serverErrors.plate && <div className="text-danger small">{serverErrors.plate[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Year</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g., 2020"
                  required
                />
                {errors.year && <div className="text-danger small">{errors.year}</div>}
                {serverErrors.year && <div className="text-danger small">{serverErrors.year[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Current Kilometers</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.km_current}
                  onChange={(e) => setForm({ ...form, km_current: e.target.value })}
                  placeholder="e.g., 50000"
                  required
                />
                {errors.km_current && <div className="text-danger small">{errors.km_current}</div>}
                {serverErrors.km_current && <div className="text-danger small">{serverErrors.km_current[0]}</div>}
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
