export default function VehiclesList({ vehicles, onEdit, onDelete, isAdmin }) {
  return (
    <div className="row">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="col-md-6 col-lg-4 mb-3">
          <div className="card vehicle-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title mb-0">{vehicle.plate}</h5>
                <span className="badge bg-dark">{vehicle.year}</span>
              </div>
              
              <div className="mb-2">
                <strong>Brand:</strong> {vehicle.brand}
              </div>
              
              <div className="mb-2">
                <strong>Model:</strong> {vehicle.model}
              </div>
              
              <div className="mb-2">
                <strong>KM:</strong> {vehicle.km_current?.toLocaleString()} km
              </div>
              
              {vehicle.client && (
                <div className="mt-3 p-2 bg-light rounded">
                  <small><strong>Owner:</strong> {vehicle.client.full_name}</small>
                </div>
              )}
              
              {isAdmin && (
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit(vehicle)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(vehicle)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
