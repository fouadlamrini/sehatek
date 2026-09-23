import { Trash2 } from "lucide-react";

import QuantityStepper from "../ui/QuantityStepper";
import { MAX_ITEM_QUANTITY } from "../../constants";
import { formatCurrency } from "../../utils/formatters";

const OrderItem = ({ item, unitPrice, onQuantityChange, onNoteChange, onRemove }) => {
  const stock = Number(item.stock);
  const maxQty = Number.isFinite(stock)
    ? Math.min(MAX_ITEM_QUANTITY, stock)
    : MAX_ITEM_QUANTITY;
  const lineTotal = (unitPrice ?? item.unitPrice) * item.quantity;

  return (
    <li className="flex gap-3 py-3">
      <img
        src={item.image}
        alt={item.name}
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-bold text-gray-800">{item.name}</p>
            <p className="text-xs font-semibold text-primary">{item.mealDay}</p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.key)}
            aria-label="Retirer"
            className="shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantityStepper
            value={item.quantity}
            min={1}
            max={maxQty}
            onChange={(qty) => onQuantityChange(item.key, qty)}
          />

          <span className="font-extrabold text-forest">
            {formatCurrency(lineTotal)}
          </span>
        </div>

        <input
          type="text"
          value={item.note}
          onChange={(event) => onNoteChange(item.key, event.target.value)}
          placeholder="Note (ex: sans oignon)"
          maxLength={200}
          className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none transition focus:border-primary focus:bg-white"
        />
      </div>
    </li>
  );
};

export default OrderItem;
