import { useEffect, useState } from "react";

import * as cityApi from "../../api/cityApi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Switch from "../ui/Switch";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage, getFieldErrors } from "../../utils/error";

const EMPTY_FORM = { name: "", active: true };

const CityFormModal = ({ open, onClose, city, onSaved }) => {
  const isEdit = Boolean(city);
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (city) {
      setForm({ name: city.name, active: city.active });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
    setServerError("");
  }, [open, city]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "City name is required";
    } else if (form.name.trim().length > 60) {
      nextErrors.name = "City name is too long";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = { name: form.name.trim(), active: form.active };

    setSubmitting(true);
    setServerError("");

    try {
      if (isEdit) {
        await cityApi.updateCity(city._id, payload);
        toast.success("City updated successfully");
      } else {
        await cityApi.createCity(payload);
        toast.success("City created successfully");
      }

      onSaved();
      onClose();
    } catch (error) {
      const message = getErrorMessage(error, "Failed to save city");

      setServerError(message);
      setErrors(getFieldErrors(error));
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : onClose}
      title={isEdit ? "Edit city" : "New city"}
      description="Active cities appear in the delivery dropdown on the customer site."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" form="city-form" loading={submitting}>
            {isEdit ? "Save changes" : "Create city"}
          </Button>
        </>
      }
    >
      <form id="city-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {serverError}
          </div>
        ) : null}

        <Input
          label="City name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Ex: Casablanca"
          maxLength={60}
        />

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <Switch
            id="city-active"
            checked={form.active}
            onChange={(checked) =>
              setForm((current) => ({ ...current, active: checked }))
            }
            label="Active"
          />
          <p className="mt-1 text-xs text-gray-400">
            Inactive cities are kept but hidden from the customer dropdown.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default CityFormModal;
