import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/common/Logo';

function EyeIcon({ off }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" strokeLinecap="round" />}
    </svg>
  );
}

// Outlined field with the label sitting on the border (as in the Figma design)
function Field({ id, label, children }) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute -top-2.5 left-3 bg-white px-1 text-[13px] text-muted"
      >
        {label} <span aria-hidden="true">*</span>
      </label>
      {children}
    </div>
  );
}

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      setError('Enter your login ID and password.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 400 || status === 401) {
        setError('Incorrect login ID or password. Please try again.');
      } else if (err.response) {
        setError('Something went wrong on the server. Please try again.');
      } else {
        setError('Cannot reach the server. Check your connection and try again.');
      }
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-md border border-[#c9ced2] bg-white px-3 py-4 text-[15px] text-ink outline-none placeholder:text-transparent focus:border-brand focus:ring-1 focus:ring-brand';

  return (
    <main
      className="relative  flex min-h-full items-center justify-center bg-cover bg-center px-4 py-10 lg:justify-between lg:px-[12%]"
      style={{
         backgroundImage: "url('/login-bg.png')",
      }}
    >
      <h1 className="hidden max-w-[460px] text-[44px] font-semibold leading-[1.15] text-white lg:block">
        Welcome to the Crowd Management System
      </h1>

      <section className="w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div
          className="flex h-[132px] items-center justify-center bg-brand-deep"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(255,255,255,.05) 0%, rgba(255,255,255,0) 60%)',
          }}
        >
          <Logo />
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 p-7">
          <h2 className="text-lg font-medium text-ink lg:hidden">
            Welcome to the Crowd Management System
          </h2>

          <Field id="email" label="Log In">
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-error' : undefined}
              className={inputClass}
              placeholder="Log In"
            />
          </Field>

          <Field id="password" label="Password">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(error)}
              className={`${inputClass} pr-12`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
            >
              <EyeIcon off={showPassword} />
            </button>
          </Field>

          {error && (
            <p id="login-error" role="alert" className="-mt-2 text-sm text-down">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand py-4 text-lg text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}
