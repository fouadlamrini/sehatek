import { useState } from "react";
import { Flame, Maximize2 } from "lucide-react";

import QuantityStepper from "../ui/QuantityStepper";
import { MAX_ITEM_QUANTITY } from "../../constants";
import { formatCurrency } from "../../utils/formatters";
import { cn } from "../../utils/cn";

const ProductCard = ({
  product,
  mealDay,
  quantity,
  note,
  maxQty = MAX_ITEM_QUANTITY,
  onToggle,
  onQuantityChange,
  onNoteChange,
  onImageClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = quantity > 0;
  const hasPromotion = Boolean(product.promotion);
  const unitPrice = Number(product.promotion?.finalPrice ?? product.price);

  const stock = Number(product.stock);
  const outOfStock = Number.isFinite(stock) && stock <= 0;

  const handleToggle = () => {
    onToggle();
    setIsOpen(false);
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-white shadow-sm transition-all duration-200",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-gray-200"
      )}
    >
      {hasPromotion ? (
        <span className="absolute -top-3 right-2 z-10 flex rotate-[-6deg] items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg ring-2 ring-white">
          <Flame className="h-4 w-4" />
          Promotion
        </span>
      ) : null}

      {outOfStock && !isSelected ? (
        <span className="absolute -top-3 left-2 z-10 flex rotate-[-6deg] items-center rounded-full bg-red-600 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg ring-2 ring-white">
          Rupture de stock
        </span>
      ) : null}

      <div className="flex items-center gap-4 p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggle}
          disabled={!isSelected && outOfStock}
          style={{ accentColor: "#E58730" }}
          className="h-5 w-5 flex-shrink-0 cursor-pointer rounded disabled:cursor-not-allowed disabled:opacity-40"
        />

        <div
          onClick={() => onImageClick?.(product.image, product.name)}
          className="group relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
              outOfStock && !isSelected && "grayscale"
            )}
/>

          <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
            {mealDay}
          </span>

          <h3 className="mt-1 truncate text-base font-bold text-gray-800">
            {product.name}
          </h3>

          <p className="mt-0.5 flex items-center gap-2 text-sm font-extrabold text-forest">
            {hasPromotion ? (
              <>
                <span className="text-leaf">{formatCurrency(unitPrice)}</span>
                <span className="font-normal text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              formatCurrency(product.price)
            )}
          </p>
        </div>
      </div>

      {isSelected ? (
        <div className="rounded-b-xl border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-xs font-bold text-primary transition-colors hover:bg-gray-100"
          >
            <span>{isOpen ? "Masquer" : "Modifier"}</span>
            <span className="text-sm">{isOpen ? "▴" : "▾"}</span>
          </button>

          {isOpen ? (
            <div className="space-y-3 border-t border-gray-100 bg-white p-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">
                  Quantité:
                </span>

                <QuantityStepper
                  value={quantity}
                  min={1}
                  max={maxQty}
                  onChange={onQuantityChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Ajouter une note:
                </label>

                <input
                  type="text"
                  placeholder="Ex: Sans oignon, bien cuit..."
                  value={note}
                  onChange={(event) => onNoteChange(event.target.value)}
                  maxLength={200}
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default ProductCard;
