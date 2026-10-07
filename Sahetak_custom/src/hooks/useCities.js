import { useEffect, useState } from "react";

import * as cityApi from "../api/cityApi";
import { getErrorMessage } from "../utils/error";

// Delivery cities managed by the admin. Returns { cities, loading, error }.
// `cities` is an empty array while loading or on failure, so callers can render
// the dropdown straight away and show `error` separately.
export const useCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    cityApi
      .getCities()
      .then((response) => {
        if (active) {
          setCities(response?.data ?? []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "تعذر تحميل المدن."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { cities, loading, error };
};

export default useCities;
