import { useEffect, useState } from "react";

import * as settingsApi from "../api/settingsApi";

// SiteHeader and Header are siblings that both mount on the same page, so
// without this cache the app fires two identical /settings/public requests on
// every visit to the home page. Cached for the lifetime of the tab.
let cache = null;

// Public site branding (profile picture + banner picture) managed from the
// admin dashboard. Returns { settings, loading }.
// - settings: null while loading or if the request fails, otherwise the API
//   payload (banner/profile URLs may still be empty).
// - loading: true on the first render, false once the request settles
//   (success or failure). Callers should render skeletons while loading and
//   never show the bundled fallback assets before the fetch completes.
export const useSiteSettings = () => {
  const [settings, setSettings] = useState(cache?.data ?? null);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    if (cache) {
      return undefined;
    }

    let active = true;

    settingsApi
      .getPublicSettings()
      .then((response) => {
        cache = { data: response?.data ?? null };

        if (active) {
          setSettings(cache.data);
        }
      })
      .catch(() => {
        // Keep the bundled fallback assets.
        cache = { data: null };
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