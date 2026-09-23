import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, X } from "lucide-react";

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

  // Only fetch pricing while the drawer is visible.
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
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mon panier"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-forest">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Mon Panier
            {itemsCount > 0 ? (
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
                {itemsCount}
              </span>
            ) : null}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le panier"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
            <p className="font-semibold text-gray-600">
              Votre panier est vide
            </p>
            <p className="text-sm text-gray-400">
              Sélectionnez des plats depuis le menu pour commencer.
            </p>
            <Button
              onClick={() => {
                onClose();
                navigate("/");
              }}
            >
              Voir le menu
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-4">
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

            <footer className="space-y-3 border-t border-gray-100 px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total:</span>
                  <span className="font-semibold">
                    {formatCurrency(totals?.subtotal ?? 0)}
                  </span>
                </div>

                {totals && totals.discountAmount > 0 ? (
                  <div className="flex justify-between font-bold text-leaf">
                    <span>Remise (packs / promos):</span>
                    <span>- {formatCurrency(totals.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between border-t pt-2 text-lg font-black text-forest">
                  <span>Total:</span>
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
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-leaf py-3.5 text-base font-bold text-white shadow-lg transition duration-200 hover:bg-forest"
              >
                Suivant
                <ArrowRight className="h-5 w-5" />
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