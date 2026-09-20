export const computePackPricing = (pack) => {
  const products = pack?.products ?? [];

  const originalTotal = products.reduce(
    (sum, product) => sum + Number(product?.price ?? 0),
    0
  );

  let finalPrice;

  if (pack?.type === "price") {
    // The value is the final pack price.
    finalPrice = Number(pack.value);
  } else if (pack?.type === "fixed") {
    finalPrice = originalTotal - Number(pack.value);
  } else {
    // percentage
    finalPrice = originalTotal - (originalTotal * Number(pack.value)) / 100;
  }

  if (Number.isNaN(finalPrice)) {
    finalPrice = 0;
  }

  finalPrice = Math.max(0, finalPrice);

  const discount = Math.max(0, originalTotal - finalPrice);

  return { originalTotal, finalPrice, discount };
};
