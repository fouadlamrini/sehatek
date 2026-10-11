import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Home, MessageCircle, PackageSearch } from "lucide-react";

import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";

import { useOrder } from "../context/OrderContext";
import { formatCurrency } from "../utils/formatters";
import {
  getOrderReference,
  buildOrderMessage,
  buildWhatsappUrl,
} from "../utils/whatsapp";

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
    buildOrderMessage(items, customer, delivery, submittedOrder),
  );

  const handleNewOrder = () => {
    clearOrder();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <SiteHeader itemsCount={0} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-14 pt-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-lg ring-1 ring-gray-100 sm:p-8">
          <div className="flex justify-center">
            <div className="animate-scale-in flex h-20 w-20 items-center justify-center rounded-full bg-leaf/10">
              <CheckCircle2 className="h-10 w-10 text-leaf" />
            </div>
          </div>

          <h1
            dir="rtl"
            className="mt-5 text-center font-serif text-3xl font-semibold text-forest"
          >
            تم إرسال الطلب ديالك!
          </h1>

          <p dir="rtl" className="mt-2 text-center text-sm text-gray-500">
            توصلنا بالطلب ديالك
            {reference ? (
              <span className="font-bold text-primary"> {reference}</span>
            ) : null}
            . الفريق ديالنا غادي يتواصلو معاك لتأكيد الطلب.
          </p>

          {reference ? (
            <div className="mt-5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary-soft/50 p-5 text-center">
              <p
                dir="rtl"
                className="text-xs font-bold uppercase tracking-widest text-primary"
              >
                كود التتبع
              </p>
              <p
                dir="ltr"
                className="mt-1 select-all font-mono text-xl font-extrabold tracking-widest text-forest"
              >
                {reference}
              </p>
              <p dir="rtl" className="mt-1 text-xs text-gray-500">
                احتفظ بهذا الكود باش تتبع الطلب ديالك.
              </p>
            </div>
          ) : null}

          <div className="mt-5 space-y-3 rounded-2xl bg-cream p-5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>الزبون</span>
              <span className="font-semibold text-gray-800">
                {submittedOrder.customer?.name ?? customer.name}
              </span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>التوصيل</span>
              <span className="font-semibold text-gray-800">
                {submittedOrder.delivery?.quartier ?? delivery.quartier}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-lg font-black text-forest">
              <span>المجموع</span>
              <span>{formatCurrency(submittedOrder.totalPrice)}</span>
            </div>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-leaf text-base font-bold text-white shadow-lg shadow-leaf/30 transition hover:bg-forest"
            >
              <MessageCircle className="h-5 w-5" />
              تأكيد عبر واتساب
            </a>
          ) : null}

          {submittedOrder.trackingCode ? (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/track?code=${encodeURIComponent(submittedOrder.trackingCode)}`,
                )
              }
              className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white text-base font-bold text-forest transition hover:border-primary hover:text-primary"
            >
              <PackageSearch className="h-5 w-5" />
              تتبع الطلب ديالي
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleNewOrder}
            className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white text-base font-bold text-forest transition hover:border-primary hover:text-primary"
          >
            <Home className="h-5 w-5" />
            طلب جديد
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default OrderSuccess;
