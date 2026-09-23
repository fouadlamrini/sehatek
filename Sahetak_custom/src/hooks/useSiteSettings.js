import { useEffect, useState } from "react";

import * as settingsApi from "../api/settingsApi";

// Public site branding (profile picture + banner picture) managed from the
// admin dashboard. Returns { settings, loading }.
// - settings: null while loading or if the request fails, otherwise the API
//   payload (banner/profile URLs may still be empty).
// - loading: true on the first render, false once the request settles
//   (success or failure). Callers should render skeletons while loading and
//   never show the bundled fallback assets before the fetch completes.
export const useSiteSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    settingsApi
      .getPublicSettings()
      .then((response) => {
        if (active) {
          setSettings(response?.data ?? null);
        }
      })
      .catch(() => {
        // Keep the bundled fallback assets.
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

  return { settings, loading };
};

export default useSiteSettings;