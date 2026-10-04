import { LOCATION_TYPE_LABELS } from "../constants";

export const getWhatsappNumber = () =>
  (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");

// The visible order reference IS the tracking code: the client must be able
// to re-enter it on the track page without copying it beforehand.
export const getOrderReference = (order) => {
  if (order?.trackingCode) {
    return order.trackingCode;
  }

  return order?._id ? `#${String(order._id).slice(-6).toUpperCase()}` : "";
};

export const buildOrderMessage = (items, customer, delivery, order) => {
  const ref = getOrderReference(order);

  const lines = [];

  lines.push("السلام عليكم Sehatek،");
  lines.push("");
  lines.push(ref ? `بغيت نأكد الطلب ${ref}.` : "بغيت نأكد الطلب ديالي.");
  lines.push("");

  lines.push("🍽️ الأطباق:");
  for (const item of items) {
    const note = item.note ? ` (ملاحظة: ${item.note})` : "";
    lines.push(`- ${item.name} [${item.mealDay}] x${item.quantity}${note}`);
  }
  lines.push("");

  if (order?.discount > 0) {
    lines.push(`🎁 الخصم: -${order.discount} DH`);
  }

  if (order?.totalPrice !== undefined) {
    lines.push(`💰 المجموع: ${order.totalPrice} DH`);
  }

  lines.push("");
  lines.push("👤 الزبون:");
  lines.push(`الاسم: ${customer.name}`);
  lines.push(`الهاتف: ${customer.phone}`);

  lines.push("");
  lines.push("📍 التوصيل:");
  lines.push(
    `النوع: ${LOCATION_TYPE_LABELS[delivery.locationType] ?? delivery.locationType}`
  );
  lines.push(`المدينة: ${delivery.city}`);
  lines.push(`الحي: ${delivery.quartier}`);

  if (delivery.receiverName) {
    lines.push(`يستلمها: ${delivery.receiverName}`);
  }

  lines.push("");
  lines.push("شكراً.");

  return lines.join("\n");
};

export const buildWhatsappUrl = (message) => {
  const number = getWhatsappNumber();

  if (!number) {
    return null;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};