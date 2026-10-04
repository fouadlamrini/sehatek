import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

import * as productApi from "../api/productApi";
import * as packApi from "../api/packApi";

import Header from "../components/Header";
import Slide from "../components/Slide";
import Faq from "../components/Faq";
import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import ProductGrid from "../components/products/ProductGrid";
import PackSection from "../components/packs/PackSection";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ImageLightbox from "../components/ui/ImageLightbox";

import { useOrder } from "../context/OrderContext";
import { useCartPricing } from "../hooks/useCartPricing";
import { getErrorMessage } from "../utils/error";
import { computeOrderTotals } from "../utils/pricing";
import { formatCurrency } from "../utils/formatters";
import { buildProductDayCards } from "../utils/catalog";

const Products = () => {
  const navigate = useNavigate();
  const {
    items,
    itemsCount,
    distinctProductIds,
    addItem,
    removeItem,
    setQuantity,
    setNote,
    clearItems,
  } = useOrder();

  const [products, setProducts] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [stepError, setStepError] = useState("");

  const { pricing, loading: pricingLoading } = useCartPricing(distinctProductIds);

  const cards = useMemo(() => buildProductDayCards(products), [products]);

  const selectedKeys = useMemo(
    () => new Set(items.map((item) => item.key)),
    [items]
  );

  const allSelected =
    cards.length > 0 && cards.every((card) => selectedKeys.has(card.key));

  const getRemainingStock = (product) => {
    const inCart = items
      .filter((item) => item.productId === product._id)
      .reduce((sum, item) => sum + item.quantity, 0);

    return Number(product.stock) - inCart;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productsRes, packsRes] = await Promise.all([
        productApi.getProducts(),
        packApi.getPacks(),
      ]);

      setProducts(productsRes.data);
      setPacks(packsRes.data);
    } catch (err) {
      setError(
        getErrorMessage(err, "تعذر تحميل القائمة. المرجو إعادة المحاولة.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = (product, mealDay) => {
    const key = `${product._id}__${mealDay}`;

    if (selectedKeys.has(key)) {
      removeItem(key);
      setStepError("");
      return;
    }

    if (getRemainingStock(product) >= 1) {
      addItem(product, mealDay);
      setStepError("");
    } else {
      setStepError(`الكمية المتوفرة من «${product.name}» غير كافية.`);
    }
  };

  const handleAddPack = (pack) => {
    const blocked = [];

    for (const product of pack.products ?? []) {
      const day = product.mealDays?.[0];

      if (day && getRemainingStock(product) >= 1) {
        addItem(product, day);
      } else if (day) {
        blocked.push(product.name);
      }
    }

    const eligible = (pack.products ?? []).filter(
      (product) => product.mealDays?.[0]
    );

    setStepError(
      blocked.length > 0
        ? `الكمية غير كافية لـ: ${[...new Set(blocked)].join("، ")}.${
            blocked.length < eligible.length
              ? " تم إضافة باقي أطباق الباقة."
              : ""
          }`
        : ""
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      clearItems();
      setStepError("");
      return;
    }

    const blocked = [];

    for (const card of cards) {
      if (!selectedKeys.has(card.key)) {
        if (getRemainingStock(card.product) >= 1) {
          addItem(card.product, card.mealDay);
        } else {
          blocked.push(card.product.name);
        }
      }
    }

    setStepError(
      blocked.length > 0
        ? `الكمية غير كافية لـ: ${[...new Set(blocked)].join("، ")}.`
        : ""
    );
  };

  const totals = pricing ? computeOrderTotals(pricing, items) : null;

  const handleNext = () => {
    if (items.length === 0) {
      setStepError("المرجو اختيار طبق واحد على الأقل قبل المتابعة.");
      return;
    }

    navigate("/informations");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteHeader itemsCount={itemsCount} />

      {/* 1. Navbar + hero (dark green) */}

      <Header />

      {/* 2. Social proof — customer photos, up top to build trust */}

      <Slide />

      <div className="flex-1">
        {loading ? (
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-16">
            <Spinner />
            <p className="text-sm text-gray-400">جارٍ تحميل القائمة...</p>
          </div>
        ) : error ? (
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <AlertTriangle className="h-7 w-7 text-red-500" />
            <p className="text-sm font-medium text-red-600">{error}</p>
            <Button variant="outline" icon={RefreshCw} onClick={loadData}>
              إعادة المحاولة
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto max-w-6xl rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
            لا توجد أطباق متوفرة حالياً.
          </div>
        ) : (
          <>
            {/* 3. Packs */}

            <section className="w-full bg-cream py-12">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <PackSection
                  packs={packs}
                  onAdd={handleAddPack}
                  onImageClick={(src, alt) => setLightbox({ src, alt })}
                />
              </div>
            </section>

            {/* 4. A la carte — back to cream, so the bands alternate */}

            <section
              id="menu"
              className="w-full scroll-mt-24 bg-cream py-14"
            >
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="text-center">
                  <p
                    dir="rtl"
                    className="text-xs font-extrabold uppercase tracking-[0.3em] text-primary"
                  >
                    الأسبوع الحالي
                  </p>

                  <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-forest sm:text-5xl">
                    قائمة الأسبوع
                  </h2>

                  <p className="mt-3 text-sm text-gray-600 sm:text-base">
                    كوّن وجباتك المنزلية، على إيقاعك.
                  </p>
                </div>

                <div className="mt-12 flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">
                    اختار أطباقك
                  </h3>

                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      style={{ accentColor: "#E58730" }}
                      className="h-5 w-5 cursor-pointer rounded"
                    />
                    <span>اختر الكل</span>
                  </label>
                </div>

                <div className="mt-6">
                  <ProductGrid
                    products={products}
                    items={items}
                    onToggle={handleToggle}
                    onQuantityChange={setQuantity}
                    onNoteChange={setNote}
                    onImageClick={(src, alt) => setLightbox({ src, alt })}
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {/* 5. Order summary — in the flow, right under the dishes */}

        <div className="bg-cream px-4 py-10 sm:px-6">
          {stepError ? (
            <p className="mx-auto mb-3 max-w-5xl rounded-xl bg-red-600/90 px-4 py-2.5 text-sm font-semibold text-white">
              {stepError}
            </p>
          ) : null}

          <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-3xl bg-forest-deep px-6 py-7 shadow-lg ring-1 ring-white/10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="lg:min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-primary">
                اختياراتك
              </p>

              <p className="mt-1 font-serif text-xl font-semibold text-white sm:text-2xl">
                {itemsCount} وجبة مختارة
              </p>

              <p className="mt-0.5 text-[11px] text-white/50">
                خصم الباقات والعروض يُطبَّق تلقائياً.
              </p>
            </div>

            <div className="lg:text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-primary">
                المجموع
              </p>

              <p className="mt-1 font-serif text-2xl font-semibold text-white sm:text-3xl">
                {pricingLoading && !totals
                  ? "..."
                  : formatCurrency(totals?.totalPrice ?? 0)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-extrabold text-white shadow-lg transition duration-200 hover:bg-primary-dark"
            >
              متابعة
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 6. FAQ */}

        <Faq />
      </div>

      {/* 7. Footer */}

      <SiteFooter />

      <ImageLightbox
        src={lightbox?.src}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
};

export default Products;