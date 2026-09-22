import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";

import * as productApi from "../api/productApi";
import * as packApi from "../api/packApi";

import Header from "../components/Header";
import Slide from "../components/Slide";
import SiteHeader from "../components/layout/SiteHeader";
import OrderProgress from "../components/order/OrderProgress";
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
        getErrorMessage(err, "Impossible de charger le menu. Veuillez réessayer.")
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
    } else {
      addItem(product, mealDay);
    }

    setStepError("");
  };

  const handleAddPack = (pack) => {
    for (const product of pack.products ?? []) {
      const day = product.mealDays?.[0];

      if (day) {
        addItem(product, day);
      }
    }

    setStepError("");
  };

  const handleSelectAll = () => {
    if (allSelected) {
      clearItems();
      return;
    }

    for (const card of cards) {
      if (!selectedKeys.has(card.key)) {
        addItem(card.product, card.mealDay);
      }
    }

    setStepError("");
  };

  const totals = pricing ? computeOrderTotals(pricing, items) : null;

  const handleNext = () => {
    if (items.length === 0) {
      setStepError("Veuillez sélectionner au moins un plat avant de continuer.");
      return;
    }

    navigate("/informations");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <SiteHeader itemsCount={itemsCount} />

      <OrderProgress current={0} />

      <Header />

      <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
        <div className="flex justify-center">
          <h2 className="rounded-xl border-2 border-leaf bg-white px-6 py-3 text-center text-2xl font-bold text-forest shadow-md sm:px-8 sm:py-4 sm:text-3xl">
            Menu de la Semaine
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner />
            <p className="text-sm text-gray-400">Chargement du menu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <AlertTriangle className="h-7 w-7 text-red-500" />
            <p className="text-sm font-medium text-red-600">{error}</p>
            <Button variant="outline" icon={RefreshCw} onClick={loadData}>
              Réessayer
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
            Aucun produit disponible pour le moment.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-end rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <label className="flex cursor-pointer items-center gap-2 font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  style={{ accentColor: "#E58730" }}
                  className="h-5 w-5 cursor-pointer rounded"
                />
                <span>Sélectionner tout</span>
              </label>
            </div>

            <ProductGrid
              products={products}
              items={items}
              onToggle={handleToggle}
              onQuantityChange={setQuantity}
              onNoteChange={setNote}
              onImageClick={(src, alt) => setLightbox({ src, alt })}
            />

            <PackSection
              packs={packs}
              onAdd={handleAddPack}
              onImageClick={(src, alt) => setLightbox({ src, alt })}
            />

            <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-md">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total:</span>
                  <span className="font-semibold">
                    {formatCurrency(totals?.subtotal ?? 0)}
                  </span>
                </div>

                {totals && totals.discountAmount > 0 ? (
                  <div className="flex justify-between font-bold text-leaf">
                    <span>Remise (packs / promos):</span>
                    <span>- {formatCurrency(totals.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between border-t pt-2 text-lg font-black text-forest">
                  <span>Total:</span>
                  <span>
                    {pricingLoading ? "..." : formatCurrency(totals?.totalPrice ?? 0)}
                  </span>
                </div>
              </div>

              {stepError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {stepError}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleNext}
                className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-leaf py-3.5 text-base font-bold text-white shadow-lg transition duration-200 hover:bg-forest"
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>

      <Slide />

      <ImageLightbox
        src={lightbox?.src}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
};

export default Products;