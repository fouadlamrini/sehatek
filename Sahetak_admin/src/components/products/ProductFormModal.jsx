import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

import * as productApi from "../../api/productApi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import MealDaysSelector from "./MealDaysSelector";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage, getFieldErrors } from "../../utils/error";

const EMPTY_FORM = { name: "", mealDays: [], price: "", stock: "" };

const ProductFormModal = ({ open, onClose, product, onSaved }) => {
  const isEdit = Boolean(product);
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset the form whenever the modal opens or the edited product changes.
  useEffect(() => {
    if (!open) {
      return;
    }

    if (product) {
      setForm({
        name: product.name ?? "",
        mealDays: product.mealDays ?? [],
        price: product.price ?? "",
        stock: product.stock ?? "",
      });
      setPreview(product.image ?? "");
    } else {
      setForm(EMPTY_FORM);
      setPreview("");
    }

    setImageFile(null);
    setErrors({});
    setServerError("");
  }, [open, product]);

  const objectUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  // Revoke the temporary preview URL when it is replaced.
  useEffect(() => {
    if (!objectUrl) {
      return undefined;
    }

    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    setImageFile(file);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (form.mealDays.length === 0) {
      nextErrors.mealDays = "Select at least one day";
    }

    if (form.price === "" || Number(form.price) < 0) {
      nextErrors.price = "Price must be a positive number";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0 ||
      !Number.isInteger(Number(form.stock))
    ) {
      nextErrors.stock = "Stock must be a positive integer";
    }

    if (!isEdit && !imageFile) {
      nextErrors.image = "Product image is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const data = new FormData();

    data.append("name", form.name.trim());
    data.append("mealDays", JSON.stringify(form.mealDays));
    data.append("price", form.price);
    data.append("stock", form.stock);

    if (imageFile) {
      data.append("image", imageFile);
    }

    setSubmitting(true);
    setServerError("");

    try {
      if (isEdit) {
        await productApi.updateProduct(product._id, data);
        toast.success("Product updated successfully");
      } else {
        await productApi.createProduct(data);
        toast.success("Product created successfully");
      }

      onSaved();
      onClose();
    } catch (error) {
      const message = getErrorMessage(error, "Failed to save product");

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
      title={isEdit ? "Edit product" : "New product"}
      description={
        isEdit
          ? "Update the product details below."
          : "Add a new meal product to the menu."
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" form="product-form" loading={submitting}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {serverError}
          </div>
        ) : null}

        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Couscous"
        />

        <MealDaysSelector
          value={form.mealDays}
          onChange={(days) =>
            setForm((current) => ({ ...current, mealDays: days }))
          }
          error={errors.mealDays}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Price (DH)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
            placeholder="50"
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            error={errors.stock}
            placeholder="20"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            Image {isEdit ? "(leave empty to keep current)" : ""}
          </span>

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
              {objectUrl || preview ? (
                <img
                  src={objectUrl || preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImagePlus className="h-6 w-6 text-gray-300" />
              )}
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              Choose image
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {errors.image ? (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.image}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG or WEBP. Max 5MB.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
