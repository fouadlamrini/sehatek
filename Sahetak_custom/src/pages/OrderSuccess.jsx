import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Home, MessageCircle, PackageSearch } from "lucide-react";

import Button from "../components/ui/Button";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteHeader itemsCount={0} />

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pt-10">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/10">
            <CheckCircle2 className="h-9 w-9 text-leaf" />
          </div>

          <h1 dir="rtl" className="mt-4 text-2xl font-extrabold text-forest">
            تم إرسال الطلب ديالك!
          </h1>

          <p dir="rtl" className="mt-2 text-sm text-gray-500">
            توصلنا بالطلب ديالك
            {reference ? (
              <span className="font-bold text-primary"> {reference}</span>
            ) : null}
            .ريقنا غادي يتواصلو معاك لتأكيد الطلب.
          </p>

          {reference ? (
            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary-soft/60 p-4">
              <p dir="rtl" className="text-xs font-semibold uppercase tracking-wide text-primary">
                كود التتبع
              </p>

              <p className="mt-1 select-all text-lg font-extrabold text-forest">
                {reference}
              </p>

              <p dir="rtl" className="mt-1 text-xs text-gray-500">
                احتفظ بهذا الكود باش تتبع الطلب ديالك.
              </p>
            </div>
          ) : null}

          <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-left text-sm">
            <div className="flex justify-between text-gray-500">
              <span>الزبون</span>
              <span className="font-semibold text-gray-800">
                {submittedOrder.customer?.name ?? customer.name}
              </span>
            </div>

            <div className="mt-2 flex justify-between text-gray-500">
              <span>التوصيل</span>
              <span className="font-semibold text-gray-800">
                {submittedOrder.delivery?.quartier ?? delivery.quartier}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-base font-extrabold text-forest">
              <span>المجموع</span>
              <span>{formatCurrency(submittedOrder.totalPrice)}</span>
            </div>
          </div>

          {whatsappUrl ? (
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <Button variant="leaf" icon={MessageCircle} size="lg" className="mt-5 w-full">
                تأكيد عبر واتساب
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
              تتبع الطلب ديالي
            </Button>
          ) : null}

          <Button
            variant="outline"
            icon={Home}
            onClick={handleNewOrder}
            className="mt-3 w-full"
          >
            طلب جديد
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default OrderSuccess;
