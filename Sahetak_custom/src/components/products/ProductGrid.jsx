import { useMemo } from "react";

import ProductCard from "./ProductCard";
import { buildProductDayCards } from "../../utils/catalog";
import { MAX_ITEM_QUANTITY } from "../../constants";

// ترتيب أيام الأسبوع بطريقة دقيقة ومضمونة
const DAYS_ORDER = {
  "الاثنين": 1,
  "الإثنين": 1,
  lundi: 1,
  "الثلاثاء": 2,
  mardi: 2,
  "الاربعاء": 3,
  "الأربعاء": 3,
  mercredi: 3,
  "الخميس": 4,
  jeudi: 4,
  "الجمعة": 5,
  vendredi: 5,
  "السبت": 6,
  samedi: 6,
  "الاحد": 7,
  "الأحد": 7,
  dimanche: 7,
};

const getDayOrder = (day) => {
  const normalizedDay = String(day ?? "").trim().toLowerCase();
  return DAYS_ORDER[normalizedDay] ?? 99;
};

const ProductGrid = ({
  products,
  items,
  onToggle,
  onQuantityChange,
  onNoteChange,
  onImageClick,
}) => {
  const itemByKey = useMemo(() => {
    const map = {};

    for (const item of items) {
      map[item.key] = item;
    }

    return map;
  }, [items]);

  const usedByProduct = useMemo(() => {
    const totals = {};

    for (const item of items) {
      totals[item.productId] =
        (totals[item.productId] ?? 0) + item.quantity;
    }

    return totals;
  }, [items]);

  // إنشاء البطاقات وترتيبها بشكل دقيق حسب أيام الأسبوع
  const cards = useMemo(() => {
    const generatedCards = buildProductDayCards(products);

    return [...generatedCards].sort((a, b) => {
      const dayDiff = getDayOrder(a.mealDay) - getDayOrder(b.mealDay);
      if (dayDiff !== 0) return dayDiff;
      
      // في حالة كان نفس اليوم، نحافظ على الترتيب الأصلي
      return 0;
    });
  }, [products]);

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ key, product, mealDay }) => {
        const item = itemByKey[key];
        const currentQty = item?.quantity ?? 0;
        const used = usedByProduct[product._id] ?? 0;

        const stock = Number(product.stock);

        const maxQty = Number.isFinite(stock)
          ? Math.min(
              MAX_ITEM_QUANTITY,
              Math.max(0, stock - (used - currentQty))
            )
          : MAX_ITEM_QUANTITY;

        return (
          <ProductCard
            key={key}
            product={product}
            mealDay={mealDay}
            quantity={currentQty}
            note={item?.note ?? ""}
            maxQty={maxQty}
            onToggle={() => onToggle(product, mealDay)}
            onQuantityChange={(quantity) =>
              onQuantityChange(key, quantity)
            }
            onNoteName={(note) => onNoteChange(key, note)}
            onNoteChange={(note) => onNoteChange(key, note)}
            onImageClick={onImageClick}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;