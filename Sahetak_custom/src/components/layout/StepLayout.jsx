import { ArrowLeft } from "lucide-react";

import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import OrderProgress from "../order/OrderProgress";
import { useOrder } from "../../context/OrderContext";

const StepLayout = ({ step = 1, onBack, title, subtitle, children }) => {
  const { itemsCount } = useOrder();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteHeader itemsCount={itemsCount} />

      <div className="mx-auto w-full max-w-5xl px-4 pt-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <OrderProgress current={step} onNavigate={onBack} />
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6">
        <div className="mb-5 flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={() => onBack(step - 1)}
              aria-label="رجوع"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}

          <div>
            <h1 dir="rtl" className="text-xl font-extrabold text-forest">
              {title}
            </h1>

            {subtitle ? (
              <p dir="rtl" className="text-sm text-gray-400">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {children}
      </main>

      <SiteFooter />
    </div>
  );
};

export default StepLayout;
