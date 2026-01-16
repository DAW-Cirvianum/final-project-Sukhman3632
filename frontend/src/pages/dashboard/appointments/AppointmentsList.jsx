const getStatusBadge = (status) => {
  const badges = {
    pending: 'bg-warning',
    confirmed: 'bg-info',
    completed: 'bg-success',
    cancelled: 'bg-danger'
  };
  return badges[status] || 'bg-secondary';
};

export default function AppointmentsList({ appointments, onEdit, onDelete, isAdmin }) {
  return (
    <div className="row">
      {appointments.map((app) => (
        <div key={app.id} className="col-md-6 col-lg-4 mb-3">
          <div className="card appointment-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title mb-0">
                  {app.date_time ? new Date(app.date_time).toLocaleDateString() : app.appointment_date}
                </h5>
                <span className={`badge ${getStatusBadge(app.status || 'pending')} text-capitalize`}>
                  {app.status || 'pending'}
                </span>
              </div>
              
              <div className="mb-2">
                <strong>Time:</strong> {app.date_time ? new Date(app.date_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : app.appointment_time}
              </div>
              
              <div className="mb-2">
                <strong>Vehicle:</strong> {app.vehicle?.plate || "N/A"}
                <br />
                <small className="text-muted ms-3">{app.vehicle?.brand} {app.vehicle?.model}</small>
              </div>
              
              {app.observations && (
                <div className="mt-3 p-2 bg-light rounded">
                  <small><strong>Notes:</strong> {app.observations}</small>
                </div>
              )}
              
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit(app)}>
                  Edit
                </button>
                {isAdmin && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(app.id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
