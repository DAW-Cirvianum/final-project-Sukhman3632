import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import servicesApi from '../crud/servicesApi';

//Service Detail Page

function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesApi.getById(id);
        setService(response.data);
      } catch (error) {
        console.error(error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  // if not exists redirect 404
  if (notFound || !service) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{service.name}</h1>
      <p><strong>Price:</strong> ${service.price}</p>
      <p><strong>Description:</strong> {service.description}</p>
      
      <Link to="/services" style={{ marginTop: '1rem', display: 'inline-block' }}>
        ← Back to Services
      </Link>
    </div>
  );
}

export default ServiceDetail;
