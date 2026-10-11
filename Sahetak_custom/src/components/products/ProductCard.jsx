import { useState } from "react";
import { Check, Flame, Maximize2, Plus } from "lucide-react";

import QuantityStepper from "../ui/QuantityStepper";
import { MAX_ITEM_QUANTITY } from "../../constants";
import { formatCurrency, formatDay } from "../../utils/formatters";
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
  const locked = outOfStock && !isSelected;

  const handleToggle = () => {
    onToggle();
    setIsOpen(!isSelected);
  };

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300",
        isSelected
          ? "border-primary shadow-[0_20px_50px_rgba(229,135,48,0.2)]"
          : "border-gray-200/80 shadow-[0_4px_20px_rgba(32,65,21,0.06)] hover:shadow-[0_16px_40px_rgba(32,65,21,0.12)] hover:-translate-y-1",
        locked && "opacity-70"
      )}
    >
      <div
        onClick={() => onImageClick?.(product.image, product.name)}
        className="group/img relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-gray-100"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110",
            locked && "grayscale"
          )}
        />

        <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/img:opacity-100" />

        <span
          dir="rtl"
          className="absolute bottom-3 left-3 rounded-full bg-forest/90 px-3.5 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm"
        >
          {formatDay(mealDay)}
        </span>

        {hasPromotion ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
            <Flame className="h-3.5 w-3.5" />
            عرض خاص
          </span>
        ) : null}

        {locked ? (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
            نفدت الكمية
          </span>
        ) : null}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleToggle();
          }}
          disabled={locked}
          aria-pressed={isSelected}
          aria-label={isSelected ? `إزالة ${product.name}` : `إضافة ${product.name}`}
          className={cn(
            "absolute bottom-3 right-3 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white/80 transition-all duration-300 hover:scale-110 active:scale-95",
            isSelected
              ? "bg-leaf"
              : "bg-primary",
            locked && "cursor-not-allowed bg-gray-400 hover:scale-100"
          )}
        >
          {isSelected ? (
            <Check className="h-5 w-5" strokeWidth={3} />
          ) : (
            <Plus className="h-5 w-5" strokeWidth={3} />
          )}
        </button>

        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/img:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-forest">
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-serif text-2xl font-semibold text-leaf">
            {formatCurrency(hasPromotion ? unitPrice : product.price)}
          </span>

          {hasPromotion ? (
            <span className="text-sm font-medium text-gray-400 line-through">
              {formatCurrency(product.price)}
            </span>
          ) : null}
        </div>

        {isSelected ? (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex w-full cursor-pointer items-center justify-between text-xs font-bold text-primary transition-colors hover:text-primary-dark"
            >
              <span>{isOpen ? "إخفاء" : "تعديل"}</span>
              <span className="text-sm">{isOpen ? "▴" : "▾"}</span>
            </button>

            {isOpen ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">
                    الكمية:
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
                    إضافة ملاحظة:
                  </label>

                  <input
                    type="text"
                    placeholder="مثال: بدون بصل، نضج كامل..."
                    value={note}
                    onChange={(event) => onNoteChange(event.target.value)}
                    maxLength={200}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default ProductCard;
