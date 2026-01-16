function ServiceFilters({ filters, setFilters }) {
  const handleClear = () => {
    setFilters({ search: "" });
  };

  return (
    <div className="card mb-4 border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="bi bi-funnel"></i> Filters
        </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Search</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Service name..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={handleClear}
            >
              <i className="bi bi-x-circle"></i> Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceFilters;
