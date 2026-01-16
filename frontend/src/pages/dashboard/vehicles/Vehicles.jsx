import { useState, useEffect, useCallback, useMemo } from "react";
import vehiclesApi from "../../../crud/vehiclesApi";
import clientsApi from "../../../crud/clientsApi";
import { useNotification } from "../../../hooks/useNotification";
import { useAuth } from "../../../hooks/useAuth";
import ConfirmDialog from "../../../components/ConfirmDialog";
import VehicleFilters from "./VehicleFilters";
import VehiclesList from "./VehiclesList";
import VehicleForm from "./VehicleForm";
import "./vehicles.css";

const EMPTY_FORM = { client_id: "", brand: "", model: "", plate: "", year: "", km_current: "" };

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState({ search: "" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const vehiclesRes = await vehiclesApi.getAll({ page, per_page: 10 });
      setVehicles(vehiclesRes.data?.data || vehiclesRes.data || []);
      const pages = vehiclesRes.data?.last_page || vehiclesRes.data?.meta?.last_page || 1;
      setTotalPages(pages);
      
      // Only load clients if its admin
      if (isAdmin) {
        const clientsRes = await clientsApi.getAll();
        setClients(clientsRes.data?.data || clientsRes.data || []);
      }
    } catch (error) {
      showError("Error loading vehicles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, showError, isAdmin]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.client_id) newErrors.client_id = "Client is required";
    if (!values.brand.trim()) newErrors.brand = "Brand is required";
    if (!values.model.trim()) newErrors.model = "Model is required";
    if (!values.plate.trim()) newErrors.plate = "Plate is required";
    if (!values.year) {
      newErrors.year = "Year is required";
    } else if (values.year < 1900 || values.year > new Date().getFullYear() + 1) {
      newErrors.year = "Invalid year";
    }
    if (!values.km_current) {
      newErrors.km_current = "Current kilometers is required";
    } else if (values.km_current < 0) {
      newErrors.km_current = "Kilometers cannot be negative";
    }
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setServerErrors({});

    try {
      if (editingId) {
        await vehiclesApi.update(editingId, form);
        showSuccess("Vehicle updated successfully");
      } else {
        await vehiclesApi.create(form);
        showSuccess("Vehicle created successfully");
      }
      
      closeModals();
      

      setPage(1);
      const vehiclesRes = await vehiclesApi.getAll({ page: 1, per_page: 10 });
      setVehicles(vehiclesRes.data?.data || vehiclesRes.data || []);
      setTotalPages(vehiclesRes.data?.last_page || 1);
      
      if (isAdmin) {
        const clientsRes = await clientsApi.getAll();
        setClients(clientsRes.data?.data || clientsRes.data || []);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
      } else {
        showError("Error saving vehicle");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      client_id: vehicle.client_id,
      brand: vehicle.brand,
      model: vehicle.model,
      plate: vehicle.plate,
      year: vehicle.year,
      km_current: vehicle.km_current,
    });
    setErrors({});
    setServerErrors({});
    setIsEditOpen(true);
  };

  const askDelete = (vehicle) => {
    setToDelete(vehicle);
    setIsDeleteOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setToDelete(null);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    setIsDeleting(true);
    try {
      await vehiclesApi.delete(toDelete.id);
      showSuccess("Vehicle deleted successfully");
      fetchVehicles();
      setIsDeleteOpen(false);
      setToDelete(null);
    } catch (error) {
      showError("Error deleting vehicle");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setServerErrors({});
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    resetForm();
  };

  const filteredVehicles = useMemo(() => {
    const { search } = filters;
    return vehicles.filter(vehicle => {
      const matchSearch = !search || 
        vehicle.brand?.toLowerCase().includes(search.toLowerCase()) || 
        vehicle.model?.toLowerCase().includes(search.toLowerCase()) || 
        vehicle.plate?.toLowerCase().includes(search.toLowerCase()) || 
        vehicle.client?.full_name?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [vehicles, filters]);

  return (
    <div className="container mt-4">
      <div className="card vehicles-header mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Vehicles</h2>
              <p className="mb-0 opacity-75">Manage all vehicles</p>
            </div>
            {isAdmin && (
              <button className="btn btn-light" onClick={openCreateModal}>
                <i className="bi bi-plus-lg"></i> New Vehicle
              </button>
            )}
          </div>
        </div>
      </div>

      <VehicleFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-hourglass-split"></i> Loading...
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="alert alert-secondary text-center">
          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
          No vehicles found
        </div>
      ) : (
        <>
          <VehiclesList 
            vehicles={filteredVehicles}
            onEdit={handleEdit}
            onDelete={askDelete}
            isAdmin={isAdmin}
          />

          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">Page {page} of {totalPages}</span>
                </li>
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      <VehicleForm
        isOpen={isCreateOpen || isEditOpen}
        onClose={closeModals}
        onSubmit={onSubmit}
        form={form}
        setForm={setForm}
        clients={clients}
        errors={errors}
        serverErrors={serverErrors}
        isSubmitting={isSubmitting}
        editingId={editingId}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete the vehicle ${toDelete?.brand} ${toDelete?.model} (${toDelete?.plate})?`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
}

export default Vehicles;
