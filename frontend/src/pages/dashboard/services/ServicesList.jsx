function ServicesList({ services, onEdit, onDelete, isAdmin }) {
  return (
    <div className="row">
      {services.map((service) => (
        <div key={service.id} className="col-12 col-sm-6 col-md-4 mb-4">
          <div className="card service-card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">{service.name}</h5>
              
              <div className="mb-2">
                <strong>Price:</strong> €{parseFloat(service.price).toFixed(2)}
              </div>
              
              <div className="mb-2">
                <strong>Duration:</strong> {service.duration_minutes} min
              </div>

              {isAdmin && (
                <div className="d-flex gap-2 mt-3">
                  <button 
                    className="btn btn-sm btn-outline-primary flex-fill" 
                    onClick={() => onEdit(service)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => onDelete(service)}
                  >
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

export default ServicesList;
