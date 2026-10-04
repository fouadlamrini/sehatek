import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";

import StepLayout from "../components/layout/StepLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useOrder } from "../context/OrderContext";
import { LOCATION_TYPES, STEPS } from "../constants";
import { validateDelivery } from "../utils/validation";
import { cn } from "../utils/cn";

const DeliveryInfo = () => {
  const navigate = useNavigate();
  const { items, customer, delivery, setDelivery } = useOrder();

  const [form, setForm] = useState(delivery);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate("/", { replace: true });
    } else if (!customer.name.trim()) {
      navigate("/informations", { replace: true });
    }
  }, [items.length, customer.name, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateDelivery(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setDelivery({
      city: form.city.trim(),
      quartier: form.quartier.trim(),
      locationType: form.locationType,
      receiverName: form.receiverName.trim(),
    });
    navigate("/confirmation");
  };

  return (
    <StepLayout
      step={2}
      onBack={(index) => navigate(STEPS[index]?.path ?? "/")}
      title="التوصيل"
      subtitle="فين بغيتي توصّل الطلب ديالك؟"
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          <span dir="rtl" className="text-sm font-bold">
            عنوان التوصيل
          </span>
        </div>

        <div className="space-y-4">
          <Input
            label="المدينة"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
            placeholder="مثال: الدار البيضاء"
            autoComplete="address-level2"
          />

          <Input
            label="الحي"
            name="quartier"
            value={form.quartier}
            onChange={handleChange}
            error={errors.quartier}
            placeholder="مثال: المعاريف"
            autoComplete="address-level3"
          />

          <div>
            <p dir="rtl" className="mb-1.5 text-sm font-semibold text-gray-700">
              نوع المكان
            </p>

            <div className="grid grid-cols-2 gap-2">
              {LOCATION_TYPES.map((type) => {
                const selected = form.locationType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setForm((current) => ({
                        ...current,
                        locationType: type.value,
                      }));
                      setErrors((current) => ({
                        ...current,
                        locationType: undefined,
                      }));
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition",
                      selected
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-gray-200 bg-white text-gray-600 hover:border-primary/50"
                    )}
                  >
                    <span className="text-lg">{type.emoji}</span>
                    {type.label}
                  </button>
                );
              })}
            </div>

            {errors.locationType ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.locationType}
              </p>
            ) : null}
          </div>

          <Input
            label="اسم المستلم (اختياري)"
            name="receiverName"
            value={form.receiverName}
            onChange={handleChange}
            error={errors.receiverName}
            placeholder="إلا كان شي حد آخر غادي يستلم الطلب"
          />
        </div>

        <Button type="submit" icon={ArrowLeft} className="mt-6 w-full">
          متابعة
        </Button>
      </form>
    </StepLayout>
  );
};

export default DeliveryInfo;