export default function VehicleFilters({ filters, setFilters }) {
  return (
    <div className="card mb-4 border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Filters</h5>
        <div className="row g-3">
          <div className="col-md-9">
            <label className="form-label">Search</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Plate, brand, model, client..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={() => setFilters({ search: "" })}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
