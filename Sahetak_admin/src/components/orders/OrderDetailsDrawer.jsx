import { MapPin, Phone, User } from "lucide-react";

import Drawer from "../ui/Drawer";
import Select from "../ui/Select";
import OrderStatusBadge from "./OrderStatusBadge";
import { ORDER_STATUSES, LOCATION_TYPE_LABELS } from "../../constants";
import { formatCurrency, formatDate } from "../../utils/format";

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-semibold text-gray-800">{value}</span>
  </div>
);

const OrderDetailsDrawer = ({ open, onClose, order, onStatusChange, updating }) => {
  if (!order) {
    return null;
  }

  const delivery = order.delivery ?? {};

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={order.trackingCode ? `Order ${order.trackingCode}` : `Order #${order._id.slice(-6).toUpperCase()}`}
      description={formatDate(order.createdAt)}
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <OrderStatusBadge status={order.status} />

          <Select
            name="status"
            value={order.status}
            onChange={(event) => onStatusChange(event.target.value)}
            disabled={updating}
            options={ORDER_STATUSES}
            containerClassName="w-44"
          />
        </div>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest">
            <User className="h-4 w-4 text-primary" />
            Customer
          </h3>

          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <Row label="Name" value={order.customer?.name ?? "-"} />

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-gray-500">Phone</span>
              <a
                href={`tel:${order.customer?.phone}`}
                className="flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                {order.customer?.phone ?? "-"}
              </a>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest">
            <MapPin className="h-4 w-4 text-primary" />
            Delivery
          </h3>

          <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <Row label="City" value={delivery.city ?? "-"} />
            <Row label="Quartier" value={delivery.quartier ?? "-"} />
            <Row
              label="Location type"
              value={LOCATION_TYPE_LABELS[delivery.locationType] ?? delivery.locationType ?? "-"}
            />
            <Row label="Receiver" value={delivery.receiverName || "-"} />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-bold text-forest">
            Items ({order.items?.length ?? 0})
          </h3>

          <ul className="space-y-2">
            {(order.items ?? []).map((item, index) => (
              <li
                key={item._id ?? index}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
              >
                {item.product?.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product?.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">
                    {item.product?.name ?? "Deleted product"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {item.mealDay} · {item.quantity} × {formatCurrency(item.price)}
                  </p>

                  {item.note ? (
                    <p className="mt-1 text-xs italic text-gray-500">
                      “{item.note}”
                    </p>
                  ) : null}
                </div>

                <span className="shrink-0 font-bold text-forest">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-bold text-forest">Summary</h3>

          <div className="space-y-2">
            <Row label="Subtotal" value={formatCurrency(order.subtotal)} />

            <Row
              label={
                order.promotion
                  ? `Promotion (${order.promotion.type === "percentage" ? `${order.promotion.value}%` : formatCurrency(order.promotion.value)})`
                  : "Discount"
              }
              value={`- ${formatCurrency(order.discount)}`}
            />

            <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-base">
              <span className="font-bold text-forest">Total</span>
              <span className="font-extrabold text-forest">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
};

export default OrderDetailsDrawer;
