import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Home, MessageCircle, PackageSearch } from "lucide-react";

import Button from "../components/ui/Button";
import SiteHeader from "../components/layout/SiteHeader";

import { useOrder } from "../context/OrderContext";
import { formatCurrency } from "../utils/formatters";
import { getOrderReference, buildOrderMessage, buildWhatsappUrl } from "../utils/whatsapp";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { items, customer, delivery, submittedOrder, clearOrder } = useOrder();

  useEffect(() => {
    if (!submittedOrder) {
      navigate("/", { replace: true });
    }
  }, [submittedOrder, navigate]);

  if (!submittedOrder) {
    return null;
  }

  const reference = getOrderReference(submittedOrder);
  const whatsappUrl = buildWhatsappUrl(
    buildOrderMessage(items, customer, delivery, submittedOrder)
  );

  const handleNewOrder = () => {
    clearOrder();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <SiteHeader itemsCount={0} />

      <main className="mx-auto max-w-xl px-4 pt-10">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/10">
            <CheckCircle2 className="h-9 w-9 text-leaf" />
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-forest">
            Commande envoyée !
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Nous avons bien reçu votre commande{" "}
            {reference ? (
              <span className="font-bold text-primary">{reference}</span>
            ) : null}
            . Notre équipe vous contactera pour la confirmation.
          </p>

          <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-left text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Client</span>
              <span className="font-semibold text-gray-800">
                {submittedOrder.customer?.name ?? customer.name}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-gray-500">
              <span>Livraison</span>
              <span className="font-semibold text-gray-800">
                {submittedOrder.delivery?.quartier ?? delivery.quartier}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-base font-extrabold text-forest">
              <span>Total</span>
              <span>{formatCurrency(submittedOrder.totalPrice)}</span>
            </div>
          </div>

          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <Button variant="leaf" icon={MessageCircle} size="lg" className="mt-5 w-full">
                Confirmer sur WhatsApp
              </Button>
            </a>
          ) : null}

          {submittedOrder.trackingCode ? (
            <Button
              variant="outline"
              icon={PackageSearch}
              size="lg"
              onClick={() =>
                navigate(
                  `/track?code=${encodeURIComponent(submittedOrder.trackingCode)}`
                )
              }
              className="mt-3 w-full"
            >
              Suivre ma commande
            </Button>
          ) : null}

          <Button
            variant="outline"
            icon={Home}
            onClick={handleNewOrder}
            className="mt-3 w-full"
          >
            Nouvelle commande
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
