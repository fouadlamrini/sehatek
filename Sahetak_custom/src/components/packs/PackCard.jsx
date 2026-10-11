import { useState } from "react";
import { ChevronDown, Gift, Plus } from "lucide-react";

import Button from "../ui/Button";
import { formatCurrency, formatDays } from "../../utils/formatters";
import { computePackPrice } from "../../utils/pricing";
import { cn } from "../../utils/cn";

const PackCard = ({ pack, onAdd, onImageClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const products = pack.products ?? [];
  const { originalTotal, finalPrice, discount } = computePackPrice(pack);
  const image = products[0]?.image;

  const unavailable = products.some(
    (product) => Number(product.stock) <= 0
  );

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-[0_4px_20px_rgba(32,65,21,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(32,65,21,0.12)]",
        unavailable ? "border-gray-200 opacity-60" : "border-leaf/20"
      )}
    >
      <div className="relative overflow-hidden">
        <button
          type="button"
          onClick={() => image && onImageClick?.(image, pack.name)}
          className="block h-40 w-full overflow-hidden bg-gray-100"
        >
          {image ? (
            <img
              src={image}
              alt={pack.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : null}
        </button>

        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-leaf px-2.5 py-1 text-xs font-extrabold text-white shadow-md">
          <Gift className="h-3.5 w-3.5" />
          باقة
        </span>

        {unavailable ? (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-md">
            غير متوفرة
          </span>
        ) : discount > 0 ? (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-extrabold text-white shadow-md">
            -{formatCurrency(discount)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-bold text-gray-800">{pack.name}</h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-leaf">
            {formatCurrency(finalPrice)}
          </span>
          {discount > 0 ? (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(originalTotal)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="mt-3 flex cursor-pointer items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary-dark"
        >
          {isOpen
            ? "إخفاء الأطباق"
            : `شوف الأطباق (${products.length})`}
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>

        {isOpen ? (
          <ul className="mt-2 space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
            {products.map((product) => (
              <li key={product._id} className="flex items-center gap-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-9 w-9 shrink-0 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-gray-700">
                    {product.name}
                  </p>
                  {product.mealDays?.length ? (
                    <p className="text-[11px] text-gray-400">
                      {formatDays(product.mealDays)}
                    </p>
                  ) : null}
                </div>

                <span
                  className={cn(
                    "text-xs font-bold",
                    Number(product.stock) <= 0 ? "text-red-500" : "text-forest"
                  )}
                >
                  {Number(product.stock) <= 0
                    ? "نفدت"
                    : formatCurrency(product.price)}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <Button
          variant="leaf"
          size="sm"
          icon={Plus}
          disabled={unavailable}
          onClick={() => onAdd(pack)}
          className="mt-3 w-full"
        >
          {unavailable ? "غير متوفرة" : "زيد الباقة"}
        </Button>
      </div>
    </article>
  );
};

export default PackCard;
