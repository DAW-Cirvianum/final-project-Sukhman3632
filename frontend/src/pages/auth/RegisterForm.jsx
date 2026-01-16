function RegisterForm({ form, errors, onChange, isSubmitting }) {
  return (
    <div className="register-form">
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="name"
          disabled={isSubmitting}
          autoComplete="name"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={form.username}
          onChange={(e) => onChange('username', e.target.value)}
          placeholder="username"
          disabled={isSubmitting}
          autoComplete="username"
        />
        {errors.username && <span className="error-text">{errors.username}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="email"
          disabled={isSubmitting}
          autoComplete="email"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="phone number"
          disabled={isSubmitting}
          autoComplete="tel"
        />
        {errors.phone && <span className="error-text">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => onChange('password', e.target.value)}
          placeholder="password"
          disabled={isSubmitting}
          autoComplete="new-password"
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password_confirmation">Confirm Password</label>
        <input
          id="password_confirmation"
          type="password"
          value={form.password_confirmation}
          onChange={(e) => onChange('password_confirmation', e.target.value)}
          placeholder="confirm your password"
          disabled={isSubmitting}
          autoComplete="new-password"
        />
        {errors.password_confirmation && <span className="error-text">{errors.password_confirmation}</span>}
      </div>
    </div>
  );
}

export default RegisterForm;
