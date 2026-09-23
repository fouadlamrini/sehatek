import { useMemo } from "react";

import ProductCard from "./ProductCard";
import { buildProductDayCards } from "../../utils/catalog";
import { MAX_ITEM_QUANTITY } from "../../constants";

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
      totals[item.productId] = (totals[item.productId] ?? 0) + item.quantity;
    }

    return totals;
  }, [items]);

  const cards = useMemo(() => buildProductDayCards(products), [products]);

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
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
            onQuantityChange={(quantity) => onQuantityChange(key, quantity)}
            onNoteChange={(note) => onNoteChange(key, note)}
            onImageClick={onImageClick}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
