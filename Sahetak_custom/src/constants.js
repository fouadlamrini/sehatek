// Shared constants for the customer flow.

export const MAX_ITEM_QUANTITY = 20;

export const LOCATION_TYPES = [
  { value: "home", label: "Maison", emoji: "🏠" },
  { value: "company", label: "Entreprise", emoji: "🏢" },
  { value: "other", label: "Autre", emoji: "📍" },
  { value: "direct", label: "Direct", emoji: "🤝" },
];

export const LOCATION_TYPE_LABELS = LOCATION_TYPES.reduce(
  (acc, item) => ({ ...acc, [item.value]: item.label }),
  {}
);

export const STEPS = [
  { key: "products", label: "Produits", path: "/" },
  { key: "customer", label: "Informations", path: "/informations" },
  { key: "delivery", label: "Livraison", path: "/livraison" },
  { key: "confirmation", label: "Confirmation", path: "/confirmation" },
];

export const ORDER_STATUS_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  delivering: "En route",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const TRACK_STEPS = [
  { key: "pending", label: "En attente" },
  { key: "confirmed", label: "Confirmée" },
  { key: "preparing", label: "En préparation" },
  { key: "delivering", label: "En route" },
  { key: "delivered", label: "Livrée" },
];
