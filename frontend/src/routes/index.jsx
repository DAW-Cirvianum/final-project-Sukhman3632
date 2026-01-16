//Routes Configuration



import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Services from '../pages/Services';
import ServiceDetail from '../pages/ServiceDetail';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import Appointments from '../pages/dashboard/appointments/Appointments';
import Vehicles from '../pages/dashboard/vehicles/Vehicles';
import Clients from '../pages/dashboard/clients/Clients';
import RepairOrders from '../pages/dashboard/repair-orders/RepairOrders';
import DashboardServices from '../pages/dashboard/services/Services';
import NotFound from '../pages/NotFound';

export const routes = [
  {
    path: '/',
    element: Home,
    title: 'Home',
    public: true
  },
  {
    path: '/login',
    element: Login,
    title: 'Login',
    public: true
  },
  {
    path: '/register',
    element: Register,
    title: 'Register',
    public: true
  },
  {
    path: '/services',
    element: Services,
    title: 'Services',
    public: true
  },
  {
    path: '/services/:id',
    element: ServiceDetail,
    title: 'Service Detail',
    public: true
  },
  {
    path: '/dashboard',
    element: DashboardLayout,
    title: 'Dashboard',
    protected: true,
    children: [
      {
        index: true,
        element: DashboardHome,
        title: 'Dashboard Home'
      },
      {
        path: 'appointments',
        element: Appointments,
        title: 'Appointments'
      },
      {
        path: 'vehicles',
        element: Vehicles,
        title: 'Vehicles'
      },
      {
        path: 'clients',
        element: Clients,
        title: 'Clients'
      },
      {
        path: 'repair-orders',
        element: RepairOrders,
        title: 'Repair Orders'
      },
      {
        path: 'services',
        element: DashboardServices,
        title: 'Services'
      }
    ]
  },
  {
    path: '*',
    element: NotFound,
    title: '404 Not Found',
    public: true
  }
];
