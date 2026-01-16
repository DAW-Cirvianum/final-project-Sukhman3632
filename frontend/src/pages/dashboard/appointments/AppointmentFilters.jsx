export default function AppointmentFilters({ filters, setFilters }) {
  return (
    <div className="card mb-4 border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Filters</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Search</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Plate, client name..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">From Date</label>
            <input 
              type="date" 
              className="form-control"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">To Date</label>
            <input 
              type="date" 
              className="form-control"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select 
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={() => setFilters({ search: "", dateFrom: "", dateTo: "", status: "" })}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
