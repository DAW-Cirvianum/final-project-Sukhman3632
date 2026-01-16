import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';
import './login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ login: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data) => {
    const e = {};
    if (!data.login.trim()) e.login = 'Email or username is required';
    if (!data.password) e.password = 'Password is required';
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
    
    const result = await login(form);
    
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Welcome<br/>Back</h1>
        <p>Sign in to access your account and manage your workshop appointments, vehicles, and services.</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Sign in</h2>
            <p>Enter your credentials to continue</p>
          </div>

          {errors.general && (
            <div className="login-error-alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <LoginForm
              form={form}
              errors={errors}
              onChange={onChange}
              isSubmitting={isSubmitting}
            />

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in now'}
            </button>
          </form>

          <div className="login-footer">
            Don't have an account? <a href="/register">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
