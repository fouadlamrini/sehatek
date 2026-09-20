import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import * as packApi from "../../api/packApi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Switch from "../ui/Switch";
import { useToast } from "../../hooks/useToast";
import { PACK_TYPES } from "../../constants";
import { getErrorMessage, getFieldErrors } from "../../utils/error";
import { cn } from "../../utils/cn";

const EMPTY_FORM = {
  name: "",
  products: [],
  type: "price",
  value: "",
  active: true,
};

const PackFormModal = ({ open, onClose, pack, products, onSaved }) => {
  const isEdit = Boolean(pack);
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (pack) {
      setForm({
        name: pack.name ?? "",
        products: (pack.products ?? []).map(
          (product) => product?._id ?? product
        ),
        type: pack.type,
        value: pack.value,
        active: pack.active,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
    setServerError("");
  }, [open, pack]);

  const toggleProduct = (id) => {
    setForm((current) => ({
      ...current,
      products: current.products.includes(id)
        ? current.products.filter((item) => item !== id)
        : [...current.products, id],
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (form.products.length === 0) {
      nextErrors.products = "Select at least one product";
    }

    if (form.value === "" || Number(form.value) < 0) {
      nextErrors.value = "Value must be a positive number";
    }

    if (form.type === "percentage" && Number(form.value) > 100) {
      nextErrors.value = "Percentage must not exceed 100";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      products: form.products,
      type: form.type,
      value: Number(form.value),
      active: form.active,
    };

    setSubmitting(true);
    setServerError("");

    try {
      if (isEdit) {
        await packApi.updatePack(pack._id, payload);
        toast.success("Pack updated successfully");
      } else {
        await packApi.createPack(payload);
        toast.success("Pack created successfully");
      }

      onSaved();
      onClose();
    } catch (error) {
      const message = getErrorMessage(error, "Failed to save pack");

      setServerError(message);
      setErrors(getFieldErrors(error));
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const valueLabel =
    form.type === "price"
      ? "Final pack price (DH)"
      : form.type === "fixed"
        ? "Discount amount (DH)"
        : "Discount percentage (%)";

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : onClose}
      title={isEdit ? "Edit pack" : "New pack"}
      description="A pack bundles products with a special price."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" form="pack-form" loading={submitting}>
            {isEdit ? "Save changes" : "Create pack"}
          </Button>
        </>
      }
    >
      <form id="pack-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {serverError}
          </div>
        ) : null}

        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          error={errors.name}
          placeholder="e.g. Menu Complet"
        />

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            Products
          </span>

          {products.length === 0 ? (
            <p className="text-sm text-gray-400">
              No products available. Create products first.
            </p>
          ) : (
            <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-gray-200 p-2 sm:grid-cols-2">
              {products.map((product) => {
                const selected = form.products.includes(product._id);

                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => toggleProduct(product._id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition",
                      selected
                        ? "border-primary bg-primary-soft"
                        : "border-gray-200 hover:border-primary/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-8 w-8 shrink-0 rounded object-cover"
                    />

                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
                      {product.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {errors.products ? (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.products}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Type"
            name="type"
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({ ...current, type: event.target.value }))
            }
            options={PACK_TYPES}
          />

          <Input
            label={valueLabel}
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={form.value}
            onChange={(event) =>
              setForm((current) => ({ ...current, value: event.target.value }))
            }
            error={errors.value}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <Switch
            id="pack-active"
            checked={form.active}
            onChange={(checked) =>
              setForm((current) => ({ ...current, active: checked }))
            }
            label="Active"
          />
        </div>
      </form>
    </Modal>
  );
};

export default PackFormModal;
