import OrderItem from "./OrderItem";
import Spinner from "../ui/Spinner";
import { computeOrderTotals } from "../../utils/pricing";
import { formatCurrency } from "../../utils/formatters";

const OrderSummary = ({
  items,
  pricing,
  pricingLoading = false,
  onQuantityChange,
  onNoteChange,
  onRemove,
  footer,
  title = "Votre commande",
}) => {
  const finalPriceById = new Map();

  for (const entry of pricing?.products ?? []) {
    finalPriceById.set(String(entry.product), Number(entry.finalPrice));
  }

  const totals = pricing ? computeOrderTotals(pricing, items) : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-forest">{title}</h2>

        {pricingLoading ? <Spinner className="h-4 w-4" /> : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">
          Votre commande est vide.
        </p>
      ) : (
        <>
          <ul className="mt-2 divide-y divide-gray-100">
            {items.map((item) => (
              <OrderItem
                key={item.key}
                item={item}
                unitPrice={finalPriceById.get(String(item.productId)) ?? item.unitPrice}
                onQuantityChange={onQuantityChange}
                onNoteChange={onNoteChange}
                onRemove={onRemove}
              />
            ))}
          </ul>

          <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
            {totals ? (
              <>
                <div className="flex justify-between text-gray-500">
                  <span>Sous-total</span>
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>

                {totals.discountAmount > 0 ? (
                  <div className="flex justify-between font-bold text-leaf">
                    <span>Remise (packs / promos)</span>
                    <span>- {formatCurrency(totals.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-base font-extrabold text-forest">
                  <span>Total</span>
                  <span>{formatCurrency(totals.totalPrice)}</span>
                </div>
              </>
            ) : (
              <p className="text-center text-xs text-gray-400">
                Calcul du prix...
              </p>
            )}
          </div>
        </>
      )}

      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
};

export default OrderSummary;
