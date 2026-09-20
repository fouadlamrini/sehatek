import { Gift } from "lucide-react";

import Drawer from "../ui/Drawer";
import Badge from "../ui/Badge";
import { computePackPricing } from "../../utils/pack";
import { formatCurrency, formatDays } from "../../utils/format";
import { PACK_TYPE_LABELS } from "../../constants";

const Row = ({ label, value, strong, muted }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span className={muted ? "text-gray-400" : "text-gray-500"}>{label}</span>
    <span
      className={
        strong ? "text-base font-extrabold text-forest" : "font-semibold text-gray-800"
      }
    >
      {value}
    </span>
  </div>
);

const PackDetailsDrawer = ({ open, onClose, pack }) => {
  if (!pack) {
    return null;
  }

  const products = pack.products ?? [];
  const { originalTotal, finalPrice, discount } = computePackPricing(pack);

  const discountLabel =
    pack.type === "price"
      ? "Discount"
      : pack.type === "fixed"
        ? `Discount (${formatCurrency(pack.value)})`
        : `Discount (${pack.value}%)`;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={pack.name}
      description={
        <span className="flex items-center gap-2">
          <Badge color="forest">
            {PACK_TYPE_LABELS[pack.type] ?? pack.type}
          </Badge>
          {pack.active ? (
            <Badge color="leaf">Active</Badge>
          ) : (
            <Badge color="gray">Inactive</Badge>
          )}
        </span>
      }
      size="lg"
    >
      <div className="space-y-6">
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest">
            <Gift className="h-4 w-4 text-primary" />
            Products ({products.length})
          </h3>

          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product?._id ?? product}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
              >
                {product?.image ? (
                  <img
                    src={product.image}
                    alt={product?.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">
                    {product?.name ?? "Deleted product"}
                  </p>

                  {product?.mealDays?.length ? (
                    <p className="truncate text-xs text-gray-400">
                      {formatDays(product.mealDays)}
                    </p>
                  ) : null}
                </div>

                <span className="shrink-0 font-semibold text-gray-700">
                  {formatCurrency(product?.price)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-bold text-forest">Pricing</h3>

          <div className="space-y-2">
            <Row
              label="Original total"
              value={formatCurrency(originalTotal)}
              muted
            />

            {discount > 0 ? (
              <Row
                label={discountLabel}
                value={`- ${formatCurrency(discount)}`}
              />
            ) : null}

            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="font-bold text-forest">Final price</span>
              <span className="text-lg font-extrabold text-primary">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
};

export default PackDetailsDrawer;
