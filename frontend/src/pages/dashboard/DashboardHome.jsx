import { useState, useEffect } from "react";
import appointmentsApi from "../../crud/appointmentsApi";
import vehiclesApi from "../../crud/vehiclesApi";
import clientsApi from "../../crud/clientsApi";
import repairOrdersApi from "../../crud/repairOrdersApi";
import servicesApi from "../../crud/servicesApi";

//Dashboard Home -  show stats

function DashboardHome() {
  const [stats, setStats] = useState({
    appointments: 0,
    vehicles: 0,
    clients: 0,
    orders: 0,
    services: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appointmentsRes, vehiclesRes, clientsRes, ordersRes, servicesRes] = await Promise.all([
          appointmentsApi.getAll({ per_page: 1000 }),
          vehiclesApi.getAll({ per_page: 1000 }),
          clientsApi.getAll({ per_page: 1000 }),
          repairOrdersApi.getAll({ per_page: 1000 }),
          servicesApi.getAll({ per_page: 1000 })
        ]);

        const appointments = appointmentsRes.data?.data || appointmentsRes.data || [];
        const vehicles = vehiclesRes.data?.data || vehiclesRes.data || [];
        const clients = clientsRes.data?.data || clientsRes.data || [];
        const orders = ordersRes.data?.data || ordersRes.data || [];
        const services = servicesRes.data?.data || servicesRes.data || [];

        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.final_cost || 0), 0);

        setStats({
          appointments: appointments.length,
          vehicles: vehicles.length,
          clients: clients.length,
          orders: orders.length,
          services: services.length,
          totalRevenue
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-1">Dashboard Overview</h1>
      <p className="text-muted mb-4">Welcome to your dashboard</p>
      
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ background: '#e3f2fd' }}>
            <div className="card-body">
              <h5 className="card-title">Appointments</h5>
              <p className="display-4 mb-0">{stats.appointments}</p>
              <small className="text-muted">Total registered</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ background: '#f3e5f5' }}>
            <div className="card-body">
              <h5 className="card-title">Vehicles</h5>
              <p className="display-4 mb-0">{stats.vehicles}</p>
              <small className="text-muted">In system</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ background: '#fff3e0' }}>
            <div className="card-body">
              <h5 className="card-title">Clients</h5>
              <p className="display-4 mb-0">{stats.clients}</p>
              <small className="text-muted">Total clients</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ background: '#e8f5e9' }}>
            <div className="card-body">
              <h5 className="card-title">Repair Orders</h5>
              <p className="display-4 mb-0">{stats.orders}</p>
              <small className="text-muted">Total orders</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ background: '#fce4ec' }}>
            <div className="card-body">
              <h5 className="card-title">Services</h5>
              <p className="display-4 mb-0">{stats.services}</p>
              <small className="text-muted">Available services</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{ background: '#e0f2f1' }}>
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <p className="display-4 mb-0">€{stats.totalRevenue.toFixed(2)}</p>
              <small className="text-muted">From all orders</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
