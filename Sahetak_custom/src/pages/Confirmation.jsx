import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Pencil } from "lucide-react";

import * as orderApi from "../api/orderApi";

import StepLayout from "../components/layout/StepLayout";
import Button from "../components/ui/Button";
import OrderSummary from "../components/order/OrderSummary";

import { useOrder } from "../context/OrderContext";
import { useCartPricing } from "../hooks/useCartPricing";
import { LOCATION_TYPE_LABELS, STEPS } from "../constants";
import { computeOrderTotals } from "../utils/pricing";
import { formatCurrency } from "../utils/formatters";

const buildPayload = (items, customer, delivery) => ({
  items: items.map((item) => ({
    product: item.productId,
    mealDay: item.mealDay,
    quantity: item.quantity,
    ...(item.note.trim() ? { note: item.note.trim() } : {}),
  })),
  customer: {
    name: customer.name.trim(),
    phone: customer.phone.trim(),
  },
  delivery: {
    city: delivery.city.trim(),
    quartier: delivery.quartier.trim(),
    locationType: delivery.locationType,
    ...(delivery.receiverName.trim()
      ? { receiverName: delivery.receiverName.trim() }
      : {}),
  },
});

const RecapCard = ({ title, onEdit, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-forest">{title}</h3>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        <Pencil className="h-3.5 w-3.5" />
        Modifier
      </button>
    </div>
    <div className="mt-2 text-sm text-gray-600">{children}</div>
  </div>
);

const Confirmation = () => {
  const navigate = useNavigate();
  const {
    items,
    customer,
    delivery,
    distinctProductIds,
    removeItem,
    setQuantity,
    setNote,
    setSubmittedOrder,
  } = useOrder();

  const { pricing, loading: pricingLoading } = useCartPricing(distinctProductIds);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      navigate("/", { replace: true });
    } else if (!customer.name.trim()) {
      navigate("/informations", { replace: true });
    } else if (!delivery.city.trim()) {
      navigate("/livraison", { replace: true });
    }
  }, [items.length, customer.name, delivery.city, navigate]);

  const totalPrice = pricing
    ? computeOrderTotals(pricing, items).totalPrice
    : null;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await orderApi.createOrder(
        buildPayload(items, customer, delivery)
      );

      setSubmittedOrder(data);
      navigate("/success");
    } catch (err) {
      // Never dump raw server fields/validation to the client.
      setError(
        err?.response?.data?.errors
          ? "Certaines informations sont invalides. Vérifiez vos champs."
          : "Échec de l'envoi de la commande. Réessayez."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepLayout
      step={3}
      onBack={(index) => navigate(STEPS[index]?.path ?? "/")}
      title="Confirmation"
      subtitle="Vérifiez votre commande avant de valider"
    >
      <div className="space-y-4">
        <OrderSummary
          title="Votre commande"
          items={items}
          pricing={pricing}
          pricingLoading={pricingLoading}
          onQuantityChange={setQuantity}
          onNoteChange={setNote}
          onRemove={removeItem}
        />

        <RecapCard
          title="Client"
          onEdit={() => navigate("/informations")}
        >
          <p className="font-semibold text-gray-800">{customer.name}</p>
          <p>{customer.phone}</p>
        </RecapCard>

        <RecapCard
          title="Livraison"
          onEdit={() => navigate("/livraison")}
        >
          <p>
            {LOCATION_TYPE_LABELS[delivery.locationType] ?? delivery.locationType}
          </p>
          <p>
            {delivery.quartier}, {delivery.city}
          </p>
          {delivery.receiverName ? (
            <p className="text-gray-400">
              Reçu par : {delivery.receiverName}
            </p>
          ) : null}
        </RecapCard>

        {error ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        <Button
          icon={CheckCircle2}
          loading={submitting}
          disabled={!pricing || pricingLoading}
          onClick={handleConfirm}
          size="lg"
          className="w-full"
        >
          {totalPrice !== null
            ? `Confirmer la commande · ${formatCurrency(totalPrice)}`
            : "Confirmer la commande"}
        </Button>
      </div>
    </StepLayout>
  );
};

export default Confirmation;
