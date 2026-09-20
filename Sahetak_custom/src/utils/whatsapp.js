import { LOCATION_TYPE_LABELS } from "../constants";

export const getWhatsappNumber = () =>
  (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

export const getOrderReference = (order) =>
  order?._id ? `#${String(order._id).slice(-6).toUpperCase()}` : "";

export const buildOrderMessage = (items, customer, delivery, order) => {
  const ref = getOrderReference(order);

  const lines = [];

  lines.push("Bonjour Sehatek,");
  lines.push("");
  lines.push(
    ref
      ? `Je souhaite confirmer ma commande ${ref}.`
      : "Je souhaite confirmer ma commande."
  );
  lines.push("");

  lines.push("🍽️ Produits:");
  for (const item of items) {
    const note = item.note ? ` (Note: ${item.note})` : "";
    lines.push(`- ${item.name} [${item.mealDay}] x${item.quantity}${note}`);
  }
  lines.push("");

  if (order?.discount > 0) {
    lines.push(`🎁 Remise: -${order.discount} DH`);
  }

  if (order?.totalPrice !== undefined) {
    lines.push(`💰 Total: ${order.totalPrice} DH`);
  }

  lines.push("");
  lines.push("👤 Client:");
  lines.push(`Nom: ${customer.name}`);
  lines.push(`Téléphone: ${customer.phone}`);

  lines.push("");
  lines.push("📍 Livraison:");
  lines.push(`Type: ${LOCATION_TYPE_LABELS[delivery.locationType] ?? delivery.locationType}`);
  lines.push(`Ville: ${delivery.city}`);
  lines.push(`Quartier: ${delivery.quartier}`);

  if (delivery.receiverName) {
    lines.push(`Reçu par: ${delivery.receiverName}`);
  }

  lines.push("");
  lines.push("Merci.");

  return lines.join("\n");
};

export const buildWhatsappUrl = (message) => {
  const number = getWhatsappNumber();

  if (!number) {
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
