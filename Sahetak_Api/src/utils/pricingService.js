const mongoose = require("mongoose");

const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const Pack = require("../models/Pack");
const AppError = require("./AppError");

const round2 = (n) => Number(n.toFixed(2));

// =========================
// PROMOTION HELPERS
// =========================

// A Promotion always belongs to exactly ONE product.
// Check that the id is a valid ObjectId and that the product exists.
const validatePromotionProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Valid product id is required", 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

// Only one ACTIVE promotion per product is allowed (inactive history is fine).
const findActivePromotionForProduct = async (productId) => {
  return Promotion.findOne({ product: productId, active: true });
};

// =========================
// PACK HELPERS
// =========================

// Validate a products array for a Pack:
// non-empty, valid ObjectIds, no duplicate products, all products exist.
const validatePackProducts = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new AppError("Pack must contain at least one product", 400);
  }

  if (!productIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
    throw new AppError("Each product must have a valid id", 400);
  }

  if (new Set(productIds.map(String)).size !== productIds.length) {
    throw new AppError("Pack cannot contain duplicate products", 400);
  }

  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new AppError(
      "Pack contains one or more products that do not exist",
      404
    );
  }

  return products;
};

// =========================
// PACK SELECTION
// =========================

// Only Packs whose products are ALL contained in the selected products.
const findApplicablePacks = (packs, selectedIds) => {
  return packs.filter((pack) =>
    pack.products.every((id) => selectedIds.has(id.toString()))
  );
};

// Choose which Packs to apply:
//   1. Prefer the Pack set covering the largest number of selected products.
//   2. On equal coverage prefer the lowest combined Pack price.
//   3. Same coverage AND same price => deterministic tie-break.
//   4. A product can NEVER be part of more than one Pack.
//
// Exact DP over product-subsets (bounded by 2^numberOfSelectedProducts).
// Number of meal products per day is small (7), so this stays cheap.
// If more than MAX_DP_PRODUCTS are selected we fall back to a greedy that
// repeatedly takes the Pack gaining the most new products (lowest price on
// tie). Both strategies are deterministic (documented decision, no guessing).
const MAX_DP_PRODUCTS = 12;

const selectPackCombination = (
  applicablePacks,
  selectedIds,
  priceOfPack = (pack) => Number(pack.price)
) => {
  if (selectedIds.size > MAX_DP_PRODUCTS) {
    return greedySelectPacks(applicablePacks, priceOfPack);
  }

  const idList = [...selectedIds];
  const index = new Map(idList.map((id, i) => [id, i]));

  const packsAsBitmask = applicablePacks.map((pack) => {
    let mask = 0;

    for (const pid of pack.products) {
      mask |= 1 << index.get(pid.toString());
    }

    return { pack, mask, count: pack.products.length };
  });

  const total = 1 << idList.length;

  const dp = Array.from({ length: total }, () => ({
    coverage: 0,
    totalPackPrice: Infinity,
    chosen: null,
  }));

  dp[0] = { coverage: 0, totalPackPrice: 0, chosen: [] };

  for (let mask = 0; mask < total; mask++) {
    if (dp[mask].chosen === null) {
      continue;
    }

    for (const { pack, mask: packMask, count } of packsAsBitmask) {
      if ((mask & packMask) !== 0) {
        continue;
      }

      const nextMask = mask | packMask;
      const coverage = dp[mask].coverage + count;
      const price = dp[mask].totalPackPrice + priceOfPack(pack);

      if (
        coverage > dp[nextMask].coverage ||
        (coverage === dp[nextMask].coverage &&
          price < dp[nextMask].totalPackPrice)
      ) {
        dp[nextMask] = {
          coverage,
          totalPackPrice: price,
          chosen: [...dp[mask].chosen, pack],
        };
      }
    }
  }

  let best = { coverage: 0, totalPackPrice: Infinity, chosen: [] };

  for (let mask = 1; mask < total; mask++) {
    const candidate = dp[mask];

    if (candidate.chosen === null) {
      continue;
    }

    if (
      candidate.coverage > best.coverage ||
      (candidate.coverage === best.coverage &&
        candidate.totalPackPrice < best.totalPackPrice)
    ) {
      best = candidate;
    }
  }

  return best.chosen;
};

// Greedy fallback for large selections (deterministic).
const greedySelectPacks = (
  applicablePacks,
  priceOfPack = (pack) => Number(pack.price)
) => {
  const chosen = [];
  const covered = new Set();

  let remaining = [...applicablePacks];

  while (remaining.length > 0) {
    let bestIndex = -1;
    let bestGain = 0;
    let bestPrice = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const pack = remaining[i];
      const gain = pack.products.filter(
        (id) => !covered.has(id.toString())
      ).length;

      if (gain === 0) {
        continue;
      }

      const price = priceOfPack(pack);

      if (gain > bestGain || (gain === bestGain && price < bestPrice)) {
        bestGain = gain;
        bestPrice = price;
        bestIndex = i;
      }
    }

    if (bestIndex === -1) {
      break;
    }

    const pack = remaining[bestIndex];
    chosen.push(pack);

    for (const id of pack.products) {
      covered.add(id.toString());
    }

    remaining = remaining.filter((_, i) => i !== bestIndex);
  }

  return chosen;
};

// =========================
// PRICE CALCULATION
// =========================

// Discounted price for a single product under its active Promotion.
// A fixed discount is capped at the product price so the final is never < 0.
const calculatePromotionPrice = (price, promotion) => {
  const originalPrice = Number(price);
  let discount = 0;

  if (promotion.type === "percentage") {
    discount = (originalPrice * Number(promotion.value)) / 100;
  } else {
    discount = Number(promotion.value);
  }

  discount = Math.min(discount, originalPrice);

  return {
    originalPrice,
    discountAmount: round2(discount),
    finalPrice: round2(originalPrice - discount),
  };
};

// Pack effective price from the products' original total:
//   "price"      -> value is the FINAL pack price
//   "fixed"      -> discount amount (origin - value), never below 0
//   "percentage" -> discount percentage (origin - value% of origin)
const effectivePackPrice = (pack, products) => {
  const originalTotal = products.reduce(
    (sum, product) => sum + product.price,
    0
  );

  if (pack.type === "fixed") {
    return Math.max(originalTotal - Number(pack.value), 0);
  }

  if (pack.type === "percentage") {
    return originalTotal * (1 - Number(pack.value) / 100);
  }

  return Number(pack.value);
};

// Pack has ONE price computed from its type/value.
const calculatePackPrice = (products, pack) => {
  const originalTotal = products.reduce(
    (sum, product) => sum + Number(product.price),
    0
  );

  const packPrice = effectivePackPrice(pack, products);

  return {
    originalTotal: round2(originalTotal),
    packPrice: round2(packPrice),
    discountAmount: round2(originalTotal - packPrice),
  };
};

// =========================
// CART PRICING
// =========================

// Full cart calculation for a set of selected products.
//   - Active Packs contained in the selection are applied (no product inside
//     more than one Pack, largest coverage preferred).
//   - Products NOT inside a Pack get their active individual Promotion,
//     otherwise the normal price.
//   - Never apply a Promotion on top of a Pack.
const calculateCartPrice = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new AppError("productIds must contain at least one product", 400);
  }

  if (!productIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
    throw new AppError("Each product id must be valid", 400);
  }

  const seen = new Set();

  for (const id of productIds) {
    const key = id.toString();

    if (seen.has(key)) {
      throw new AppError("Duplicate product ids are not allowed", 400);
    }

    seen.add(key);
  }

  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new AppError("One or more products do not exist", 404);
  }

  const selectedIds = new Set(productIds.map(String));

  const productInfoById = new Map(
    products.map((product) => [
      product._id.toString(),
      { name: product.name, price: Number(product.price) },
    ])
  );

  // 1. Active Packs fully contained in the selection.
  // Sorted by _id so identical coverage/price tie-breaks are deterministic.
  const activePacks = await Pack.find({ active: true })
    .select("products type value")
    .sort({ _id: 1 })
    .lean();

  const applicablePacks = findApplicablePacks(activePacks, selectedIds);

  // Cost of a Pack = its effective price given the current prices.
  const priceOfPack = (pack) => {
    const packProducts = pack.products
      .map((id) => productInfoById.get(id.toString()))
      .filter(Boolean)
      .map((info) => ({ price: info.price }));

    return effectivePackPrice(pack, packProducts);
  };

  // 2. Choose the non-overlapping combination with best coverage / price.
  const chosenPacks = selectPackCombination(
    applicablePacks,
    selectedIds,
    priceOfPack
  );

  const packsBreakdown = [];
  const packCoveredIds = new Set();
  const packIdByProduct = new Map();

  for (const pack of chosenPacks) {
    const packProducts = await Product.find({
      _id: { $in: pack.products },
    });

    const priceCalc = calculatePackPrice(packProducts, pack);
    const productList = pack.products.map((id) => id.toString());

    packsBreakdown.push({
      packId: pack._id,
      products: productList,
      originalTotal: priceCalc.originalTotal,
      packPrice: priceCalc.packPrice,
      discountAmount: priceCalc.discountAmount,
    });

    for (const pid of productList) {
      packCoveredIds.add(pid);
      packIdByProduct.set(pid, pack._id);
    }
  }

  // 3. Remaining products get their active individual Promotion or normal price.
  const activePromotions = await Promotion.find({
    active: true,
    product: { $in: [...selectedIds] },
  });

  const promotionByProduct = new Map();

  for (const promotion of activePromotions) {
    const key = promotion.product.toString();

    // Safety: partial unique index already guarantees at most one active
    // promotion per product, keep the first one just in case.
    if (!promotionByProduct.has(key)) {
      promotionByProduct.set(key, promotion);
    }
  }

  const promotionsBreakdown = [];
  const productsBreakdown = [];

  for (const pid of selectedIds) {
    const info = productInfoById.get(pid);
    const originalPrice = info.price;

    if (packCoveredIds.has(pid)) {
      productsBreakdown.push({
        product: pid,
        name: info.name,
        originalPrice,
        finalPrice: originalPrice,
        packId: packIdByProduct.get(pid),
        promotion: null,
      });
      continue;
    }

    const promotion = promotionByProduct.get(pid);

    if (promotion) {
      const calc = calculatePromotionPrice(originalPrice, promotion);

      promotionsBreakdown.push({
        product: pid,
        type: promotion.type,
        value: promotion.value,
        originalPrice: calc.originalPrice,
        discountAmount: calc.discountAmount,
        finalPrice: calc.finalPrice,
      });

      productsBreakdown.push({
        product: pid,
        name: info.name,
        originalPrice,
        finalPrice: calc.finalPrice,
        packId: null,
        promotion: {
          type: promotion.type,
          value: promotion.value,
        },
      });
    } else {
      productsBreakdown.push({
        product: pid,
        name: info.name,
        originalPrice,
        finalPrice: originalPrice,
        packId: null,
        promotion: null,
      });
    }
  }

  const originalTotal = productsBreakdown.reduce(
    (sum, entry) => sum + entry.originalPrice,
    0
  );

  const packTotal = packsBreakdown.reduce(
    (sum, pack) => sum + pack.packPrice,
    0
  );

  const remainingTotal = productsBreakdown
    .filter((entry) => !entry.packId)
    .reduce((sum, entry) => sum + entry.finalPrice, 0);

  const totalPrice = round2(packTotal + remainingTotal);
  const discountAmount = round2(originalTotal - totalPrice);

  return {
    originalTotal: round2(originalTotal),
    discountAmount,
    totalPrice,
    packs: packsBreakdown,
    promotions: promotionsBreakdown,
    products: productsBreakdown,
  };
};

// =========================
// ORDER PRICING (with quantities)
// =========================

// A Pack covers ONE unit of each of its products per order.
// Extra quantity of a pack-covered product is sold at its individual price.
// Products not inside a Pack are sold at their individual final price
// (Promotion or normal) multiplied by their quantity.
const computeOrderTotals = (pricing, items) => {
  const quantityByProduct = new Map();

  for (const item of items) {
    const id = item.product.toString();
    quantityByProduct.set(id, (quantityByProduct.get(id) || 0) + Number(item.quantity));
  }

  const finalPriceById = new Map();
  const normalPriceById = new Map();

  for (const entry of pricing.products) {
    const key = entry.product.toString();
    finalPriceById.set(key, Number(entry.finalPrice));
    normalPriceById.set(key, Number(entry.originalPrice));
  }

  const packProductIds = new Set();
  let packTotal = 0;

  for (const pack of pricing.packs) {
    packTotal += Number(pack.packPrice);

    for (const pid of pack.products) {
      packProductIds.add(pid.toString());
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

module.exports = {
  validatePromotionProduct,
  findActivePromotionForProduct,
  validatePackProducts,
  findApplicablePacks,
  selectPackCombination,
  calculatePromotionPrice,
  calculatePackPrice,
  calculateCartPrice,
  computeOrderTotals,
};