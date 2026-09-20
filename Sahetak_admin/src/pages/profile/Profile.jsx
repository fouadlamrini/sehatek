import { useState } from "react";
import { KeyRound, Mail, Eye, EyeOff, UserCog } from "lucide-react";

import * as authApi from "../../api/authApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage, getFieldErrors } from "../../utils/error";
import { getInitials } from "../../utils/format";
import { ROLE_LABELS } from "../../constants";

const Profile = () => {
  const { admin, updateAdmin } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(admin?.name ?? "");
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleNameSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }

    setNameError("");
    setSavingName(true);

    try {
      const { data } = await authApi.changeName(name.trim());

      updateAdmin({ name: data?.name ?? name.trim() });
      setName(data?.name ?? name.trim());
      toast.success("Name updated successfully");
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update name");

      setNameError(message);
      toast.error(message);
    } finally {
      setSavingName(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!passwords.currentPassword) {
      nextErrors.currentPassword = "Current password is required";
    }

    if (!passwords.newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (passwords.newPassword.length < 6) {
      nextErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSavingPassword(true);

    try {
      await authApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      toast.success("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update password");

      setPasswordErrors(getFieldErrors(error));
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePasswordChange = (field) => (event) =>
    setPasswords((current) => ({ ...current, [field]: event.target.value }));

  return (
    <>
      <PageHeader title="Profile" subtitle="Manage your account settings" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-forest text-xl font-bold text-white">
              {getInitials(admin?.name)}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-forest">
                {admin?.name}
              </h2>

              <p className="flex items-center gap-1.5 truncate text-sm text-gray-500">
                <Mail className="h-3.5 w-3.5" />
                {admin?.email}
              </p>

              <div className="mt-1.5">
                <Badge color={admin?.role === "super_admin" ? "leaf" : "primary"}>
                  {ROLE_LABELS[admin?.role] ?? admin?.role}
                </Badge>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleNameSubmit}
            className="mt-6 space-y-4 border-t border-gray-100 pt-5"
            noValidate
          >
            <h3 className="flex items-center gap-2 text-sm font-bold text-forest">
              <UserCog className="h-4 w-4 text-primary" />
              Display name
            </h3>

            <Input
              label="Full name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={nameError}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={savingName}>
                Save name
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-forest">
            <KeyRound className="h-4 w-4 text-primary" />
            Change password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4" noValidate>
            <div className="relative">
              <Input
                label="Current password"
                name="currentPassword"
                type={showPasswords ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={handlePasswordChange("currentPassword")}
                error={passwordErrors.currentPassword}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPasswords((value) => !value)}
                className="absolute right-3 top-9 text-gray-400 transition hover:text-gray-600"
                aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Input
              label="New password"
              name="newPassword"
              type={showPasswords ? "text" : "password"}
              value={passwords.newPassword}
              onChange={handlePasswordChange("newPassword")}
              error={passwordErrors.newPassword}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />

            <Input
              label="Confirm new password"
              name="confirmPassword"
              type={showPasswords ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={handlePasswordChange("confirmPassword")}
              error={passwordErrors.confirmPassword}
              autoComplete="new-password"
            />

            <div className="flex justify-end">
              <Button type="submit" variant="secondary" loading={savingPassword}>
                Update password
              </Button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default Profile;
