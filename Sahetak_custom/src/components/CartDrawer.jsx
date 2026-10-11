import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, X } from "lucide-react";

import OrderItem from "./order/OrderItem";
import Button from "./ui/Button";
import { useOrder } from "../context/OrderContext";
import { useCartPricing } from "../hooks/useCartPricing";
import { computeOrderTotals } from "../utils/pricing";
import { formatCurrency } from "../utils/formatters";
import { cn } from "../utils/cn";

const CartDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const {
    items,
    itemsCount,
    distinctProductIds,
    setQuantity,
    setNote,
    removeItem,
  } = useOrder();

  const { pricing, loading: pricingLoading } = useCartPricing(
    open ? distinctProductIds : []
  );

  const unitPriceById = new Map(
    (pricing?.products ?? []).map((entry) => [
      String(entry.product),
      Number(entry.finalPrice),
    ])
  );

  const totals = pricing ? computeOrderTotals(pricing, items) : null;

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleNext = () => {
    onClose();
    navigate("/informations");
  };

  const empty = items.length === 0;

  return createPortal(
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}>
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سلتي"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-gray-100 bg-forest-deep px-5 py-5">
          <h2 dir="rtl" className="flex items-center gap-2 text-lg font-bold text-white">
            <ShoppingBag className="h-5 w-5 text-primary" />
            السلة ديالي
            {itemsCount > 0 ? (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">
                {itemsCount}
              </span>
            ) : null}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="سد السلة"
            className="cursor-pointer rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-10 w-10 text-gray-300" />
            </div>

            <p dir="rtl" className="text-lg font-semibold text-gray-600">
              السلة ديالك فارغة
            </p>

            <p dir="rtl" className="text-sm text-gray-400">
              اختار شي أطباق من القائمة باش تبدا.
            </p>

            <Button
              onClick={() => {
                onClose();
                navigate("/");
              }}
              className="mt-2"
            >
              شوف القائمة
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {items.map((item) => (
                <OrderItem
                  key={item.key}
                  item={item}
                  unitPrice={unitPriceById.get(String(item.productId))}
                  onQuantityChange={setQuantity}
                  onNoteChange={setNote}
                  onRemove={removeItem}
                />
              ))}
            </ul>

            <footer className="space-y-4 border-t border-gray-100 bg-gray-50 px-5 py-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">
                    {formatCurrency(totals?.subtotal ?? 0)}
                  </span>
                </div>

                {totals && totals.discountAmount > 0 ? (
                  <div className="flex justify-between font-bold text-leaf">
                    <span>الخصم (باقات / عروض):</span>
                    <span>- {formatCurrency(totals.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-lg font-black text-forest">
                  <span>المجموع</span>
                  <span>
                    {pricingLoading && !totals
                      ? "..."
                      : formatCurrency(totals?.totalPrice ?? 0)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
              >
                متابعة
                <ArrowLeft className="h-5 w-5" />
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
};

export default CartDrawer;
