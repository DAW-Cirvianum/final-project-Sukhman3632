function RepairOrderForm({ isOpen, onClose, onSubmit, form, errors, serverErrors, handleChange, handleServiceToggle, vehicles, services, isSubmitting, editingId }) {
  const getError = (field) => errors[field] || (serverErrors[field] ? serverErrors[field][0] : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editingId ? 'Edit' : 'New'} Repair Order</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Vehicle *</label>
                  <select 
                    className={`form-select ${getError('vehicle_id') ? 'is-invalid' : ''}`}
                    name="vehicle_id"
                    value={form.vehicle_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select vehicle...</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.plate} - {vehicle.brand} {vehicle.model}
                      </option>
                    ))}
                  </select>
                  {getError('vehicle_id') && <div className="invalid-feedback">{getError('vehicle_id')}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Status *</label>
                  <select 
                    className={`form-select ${getError('status') ? 'is-invalid' : ''}`}
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                  {getError('status') && <div className="invalid-feedback">{getError('status')}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date *</label>
                  <input 
                    type="date"
                    className={`form-control ${getError('start_date') ? 'is-invalid' : ''}`}
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                  />
                  {getError('start_date') && <div className="invalid-feedback">{getError('start_date')}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date"
                    className={`form-control ${getError('end_date') ? 'is-invalid' : ''}`}
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                  />
                  {getError('end_date') && <div className="invalid-feedback">{getError('end_date')}</div>}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Final Cost *</label>
                  <input 
                    type="number"
                    step="0.01"
                    className={`form-control ${getError('final_cost') ? 'is-invalid' : ''}`}
                    name="final_cost"
                    value={form.final_cost}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                  <small className="text-muted">Include labor and other costs</small>
                  {getError('final_cost') && <div className="invalid-feedback">{getError('final_cost')}</div>}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Description *</label>
                  <textarea 
                    className={`form-control ${getError('description') ? 'is-invalid' : ''}`}
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the repair work..."
                    required
                  />
                  {getError('description') && <div className="invalid-feedback">{getError('description')}</div>}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Services</label>
                  <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {services.length === 0 ? (
                      <p className="text-muted mb-0">No services available</p>
                    ) : (
                      services.map(service => (
                        <div key={service.id} className="form-check">
                          <input 
                            className="form-check-input"
                            type="checkbox"
                            id={`service-${service.id}`}
                            checked={form.service_ids.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                          />
                          <label className="form-check-label" htmlFor={`service-${service.id}`}>
                            {service.name} - €{parseFloat(service.price).toFixed(2)}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RepairOrderForm;
