import { useMemo } from "react";

import ProductCard from "./ProductCard";
import { buildProductDayCards } from "../../utils/catalog";

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

  const cards = useMemo(() => buildProductDayCards(products), [products]);

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
      {cards.map(({ key, product, mealDay }) => {
        const item = itemByKey[key];

        return (
          <ProductCard
            key={key}
            product={product}
            mealDay={mealDay}
            quantity={item?.quantity ?? 0}
            note={item?.note ?? ""}
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
