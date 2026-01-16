import { useState, useEffect, useCallback, useMemo } from "react";
import repairOrdersApi from "../../../crud/repairOrdersApi";
import appointmentsApi from "../../../crud/appointmentsApi";
import vehiclesApi from "../../../crud/vehiclesApi";
import servicesApi from "../../../crud/servicesApi";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useNotification } from "../../../hooks/useNotification";
import { useAuth } from "../../../hooks/useAuth";
import RepairOrderFilters from "./RepairOrderFilters";
import RepairOrdersList from "./RepairOrdersList";
import RepairOrderForm from "./RepairOrderForm";
import "./repairorders.css";

const EMPTY_FORM = {
  vehicle_id: "",
  status: "open",
  description: "",
  final_cost: "",
  start_date: "",
  end_date: "",
  service_ids: [],
};

function RepairOrders() {
  const [repairOrders, setRepairOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState({
    status: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });

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

  const fetchRepairOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await repairOrdersApi.getAll({ page, per_page: 10 });
      setRepairOrders(response.data?.data || response.data || []);
      setTotalPages(response.data?.last_page || 1);
    } catch (error) {
      showNotification("Error loading repair orders", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, showNotification]);

  useEffect(() => {
    fetchRepairOrders();
  }, [fetchRepairOrders]);

  useEffect(() => {
    fetchAppointments();
    fetchVehicles();
    fetchServices();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsApi.getAll({ per_page: 100 });
      setAppointments(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await vehiclesApi.getAll({ per_page: 100 });
      setVehicles(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll({ per_page: 100 });
      setServices(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.vehicle_id) newErrors.vehicle_id = "Vehicle is required";
    if (!values.status) newErrors.status = "Status is required";
    if (!values.description.trim()) newErrors.description = "Description is required";
    if (!values.final_cost) {
      newErrors.final_cost = "Final cost is required";
    } else if (values.final_cost < 0) {
      newErrors.final_cost = "Cost cannot be negative";
    }
    if (!values.start_date) newErrors.start_date = "Start date is required";
    if (values.end_date && values.start_date && values.end_date < values.start_date) {
      newErrors.end_date = "End date cannot be before start date";
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
      const submitData = {
        ...form,
        appointment_id: form.appointment_id || null,
        final_cost: form.final_cost || null,
        end_date: form.end_date || null,
      };

      if (editingId) {
        await repairOrdersApi.update(editingId, submitData);
        showNotification("Repair order updated successfully", "success");
      } else {
        await repairOrdersApi.create(submitData);
        showNotification("Repair order created successfully", "success");
      }
      closeModals();
      fetchRepairOrders();
    } catch (error) {
      if (error.response?.status === 422) {
        setServerErrors(error.response.data.errors || {});
      } else {
        showNotification("Error saving repair order", "error");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (serverErrors[name]) setServerErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleServiceToggle = (serviceId) => {
    setForm(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId],
    }));
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setForm({
      vehicle_id: order.vehicle_id,
      status: order.status,
      description: order.description,
      final_cost: order.final_cost || "",
      start_date: order.start_date || "",
      end_date: order.end_date || "",
      service_ids: order.services?.map(s => s.id) || [],
    });
    setErrors({});
    setServerErrors({});
    setIsEditOpen(true);
  };

  const askDelete = (order) => {
    setToDelete(order);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await repairOrdersApi.delete(toDelete.id);
      showNotification("Repair order deleted successfully", "success");
      fetchRepairOrders();
    } catch (error) {
      showNotification("Error deleting repair order", "error");
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

  const filteredOrders = useMemo(() => {
    const { search, status, dateFrom, dateTo } = filters;
    return repairOrders.filter(order => {
      const matchSearch = !search || 
        order.description?.toLowerCase().includes(search.toLowerCase()) || 
        order.vehicle?.plate?.toLowerCase().includes(search.toLowerCase()) || 
        order.vehicle?.client?.full_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || order.status === status;
      const matchDateFrom = !dateFrom || order.start_date >= dateFrom;
      const matchDateTo = !dateTo || order.start_date <= dateTo;
      return matchSearch && matchStatus && matchDateFrom && matchDateTo;
    });
  }, [repairOrders, filters]);

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card repairorders-header mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Repair Orders</h2>
              <p className="mb-0 opacity-75">Manage repair orders and services</p>
            </div>
            <button className="btn btn-light" onClick={openCreateModal}>
              <i className="bi bi-plus-lg"></i> New Repair Order
            </button>
          </div>
        </div>
      </div>

      <RepairOrderFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="alert alert-info">No repair orders found</div>
      ) : (
        <RepairOrdersList 
          orders={filteredOrders}
          onEdit={handleEdit}
          onDelete={askDelete}
        />
      )}

      {totalPages > 1 && (
        <nav className="mt-4">
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

      <RepairOrderForm
        isOpen={isCreateOpen || isEditOpen}
        onClose={closeModals}
        onSubmit={onSubmit}
        form={form}
        errors={errors}
        serverErrors={serverErrors}
        handleChange={handleChange}
        handleServiceToggle={handleServiceToggle}
        appointments={appointments}
        vehicles={vehicles}
        services={services}
        isSubmitting={isSubmitting}
        editingId={editingId}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Repair Order"
        message="Are you sure you want to delete this repair order? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default RepairOrders;
