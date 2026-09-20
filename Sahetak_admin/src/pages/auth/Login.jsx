import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, UtensilsCrossed } from "lucide-react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage, getFieldErrors } from "../../utils/error";

const Login = () => {
  const { login, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/dashboard";

  if (!initializing && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");
    setErrors({});
    setSubmitting(true);

    try {
      await login(form);

      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = getErrorMessage(error, "Login failed");

      setServerError(message);
      setErrors(getFieldErrors(error));
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest via-forest to-[#2f5c20] p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
            <UtensilsCrossed className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Sehatek
          </h1>
          <p className="mt-1 text-sm font-medium text-white/60">
            Admin Panel
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-forest">Admin Login</h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in with your admin credentials.
            </p>
          </div>

          {serverError ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {serverError}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@sehatek.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                className="pl-10"
                required
              />

              <Mail className="pointer-events-none absolute left-3 top-[2.15rem] h-4 w-4 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                className="px-10"
                required
              />

              <Lock className="pointer-events-none absolute left-3 top-[2.15rem] h-4 w-4 text-gray-400" />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-[2.05rem] text-gray-400 transition hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="mt-2 w-full"
              size="lg"
            >
              Login
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Sehatek. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
