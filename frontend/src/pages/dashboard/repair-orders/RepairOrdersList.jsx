const getStatusBadge = (status) => {
  const badges = { open: 'bg-warning', closed: 'bg-success' };
  return badges[status] || 'bg-secondary';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function RepairOrdersList({ orders, onEdit, onDelete }) {
  return (
    <div className="row">
      {orders?.map((order) => (
        <div key={order.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card repair-card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title mb-0">Order #{order.id}</h5>
                <span className={`badge ${getStatusBadge(order.status)} text-capitalize`}>{order.status?.replace('_', ' ')}</span>
              </div>
              <div className="mb-2"><strong>Date:</strong> {formatDate(order.start_date)}</div>
              <div className="mb-2"><strong>Vehicle:</strong> {order.vehicle?.plate || "N/A"}</div>
              <div className="mb-2"><strong>Client:</strong> {order.vehicle?.client?.full_name || "N/A"}</div>
              <div className="mb-2"><strong>Total:</strong> €{parseFloat(order.final_cost || 0).toFixed(2)}</div>
              {order.description && <div className="mt-3 p-2 bg-light rounded"><small>{order.description}</small></div>}
              {order.services && order.services.length > 0 && (
                <div className="mt-3">
                  <strong>Services:</strong>
                  <ul className="mb-0 mt-1" style={{ fontSize: '0.875rem' }}>
                    {order.services.map(service => (
                      <li key={service.id}>{service.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => onEdit(order)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(order)}><i className="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
