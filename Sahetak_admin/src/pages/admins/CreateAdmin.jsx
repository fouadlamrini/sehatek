import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ShieldPlus } from "lucide-react";

import * as adminApi from "../../api/adminApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage, getFieldErrors } from "../../utils/error";

const EMPTY_FORM = { name: "", email: "", password: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateAdmin = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      await adminApi.createAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      toast.success("Admin created successfully");
      navigate("/admins");
    } catch (error) {
      const message = getErrorMessage(error, "Failed to create admin");

      setServerError(message);
      setErrors(getFieldErrors(error));
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Add admin"
        subtitle="Create a new administrator account"
        actions={
          <Link to="/admins">
            <Button variant="outline" icon={ArrowLeft}>
              Back to admins
            </Button>
          </Link>
        }
      />

      <div className="max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
            <ShieldPlus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-bold text-forest">Administrator details</h2>
            <p className="text-xs text-gray-400">
              New accounts are created with the standard admin role.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {serverError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {serverError}
            </div>
          ) : null}

          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            error={errors.name}
            placeholder="Jane Doe"
            autoComplete="name"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            error={errors.email}
            placeholder="jane@sehatek.ma"
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              error={errors.password}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-9 text-gray-400 transition hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Link to="/admins">
              <Button variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </Link>

            <Button type="submit" loading={submitting}>
              Create admin
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateAdmin;
