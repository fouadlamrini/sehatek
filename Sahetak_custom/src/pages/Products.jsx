import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  Clock,
  Leaf,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  UserCheck,
} from "lucide-react";

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

// -----------------------------------------------------------------------------
// New section: "لماذا تختارنا؟" — value props with soft icon tiles
// -----------------------------------------------------------------------------
const WHY_US = [
  {
    icon: Leaf,
    title: "مكونات طازجة",
    text: "كنشريو كل صباح من السوق باش يكون كلشي طازج فالمائدة ديالك.",
  },
  {
    icon: ShieldCheck,
    title: "نظافة مضمونة",
    text: "مطبخ نظيف ومعقم، والسلامة الغذائية أولوية عندنا.",
  },
  {
    icon: Truck,
    title: "توصيل مجاني",
    text: "كيوصل لباب دارك فنفس اليوم، بلا ما تتحرك.",
  },
  {
    icon: Clock,
    title: "توصيل في الوقت",
    text: "الطلب كيتوصل بين 13:30 و 15:00، كنحترموا وقتك.",
  },
];

const WhyUs = () => (
  <section className="w-full bg-white py-14 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="text-center">
        <p dir="rtl" className="text-xs font-extrabold uppercase tracking-[0.3em] text-primary">
          لماذا تختارنا؟
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          تجربة مختلفة، وجبة مختلفة
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_US.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="group rounded-3xl border border-gray-100 bg-cream p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(32,65,21,0.1)]"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              <Icon className="h-7 w-7" />
            </div>
            <h3 dir="rtl" className="mt-4 text-base font-bold text-forest">
              {title}
            </h3>
            <p dir="rtl" className="mt-2 text-sm leading-relaxed text-gray-600">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// New section: "كيف تعمل خدمتنا؟" — 4-step process
// -----------------------------------------------------------------------------
const HOW_IT_WORKS = [
  {
    icon: ShoppingCart,
    step: "1",
    title: "اختر وجباتك",
    text: "تصفح قائمة الأسبوع واختر الأطباق والباقات اللي يعجبوك.",
  },
  {
    icon: ClipboardList,
    step: "2",
    title: "سجّل معلوماتك",
    text: "خلّي الاسم ورقم الهاتف وعنوان التوصيل بسرعة.",
  },
  {
    icon: UserCheck,
    step: "3",
    title: "تأكيد الطلب",
    text: "راجع الطلب ديالك وأكّد، وتوصلنا بتأكيد فالواتساب.",
  },
  {
    icon: PackageCheck,
    step: "4",
    title: "توصيل لباب الدار",
    text: "كيتوصل الطلب ديالك بين 13:30 و 15:00. بالعافية!",
  },
];

const HowItWorks = () => (
  <section className="w-full bg-forest-deep py-14 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="text-center">
        <p dir="rtl" className="text-xs font-extrabold uppercase tracking-[0.3em] text-primary">
          كيف  نعمل؟
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
          من القائمة لباب دارك ف 4 خطوات
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map(({ icon: Icon, step, title, text }, index) => (
          <div key={title} className="relative text-center">
            {index < HOW_IT_WORKS.length - 1 ? (
              <span className="absolute left-0 top-8 hidden h-px w-full translate-x-1/2 bg-white/15 lg:block" />
            ) : null}

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Icon className="h-8 w-8" />
              <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white">
                {step}
              </span>
            </div>

            <h3 dir="rtl" className="mt-4 text-base font-bold text-white">
              {title}
            </h3>
            <p dir="rtl" className="mt-2 text-sm leading-relaxed text-white/60">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// New section: "تقييمات العملاء" — testimonial cards
// -----------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    name: "خديجة م.",
    city: "الدار البيضاء",
    text: "الخدمة ممتازة، الطلب كيتوصل فالوقت والطعام طازج. تجربة زوينة، نصح بيها.",
    rating: 5,
  },
  {
    name: "يوسف ب.",
    city: "الرباط",
    text: "الباقات عندهم متنوعة والسعر معقول. التوصيل مجاني وهذا شي زوين بزاف.",
    rating: 5,
  },
  {
    name: "سارة أ.",
    city: "مراكش",
    text: "كل أسبوع كيتبدلو القمة، كيعطيو قيمة مقابل الفلوس. شكرا صحتك!",
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="w-full bg-cream py-14 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="text-center">
        <p dir="rtl" className="text-xs font-extrabold uppercase tracking-[0.3em] text-primary">
          آراء الزبناء
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-forest sm:text-4xl">
          زبنائنا كايتقالو
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_rgba(32,65,21,0.06)]"
          >
            <div className="flex gap-1 text-primary">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote dir="rtl" className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
              "{t.text}"
            </blockquote>
            <figcaption className="mt-4 border-t border-gray-100 pt-4">
              <p className="font-bold text-forest">{t.name}</p>
              <p className="text-xs text-gray-400">{t.city}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

// -----------------------------------------------------------------------------
// Updated home page: reordered sections + the three new blocks above
// -----------------------------------------------------------------------------
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
    <div className="flex min-h-screen flex-col bg-cream">
      <SiteHeader itemsCount={itemsCount} />

      <Header />

      <Slide />

      <WhyUs />

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
            <section className="w-full bg-white py-12">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <PackSection
                  packs={packs}
                  onAdd={handleAddPack}
                  onImageClick={(src, alt) => setLightbox({ src, alt })}
                />
              </div>
            </section>

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

        <div className="bg-white px-4 py-10 sm:px-6">
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
              className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
            >
              متابعة
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>

        <HowItWorks />

        <Testimonials />
      </div>

      <Faq />

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
