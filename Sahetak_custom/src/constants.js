// Shared constants for the customer flow.

export const MAX_ITEM_QUANTITY = 20;

export const LOCATION_TYPES = [
  { value: "home", label: "المنزل", emoji: "🏠" },
  { value: "company", label: "الشركة", emoji: "🏢" },
  { value: "other", label: "مكان آخر", emoji: "📍" },
  { value: "direct", label: "استلام مباشر", emoji: "🤝" },
];

export const LOCATION_TYPE_LABELS = LOCATION_TYPES.reduce(
  (acc, item) => ({ ...acc, [item.value]: item.label }),
  {}
);

export const STEPS = [
  { key: "products", label: "المنتجات", path: "/" },
  { key: "customer", label: "المعلومات", path: "/informations" },
  { key: "delivery", label: "التوصيل", path: "/livraison" },
  { key: "confirmation", label: "التأكيد", path: "/confirmation" },
];

export const ORDER_STATUS_LABELS = {
  pending: "في الانتظار",
  confirmed: "مؤكدة",
  preparing: "قيد التحضير",
  delivering: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغاة",
};

export const TRACK_STEPS = [
  { key: "pending", label: "في الانتظار" },
  { key: "confirmed", label: "مؤكدة" },
  { key: "preparing", label: "قيد التحضير" },
  { key: "delivering", label: "في الطريق" },
  { key: "delivered", label: "تم التوصيل" },
];