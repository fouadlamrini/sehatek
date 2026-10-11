import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

import StepLayout from "../components/layout/StepLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useOrder } from "../context/OrderContext";
import { STEPS } from "../constants";
import { validateCustomer } from "../utils/validation";

const CustomerInfo = () => {
  const navigate = useNavigate();
  const { items, customer, setCustomer } = useOrder();

  const [form, setForm] = useState(customer);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate("/", { replace: true });
    }
  }, [items.length, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateCustomer(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setCustomer({ name: form.name.trim(), phone: form.phone.trim() });
    navigate("/livraison");
  };

  return (
    <StepLayout
      step={1}
      onBack={(index) => navigate(STEPS[index]?.path ?? "/")}
      title="معلوماتك"
      subtitle="باش نعيطو عليك بخصوص الطلب ديالك"
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </span>
          <span dir="rtl" className="text-base font-bold text-ink">
            معطيات التواصل
          </span>
        </div>

        <div className="space-y-4">
          <Input
            label="الاسم الكامل"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="مثال: يوسف العمراني"
            autoComplete="name"
          />

          <Input
            label="رقم الهاتف"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            hint="الصيغة: 0612345678"
            placeholder="0612345678"
            autoComplete="tel"
          />
        </div>

        <Button
          type="submit"
          icon={ArrowLeft}
          className="mt-8 h-13 w-full rounded-2xl bg-primary text-base shadow-lg shadow-primary/30"
        >
          متابعة
        </Button>
      </form>
    </StepLayout>
  );
};

export default CustomerInfo;
