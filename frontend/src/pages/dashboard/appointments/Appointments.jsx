import { useEffect, useState, useMemo } from "react";
import appointmentsApi from "../../../crud/appointmentsApi";
import vehiclesApi from "../../../crud/vehiclesApi";
import servicesApi from "../../../crud/servicesApi";
import { useNotification } from "../../../hooks/useNotification";
import AppointmentFilters from "./AppointmentFilters";
import AppointmentsList from "./AppointmentsList";
import AppointmentForm from "./AppointmentForm";
import "./appointments.css";

const EMPTY_FORM = { appointment_date: "", appointment_time: "", vehicle_id: "", service_id: "", observations: "", status: "pending" };

export default function Appointments() {
  const { showSuccess, showError } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: "", dateFrom: "", dateTo: "", status: "" });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [appRes, vehRes, servRes] = await Promise.all([
          appointmentsApi.getAll({ page, per_page: 10 }),
          vehiclesApi.getAll(),
          servicesApi.getAll()
        ]);
        setAppointments(appRes.data?.data || appRes.data || []);
        setTotalPages(appRes.data?.last_page || appRes.data?.meta?.last_page || 1);
        setVehicles(vehRes.data?.data || vehRes.data || []);
        setServices(servRes.data?.data || servRes.data || []);
      } catch {
        showError("Error loading data");
      }
      setLoading(false);
    };

    loadData();
  }, [page, showError]);

  const reloadData = async () => {
    setLoading(true);
    try {
      const [appRes, vehRes, servRes] = await Promise.all([
        appointmentsApi.getAll({ page, per_page: 10 }),
        vehiclesApi.getAll(),
        servicesApi.getAll()
      ]);
      setAppointments(appRes.data?.data || appRes.data || []);
      setTotalPages(appRes.data?.last_page || appRes.meta?.last_page || 1);
      setVehicles(vehRes.data?.data || vehRes.data || []);
      setServices(servRes.data?.data || servRes.data || []);
    } catch {
      showError("Error loading data");
    }
    setLoading(false);
  };

  const openModal = (appointment = null) => {
    setEditId(appointment?.id || null);
    setForm(appointment ? {
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      vehicle_id: appointment.vehicle_id,
      service_id: appointment.service_id,
      observations: appointment.observations || "",
      status: appointment.status || "pending",
    } : EMPTY_FORM);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    try {
      // Get client_id from selected vehicle
      const selectedVehicle = vehicles.find(v => v.id == form.vehicle_id);
      const dataToSend = {
        ...form,
        client_id: selectedVehicle?.client_id,
        date_time: `${form.appointment_date} ${form.appointment_time}`,
      };

      if (editId) {
        await appointmentsApi.update(editId, dataToSend);
        showSuccess("Appointment updated");
      } else {
        await appointmentsApi.create(dataToSend);
        showSuccess("Appointment created");
      }
      closeModal();
      reloadData();
    } catch (error) {
      showError(error.response?.data?.message || "Error saving");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await appointmentsApi.delete(id);
      showSuccess("Deleted");
      reloadData();
    } catch {
      showError("Error deleting");
    }
  };

  const filteredAppointments = useMemo(() => {
    const { search, dateFrom, dateTo, status } = filters;
    return appointments.filter(app => {
      const appDate = app.appointment_date || app.date_time?.split(' ')[0];
      const matchSearch = !search || app.vehicle?.plate?.toLowerCase().includes(search.toLowerCase()) || app.vehicle?.client?.name?.toLowerCase().includes(search.toLowerCase());
      const matchDateFrom = !dateFrom || appDate >= dateFrom;
      const matchDateTo = !dateTo || appDate <= dateTo;
      const matchStatus = !status || app.status === status;
      return matchSearch && matchDateFrom && matchDateTo && matchStatus;
    });
  }, [appointments, filters]);

  return (
    <div className="container mt-4">
      <div className="card appointments-header mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Appointments</h2>
              <p className="mb-0 opacity-75">Manage all your appointments</p>
            </div>
            <button className="btn btn-light" onClick={() => openModal()}>
              <i className="bi bi-plus-lg"></i> New Appointment
            </button>
          </div>
        </div>
      </div>

      <AppointmentFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-hourglass-split"></i> Loading...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="alert alert-secondary text-center">No appointments found</div>
      ) : (
        <>
          <AppointmentsList 
            appointments={filteredAppointments}
            onEdit={openModal}
            onDelete={handleDelete}
            isAdmin={isAdmin}
          />

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
        </>
      )}

      {showModal && (
        <AppointmentForm
          form={form}
          setForm={setForm}
          vehicles={vehicles}
          services={services}
          onSubmit={handleSubmit}
          onClose={closeModal}
          editId={editId}
        />
      )}
    </div>
  );
}
