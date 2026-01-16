import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import servicesApi from '../crud/servicesApi';
import Modal from '../components/Modal';
import Dropdown from '../components/Dropdown';

// Services Page

function Services() {
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesApi.getAll();
        setServices(response.data.data || response.data);
      } catch (error) {
        showError('Error loading services');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [showError]);

  const handleServiceAction = (action, service) => {
    setSelectedService(service);
    switch(action) {
      case 'book':
        setIsModalOpen(true);
        break;
      case 'info':
        showInfo(service.description);
        break;
      case 'favorite':
        showSuccess('Added to favorites!');
        break;
      default:
        showWarning('Coming soon');
    }
  };

  const handleBooking = () => {
    showSuccess('Service booked successfully!');
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Workshop Services</h1>
      
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading services...</div>
      ) : (
        <>
      {/* Notification Demo */}
      <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '12px', color: 'white', marginBottom: '2rem' }}>
        <h3>State Management Demo</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button onClick={() => showSuccess('Success!')} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            ✓ Success
          </button>
          <button onClick={() => showError('Error')} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            ✕ Error
          </button>
          <button onClick={() => showInfo('Info')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            ℹ Info
          </button>
          <button onClick={() => showWarning('Warning')} style={{ padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            ⚠ Warning
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {services.map(service => (
          <div key={service.id} style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '12px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <Link to={`/services/${service.id}`} style={{ textDecoration: 'none', color: '#111' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{service.name}</h3>
                </Link>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{service.description}</p>
              </div>
              
              <Dropdown trigger={<button style={{ background: '#f3f4f6', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>⋮</button>}>
                <div style={{ padding: '8px' }}>
                  <button onClick={() => handleServiceAction('info', service)} style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
                     More Info
                  </button>
                  <button onClick={() => handleServiceAction('favorite', service)} style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
                     Favorite
                  </button>
                  <button onClick={() => handleServiceAction('share', service)} style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
                     Share
                  </button>
                </div>
              </Dropdown>
            </div>
            
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: '1rem 0' }}>
              ${service.price}
            </p>
            
            <button onClick={() => handleServiceAction('book', service)} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Book Service
            </button>
          </div>
        ))}
      </div>
        </>
      )}

      {/* Booking Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Book Service">
        {selectedService && (
          <div>
            <p>Booking: <strong>{selectedService.name}</strong></p>
            <p style={{ color: '#666' }}>Price: ${selectedService.price}</p>
            
            <label style={{ display: 'block', marginTop: '1rem' }}>Preferred Date:</label>
            <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
            
            <label style={{ display: 'block', marginTop: '1rem' }}>Notes:</label>
            <textarea rows="3" placeholder="Any requirements..." style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}></textarea>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleBooking} style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </Modal>
      
      <Link to="/" style={{ marginTop: '2rem', display: 'inline-block', color: '#667eea', textDecoration: 'none' }}>
        ← Back to Home
      </Link>
    </div>
  );
}

export default Services;
