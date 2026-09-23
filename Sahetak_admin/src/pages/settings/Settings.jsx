import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";

import * as settingsApi from "../../api/settingsApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/error";
import { cn } from "../../utils/cn";

const SiteImageCard = ({
  title,
  description,
  shape = "wide",
  currentUrl,
  fieldName,
  onUpload,
}) => {
  const toast = useToast();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const displayed = preview ?? currentUrl;

  const clearSelection = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSelect = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) {
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const handleSave = async () => {
    if (!file) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onUpload(fieldName, file);

      toast.success(`${title} updated successfully`);
      clearSelection();
    } catch (err) {
      const message = getErrorMessage(err, "Failed to upload image");

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-sm font-bold text-forest">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>

      <div className="mt-4">
        {displayed ? (
          <img
            src={displayed}
            alt={title}
            className={cn(
              "object-cover shadow-sm",
              shape === "round"
                ? "h-24 w-24 rounded-full"
                : "h-44 w-full rounded-xl"
            )}
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center bg-gray-100 text-gray-300",
              shape === "round" ? "h-24 w-24 rounded-full" : "h-44 w-full rounded-xl"
            )}
          >
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleSelect}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            icon={ImageIcon}
          >
            {file ? "Change image" : "Choose image"}
          </Button>

          {file ? (
            <>
              <Button loading={saving} onClick={handleSave} icon={Upload}>
                Save
              </Button>

              <Button
                variant="ghost"
                icon={X}
                onClick={clearSelection}
                disabled={saving}
              >
                Cancel
              </Button>
            </>
          ) : currentUrl ? (
            <span className="text-xs text-gray-400">Current image is shown above.</span>
          ) : null}
        </div>

        {error ? (
          <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
        ) : null}
      </div>
    </Card>
  );
};

const Settings = () => {
  const [settings, setSettings] = useState({
    profileImage: null,
    bannerImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    settingsApi
      .getSettings()
      .then((response) => {
        if (active) {
          setSettings(response.data ?? {});
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError(getErrorMessage(error, "Failed to load settings"));
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

  const handleUpload = async (fieldName, file) => {
    const formData = new FormData();

    formData.append(fieldName, file);

    const { data } = await settingsApi.updateSettings(formData);

    setSettings(data);

    return fieldName === "profileImage"
      ? data.profileImage?.url
      : data.bannerImage?.url;
  };

  return (
    <>
      <PageHeader
        title="Site settings"
        subtitle="Manage the profile picture and banner shown on the public site"
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {loadError}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SiteImageCard
            title="Profile picture"
            description="The logo/avatar displayed at the top of the customer site."
            shape="round"
            fieldName="profileImage"
            currentUrl={settings.profileImage?.url}
            onUpload={handleUpload}
          />

          <SiteImageCard
            title="Banner picture"
            description="The large banner shown behind the site logo."
            shape="wide"
            fieldName="bannerImage"
            currentUrl={settings.bannerImage?.url}
            onUpload={handleUpload}
          />
        </div>
      )}
    </>
  );
};

export default Settings;