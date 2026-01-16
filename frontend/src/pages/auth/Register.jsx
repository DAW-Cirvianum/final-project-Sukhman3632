import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from './RegisterForm';
import './register.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [form, setForm] = useState({ 
    name: '', 
    username: '',
    email: '',
    phone: '',
    password: '', 
    password_confirmation: '' 
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data) => {
    const e = {};
    if (!data.name.trim()) e.name = 'Name is required';
    if (!data.username.trim()) e.username = 'Username is required';
    if (!data.email.trim()) e.email = 'Email is required';
    if (!data.phone.trim()) e.phone = 'Phone is required';
    if (!data.password) e.password = 'Password is required';
    if (data.password && data.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (data.password !== data.password_confirmation) e.password_confirmation = 'Passwords do not match';
    return e;
  };

  const onChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    const result = await register(form);
    
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(result.errors || { general: result.error });
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>Create<br/>Account</h1>
        <p>Join us today and start managing your vehicles, appointments, and workshop services efficiently.</p>
      </div>

      <div className="register-right">
        <div className="register-card">
          <div className="register-header">
            <h2>Sign up</h2>
            <p>Create your account to get started</p>
          </div>

          {errors.general && (
            <div className="register-error-alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <RegisterForm
              form={form}
              errors={errors}
              onChange={onChange}
              isSubmitting={isSubmitting}
            />

            <button
              type="submit"
              className="register-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
