// Meal days must match the values used by the customer app.
export const MEAL_DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export const ROLES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

export const ROLE_LABELS = {
  admin: "Admin",
  super_admin: "Super Admin",
};

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "delivering", label: "Delivering" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const ORDER_STATUS_COLORS = {
  pending: "amber",
  confirmed: "blue",
  preparing: "violet",
  delivering: "primary",
  delivered: "leaf",
  cancelled: "red",
};

export const LOCATION_TYPES = [
  { value: "company", label: "Company" },
  { value: "home", label: "Home" },
  { value: "other", label: "Other" },
  { value: "direct", label: "Direct" },
];

export const LOCATION_TYPE_LABELS = LOCATION_TYPES.reduce(
  (acc, item) => ({ ...acc, [item.value]: item.label }),
  {}
);

export const PROMOTION_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed amount (DH)" },
];

export const PACK_TYPES = [
  { value: "price", label: "Pack price (final price)" },
  { value: "fixed", label: "Fixed discount (DH)" },
  { value: "percentage", label: "Percentage discount (%)" },
];

export const PACK_TYPE_LABELS = {
  price: "Final price",
  fixed: "Fixed discount",
  percentage: "Percentage",
};
