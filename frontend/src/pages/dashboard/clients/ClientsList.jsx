export default function ClientsList({ clients, onEdit, onDelete }) {
  return (
    <div className="row">
      {clients.map((client) => (
        <div key={client.id} className="col-md-6 col-lg-4 mb-3">
          <div className="card client-card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">{client.full_name}</h5>
              
              <div className="mb-2">
                <strong>Phone:</strong> {client.phone}
              </div>
              
              <div className="mb-2">
                <strong>Email:</strong> {client.email}
              </div>
              
              {client.address && (
                <div className="mb-2">
                  <strong>Address:</strong> {client.address}
                </div>
              )}
              
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit(client)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(client)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
