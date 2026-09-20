const round2 = (n) => Number(n.toFixed(2));

// Mirrors backend computeOrderTotals so the client preview matches the real order.
// A Pack covers ONE unit of each of its products per order; extra quantity is
// sold individually. A product inside a Pack never gets a Promotion.
export const computeOrderTotals = (pricing, items) => {
  const quantityByProduct = new Map();

  for (const item of items) {
    const id = String(item.productId);
    quantityByProduct.set(id, (quantityByProduct.get(id) || 0) + Number(item.quantity));
  }

  const finalPriceById = new Map();
  const normalPriceById = new Map();

  for (const entry of pricing.products ?? []) {
    const key = String(entry.product);
    finalPriceById.set(key, Number(entry.finalPrice));
    normalPriceById.set(key, Number(entry.originalPrice));
  }

  const packProductIds = new Set();
  let packTotal = 0;

  for (const pack of pricing.packs ?? []) {
    packTotal += Number(pack.packPrice);

    for (const pid of pack.products) {
      packProductIds.add(String(pid));
    }
  }

  const subtotal = [...quantityByProduct].reduce(
    (sum, [id, qty]) => sum + (normalPriceById.get(id) || 0) * qty,
    0
  );

  let itemsTotal = 0;

  for (const [id, qty] of quantityByProduct) {
    const unitFinalPrice = finalPriceById.get(id) || 0;

    if (packProductIds.has(id)) {
      itemsTotal += unitFinalPrice * Math.max(qty - 1, 0);
    } else {
      itemsTotal += unitFinalPrice * qty;
    }
  }

  const totalPrice = round2(packTotal + itemsTotal);
  const discountAmount = round2(Math.max(subtotal - totalPrice, 0));

  return {
    subtotal: round2(subtotal),
    discountAmount,
    totalPrice,
  };
};

// Local preview of a Pack's final price (display only — backend is source of truth).
export const computePackPrice = (pack) => {
  const products = pack?.products ?? [];
  const originalTotal = products.reduce(
    (sum, product) => sum + Number(product?.price ?? 0),
    0
  );

  let finalPrice;

  if (pack?.type === "price") {
    finalPrice = Number(pack.value);
  } else if (pack?.type === "fixed") {
    finalPrice = originalTotal - Number(pack.value);
  } else {
    finalPrice = originalTotal - (originalTotal * Number(pack.value)) / 100;
  }

  if (Number.isNaN(finalPrice)) {
    finalPrice = 0;
  }

  finalPrice = Math.max(0, finalPrice);

  return {
    originalTotal,
    finalPrice: round2(finalPrice),
    discount: round2(Math.max(0, originalTotal - finalPrice)),
  };
};
