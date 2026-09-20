import { useEffect, useState } from "react";

import * as promotionApi from "../../api/promotionApi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Switch from "../ui/Switch";
import { useToast } from "../../hooks/useToast";
import { PROMOTION_TYPES } from "../../constants";
import { getErrorMessage, getFieldErrors } from "../../utils/error";

const EMPTY_FORM = { product: "", type: "percentage", value: "", active: true };

const PromotionFormModal = ({
  open,
  onClose,
  promotion,
  products,
  takenProductIds,
  onSaved,
}) => {
  const isEdit = Boolean(promotion);
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (promotion) {
      setForm({
        product: promotion.product?._id ?? promotion.product ?? "",
        type: promotion.type,
        value: promotion.value,
        active: promotion.active,
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
    setServerError("");
  }, [open, promotion]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.product) {
      nextErrors.product = "Select a product";
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
      product: form.product,
      type: form.type,
      value: Number(form.value),
      active: form.active,
    };

    setSubmitting(true);
    setServerError("");

    try {
      if (isEdit) {
        await promotionApi.updatePromotion(promotion._id, payload);
        toast.success("Promotion updated successfully");
      } else {
        await promotionApi.createPromotion(payload);
        toast.success("Promotion created successfully");
      }

      onSaved();
      onClose();
    } catch (error) {
      const message = getErrorMessage(error, "Failed to save promotion");

      setServerError(message);
      setErrors(getFieldErrors(error));
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const valueLabel =
    form.type === "percentage" ? "Percentage (%)" : "Discount amount (DH)";

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : onClose}
      title={isEdit ? "Edit promotion" : "New promotion"}
      description="A product can only have one promotion at a time."
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" form="promotion-form" loading={submitting}>
            {isEdit ? "Save changes" : "Create promotion"}
          </Button>
        </>
      }
    >
      <form
        id="promotion-form"
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >
        {serverError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {serverError}
          </div>
        ) : null}

        <Select
          label="Product"
          name="product"
          value={form.product}
          onChange={handleChange}
          error={errors.product}
          placeholder="Select a product"
        >
          {products.map((product) => {
            const takenByOther = takenProductIds.has(product._id)
              && product._id !== form.product;

            return (
              <option
                key={product._id}
                value={product._id}
                disabled={takenByOther}
              >
                {product.name}
                {takenByOther ? " (already has a promotion)" : ""}
              </option>
            );
          })}
        </Select>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={PROMOTION_TYPES}
          />

          <Input
            label={valueLabel}
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={form.value}
            onChange={handleChange}
            error={errors.value}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <Switch
            id="promotion-active"
            checked={form.active}
            onChange={(checked) =>
              setForm((current) => ({ ...current, active: checked }))
            }
            label="Active"
          />
          <p className="mt-1 text-xs text-gray-400">
            Inactive promotions are saved but not applied to prices.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default PromotionFormModal;
