import { useEffect, useState } from "react";

import * as pricingApi from "../api/pricingApi";
import { getErrorMessage } from "../utils/error";

// Fetches the backend-authoritative price preview for a set of unique products.
export const useCartPricing = (distinctProductIds) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const idsKey = distinctProductIds.join(",");

  useEffect(() => {
    let active = true;

    if (!idsKey) {
      setPricing(null);
      setLoading(false);
      setError("");
      return undefined;
    }

    setLoading(true);
    setError("");

    // Small debounce so rapid quantity/selection changes don't spam the API.
    const timer = setTimeout(async () => {
      try {
        const { data } = await pricingApi.calculatePrice(idsKey.split(","));

        if (active) {
          setPricing(data);
        }
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err, "Impossible de calculer le prix."));
          setPricing(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [idsKey]);

  return { pricing, loading, error };
};
