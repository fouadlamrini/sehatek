import { ArrowLeft } from "lucide-react";

import SiteHeader from "./SiteHeader";
import OrderProgress from "../order/OrderProgress";
import { useOrder } from "../../context/OrderContext";

const StepLayout = ({ step = 1, onBack, title, subtitle, children }) => {
  const { itemsCount } = useOrder();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <SiteHeader itemsCount={itemsCount} />

      <OrderProgress current={step} onNavigate={onBack} />

      <main className="mx-auto max-w-2xl px-4 pt-6">
        <div className="mb-5 flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={() => onBack(step - 1)}
              aria-label="Retour"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}

          <div>
            <h1 className="text-xl font-extrabold text-forest">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-gray-400">{subtitle}</p>
            ) : null}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

export default StepLayout;
