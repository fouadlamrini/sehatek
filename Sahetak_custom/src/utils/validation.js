const PHONE_REGEX = /^(?:\+?212|0)([5-7])\d{8}$/;

export const isValidPhone = (value) => {
  const cleaned = String(value ?? "").replace(/[\s.-]/g, "");
  return PHONE_REGEX.test(cleaned);
};

export const validateCustomer = (customer) => {
  const errors = {};

  if (!customer.name.trim()) {
    errors.name = "Le nom est obligatoire.";
  }

  if (!customer.phone.trim()) {
    errors.phone = "Le téléphone est obligatoire.";
  } else if (!isValidPhone(customer.phone)) {
    errors.phone = "Numéro invalide (ex: 0612345678).";
  }

  return errors;
};

export const validateDelivery = (delivery, { requireCoordinates = false } = {}) => {
  const errors = {};

  if (!delivery.city.trim()) {
    errors.city = "La ville est obligatoire.";
  }

  if (!delivery.quartier.trim()) {
    errors.quartier = "Le quartier est obligatoire.";
  }

  if (!delivery.locationType) {
    errors.locationType = "Choisissez un type de livraison.";
  }

  if (
    requireCoordinates &&
    (delivery.latitude == null || delivery.longitude == null)
  ) {
    errors.coordinates =
      "Placez le marqueur sur la carte pour choisir le point de livraison.";
  }

  return errors;
};
