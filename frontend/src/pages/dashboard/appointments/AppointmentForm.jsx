export default function AppointmentForm({ form, setForm, vehicles, services, onSubmit, onClose, editId }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editId ? "Edit" : "New"} Appointment</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={form.appointment_date} 
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Time</label>
                <input 
                  type="time" 
                  className="form-control" 
                  value={form.appointment_time} 
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vehicle</label>
                <select 
                  className="form-select" 
                  value={form.vehicle_id} 
                  onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} 
                  required
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Service (Optional)</label>
                <select 
                  className="form-select" 
                  value={form.service_id || ""} 
                  onChange={(e) => setForm({ ...form, service_id: e.target.value || null })}
                >
                  <option value="">No service selected</option>
                  {services?.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Observations</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={form.observations} 
                  onChange={(e) => setForm({ ...form, observations: e.target.value })}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select 
                  className="form-select" 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value })} 
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
