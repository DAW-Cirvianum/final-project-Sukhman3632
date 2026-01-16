import { useState, useEffect, useCallback, useMemo } from "react";
import servicesApi from "../../../crud/servicesApi";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useNotification } from "../../../hooks/useNotification";
import { useAuth } from "../../../hooks/useAuth";
import ServiceFilters from "./ServiceFilters";
import ServicesList from "./ServicesList";
import ServiceForm from "./ServiceForm";
import "./services.css";

const EMPTY_FORM = { name: "", price: "", duration_minutes: "" };

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showNotification } = useNotification();
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

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await servicesApi.getAll({ page, per_page: 10 });
      setServices(response.data?.data || response.data || []);
      setTotalPages(response.data?.last_page || 1);
    } catch (error) {
      showNotification("Error loading services", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, showNotification]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (!values.price) {
      newErrors.price = "Price is required";
    } else if (values.price <= 0) {
      newErrors.price = "Price must be positive";
    }
    if (!values.duration_minutes) {
      newErrors.duration_minutes = "Duration is required";
    } else if (values.duration_minutes < 1) {
      newErrors.duration_minutes = "Duration must be at least 1 minute";
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
        await servicesApi.update(editingId, form);
        showNotification("Service updated successfully", "success");
      } else {
        await servicesApi.create(form);
        showNotification("Service created successfully", "success");
      }
      closeModals();
      fetchServices();
    } catch (error) {
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
      } else {
        showNotification(error.response?.data?.message || "Error saving service", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      price: service.price,
      duration_minutes: service.duration_minutes,
    });
    setEditingId(service.id);
    setErrors({});
    setServerErrors({});
    setIsEditOpen(true);
  };

  const askDelete = (service) => {
    setToDelete(service);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await servicesApi.delete(toDelete.id);
      showNotification("Service deleted successfully", "success");
      fetchServices();
    } catch (error) {
      showNotification("Error deleting service", "error");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setToDelete(null);
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

  const filteredServices = useMemo(() => {
    const { search } = filters;
    return services.filter(service => {
      const matchSearch = !search || service.name?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [services, filters]);

  return (
    <div className="container mt-4">
      <div className="card services-header mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Services</h2>
              <p className="mb-0 opacity-75">Manage all workshop services</p>
            </div>
            {isAdmin && (
              <button className="btn btn-light" onClick={openCreateModal}>
                <i className="bi bi-plus-lg"></i> New Service
              </button>
            )}
          </div>
        </div>
      </div>

      <ServiceFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="alert alert-secondary text-center">No services found</div>
      ) : (
        <ServicesList 
          services={filteredServices}
          onEdit={handleEdit}
          onDelete={askDelete}
          isAdmin={isAdmin}
        />
      )}

      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      <ServiceForm
        isOpen={isCreateOpen}
        onClose={closeModals}
        onSubmit={onSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        serverErrors={serverErrors}
        isSubmitting={isSubmitting}
        editingId={null}
      />

      <ServiceForm
        isOpen={isEditOpen}
        onClose={closeModals}
        onSubmit={onSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        serverErrors={serverErrors}
        isSubmitting={isSubmitting}
        editingId={editingId}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Services;
