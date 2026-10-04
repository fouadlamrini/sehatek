const PHONE_REGEX = /^(?:\+?212|0)([5-7])\d{8}$/;

export const isValidPhone = (value) => {
  const cleaned = String(value ?? "").replace(/[\s.-]/g, "");
  return PHONE_REGEX.test(cleaned);
};

export const validateCustomer = (customer) => {
  const errors = {};

  if (!customer.name.trim()) {
    errors.name = "الاسم الكامل مطلوب.";
  }

  if (!customer.phone.trim()) {
    errors.phone = "رقم الهاتف مطلوب.";
  } else if (!isValidPhone(customer.phone)) {
    errors.phone = "رقم غير صحيح (مثال: 0612345678).";
  }

  return errors;
};

export const validateDelivery = (delivery) => {
  const errors = {};

  if (!delivery.city.trim()) {
    errors.city = "المدينة مطلوبة.";
  }

  if (!delivery.quartier.trim()) {
    errors.quartier = "الحي مطلوب.";
  }

  if (!delivery.locationType) {
    errors.locationType = "اختر نوع التوصيل.";
  }

  return errors;
};