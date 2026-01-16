import { useState, useEffect, useCallback, useMemo } from "react";
import clientsApi from "../../../crud/clientsApi";
import { useNotification } from "../../../hooks/useNotification";
import ConfirmDialog from "../../../components/ConfirmDialog";
import ClientFilters from "./ClientFilters";
import ClientsList from "./ClientsList";
import ClientForm from "./ClientForm";
import "./clients.css";

const EMPTY_FORM = { full_name: "", phone: "", email: "", address: "" };

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showNotification } = useNotification();

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

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await clientsApi.getAll({ page, per_page: 10 });
      setClients(response.data?.data || response.data || []);
      setTotalPages(response.data?.last_page || 1);
    } catch (error) {
      showNotification("Error loading clients", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, showNotification]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!values.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{9,15}$/.test(values.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid phone number (9-15 digits)";
    }
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!values.address.trim()) newErrors.address = "Address is required";
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
        await clientsApi.update(editingId, form);
        showNotification("Client updated successfully", "success");
      } else {
        await clientsApi.create(form);
        showNotification("Client created successfully", "success");
      }
      closeModals();
      fetchClients();
    } catch (error) {
      if (error.response?.status === 422) {
        setServerErrors(error.response.data.errors || {});
      } else {
        showNotification("Error saving client", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setForm({ full_name: client.full_name, phone: client.phone, email: client.email, address: client.address });
    setErrors({});
    setServerErrors({});
    setIsEditOpen(true);
  };

  const askDelete = (client) => {
    setToDelete(client);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await clientsApi.delete(toDelete.id);
      showNotification("Client deleted successfully", "success");
      fetchClients();
      setIsDeleteOpen(false);
      setToDelete(null);
    } catch (error) {
      showNotification("Error deleting client", "error");
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

  const closeModals = () => {
    setIsCreateOpen(false);
    setIsEditOpen(false);
    resetForm();
  };

  const filteredClients = useMemo(() => {
    const { search, city } = filters;
    return clients.filter(client => {
      const matchSearch = !search || client.full_name?.toLowerCase().includes(search.toLowerCase()) || client.phone?.includes(search) || client.email?.toLowerCase().includes(search.toLowerCase()) || client.address?.toLowerCase().includes(search.toLowerCase());
      const matchCity = !city || client.address?.toLowerCase().includes(city.toLowerCase());
      return matchSearch && matchCity;
    });
  }, [clients, filters]);

  return (
    <div className="container mt-4">
      <div className="card clients-header mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Clients</h2>
              <p className="mb-0 opacity-75">Manage all clients</p>
            </div>
            <button className="btn btn-light" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
              <i className="bi bi-plus-lg"></i> New Client
            </button>
          </div>
        </div>
      </div>

      <ClientFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="alert alert-info text-center"><i className="bi bi-hourglass-split"></i> Loading...</div>
      ) : filteredClients.length === 0 ? (
        <div className="alert alert-secondary text-center"><i className="bi bi-inbox fs-1 d-block mb-2"></i>No clients found</div>
      ) : (
        <>
          <ClientsList clients={filteredClients} onEdit={handleEdit} onDelete={askDelete} />
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                </li>
                <li className="page-item disabled"><span className="page-link">Page {page} of {totalPages}</span></li>
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      <ClientForm isOpen={isCreateOpen || isEditOpen} onClose={closeModals} onSubmit={onSubmit} form={form} setForm={setForm} errors={errors} serverErrors={serverErrors} isSubmitting={isSubmitting} editingId={editingId} />
      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Client" message={`Are you sure you want to delete ${toDelete?.full_name}?`} confirmText="Delete" cancelText="Cancel" isLoading={isDeleting} variant="danger" />
    </div>
  );
}

export default Clients;
