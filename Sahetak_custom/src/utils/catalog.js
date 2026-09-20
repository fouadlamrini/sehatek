// Splits every product into one card per meal day, so a multi-day product
// shows as separate cards (product + first day, product + second day, ...).
export const buildProductDayCards = (products) => {
  const cards = [];

  for (const product of products) {
    for (const mealDay of product.mealDays ?? []) {
      cards.push({
        key: `${product._id}__${mealDay}`,
        product,
        mealDay,
      });
    }
  }

  return cards;
};
