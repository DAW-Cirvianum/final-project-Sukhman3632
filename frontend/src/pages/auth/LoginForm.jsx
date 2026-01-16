function LoginForm({ form, errors, onChange, isSubmitting }) {
  return (
    <div className="login-form">
      <div className="form-group">
        <label htmlFor="login">Email or Username</label>
        <input
          id="login"
          type="text"
          value={form.login}
          onChange={(e) => onChange('login', e.target.value)}
          placeholder="email or username"
          disabled={isSubmitting}
          autoComplete="username"
        />
        {errors.login && <span className="error-text">{errors.login}</span>}
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
          autoComplete="current-password"
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>
    </div>
  );
}

export default LoginForm;
