import { useEffect, useState } from "react";

import * as settingsApi from "../api/settingsApi";

// Public site branding (profile picture + banner picture) managed from the
// admin dashboard. Returns null while loading or if the request fails so the
// caller can fall back to the packaged default assets.
export const useSiteSettings = () => {
  const [settings, setSettings] = useState(null);

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
      });

    return () => {
      active = false;
    };
  }, []);

  return settings;
};

export default useSiteSettings;