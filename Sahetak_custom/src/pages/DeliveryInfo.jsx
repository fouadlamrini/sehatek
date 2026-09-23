import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Map, MapPin, SpellCheck } from "lucide-react";

import StepLayout from "../components/layout/StepLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

import { useOrder } from "../context/OrderContext";
import { LOCATION_TYPES, STEPS } from "../constants";
import { validateDelivery } from "../utils/validation";
import { cn } from "../utils/cn";

const MapLocationPicker = lazy(() =>
  import("../components/delivery/MapLocationPicker")
);

const MODES = [
  { value: "manual", label: "Manuel", icon: SpellCheck },
  { value: "map", label: "Sur la carte", icon: Map },
];

const DeliveryInfo = () => {
  const navigate = useNavigate();
  const { items, customer, delivery, setDelivery } = useOrder();

  const [mode, setMode] = useState(
    delivery.latitude != null && delivery.longitude != null ? "map" : "manual"
  );
  const [form, setForm] = useState({
    city: delivery.city,
    quartier: delivery.quartier,
    locationType: delivery.locationType,
    receiverName: delivery.receiverName,
    latitude: delivery.latitude ?? null,
    longitude: delivery.longitude ?? null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate("/", { replace: true });
    } else if (!customer.name.trim()) {
      navigate("/informations", { replace: true });
    }
  }, [items.length, customer.name, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleMapSelect = ({ city, quartier, latitude, longitude }) => {
    setForm((current) => ({
      ...current,
      city,
      quartier,
      latitude,
      longitude,
    }));
    setErrors((current) => ({
      ...current,
      city: undefined,
      quartier: undefined,
      coordinates: undefined,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateDelivery(form, {
      requireCoordinates: mode === "map",
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setDelivery({
      city: form.city.trim(),
      quartier: form.quartier.trim(),
      locationType: form.locationType,
      receiverName: form.receiverName.trim(),
      latitude: form.latitude ?? null,
      longitude: form.longitude ?? null,
    });
    navigate("/confirmation");
  };

  return (
    <StepLayout
      step={2}
      onBack={(index) => navigate(STEPS[index]?.path ?? "/")}
      title="Livraison"
      subtitle="Où souhaitez-vous recevoir votre commande ?"
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-bold">Adresse de livraison</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {MODES.map(({ value, label, icon: Icon }) => {
            const selected = mode === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition",
                  selected
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {mode === "manual" ? (
            <>
              <Input
                label="Ville"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="Ex: Casablanca"
                autoComplete="address-level2"
              />

              <Input
                label="Quartier"
                name="quartier"
                value={form.quartier}
                onChange={handleChange}
                error={errors.quartier}
                placeholder="Ex: Maârif"
                autoComplete="address-level3"
              />
            </>
          ) : (
            <>
              <Suspense
                fallback={
                  <div className="flex h-72 items-center justify-center rounded-xl border border-gray-200">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                }
              >
                <MapLocationPicker
                  latitude={form.latitude}
                  longitude={form.longitude}
                  onSelect={handleMapSelect}
                />
              </Suspense>

              {errors.coordinates ? (
                <p className="text-xs font-medium text-red-600">
                  {errors.coordinates}
                </p>
              ) : null}

              {form.latitude != null && form.longitude != null ? (
                <p className="rounded-xl border border-primary/30 bg-primary-soft px-3 py-2 text-xs font-semibold text-primary">
                  Adresse estimée depuis la carte — vérifiez-la.
                </p>
              ) : null}

              <Input
                label="Ville"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="Ex: Casablanca"
                autoComplete="address-level2"
              />

              <Input
                label="Quartier"
                name="quartier"
                value={form.quartier}
                onChange={handleChange}
                error={errors.quartier}
                placeholder="Ex: Maârif"
                autoComplete="address-level3"
              />
            </>
          )}

          <div>
            <p className="mb-1.5 text-sm font-semibold text-gray-700">
              Type de lieu
            </p>

            <div className="grid grid-cols-2 gap-2">
              {LOCATION_TYPES.map((type) => {
                const selected = form.locationType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setForm((current) => ({
                        ...current,
                        locationType: type.value,
                      }));
                      setErrors((current) => ({
                        ...current,
                        locationType: undefined,
                      }));
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition",
                      selected
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-gray-200 bg-white text-gray-600 hover:border-primary/50"
                    )}
                  >
                    <span className="text-lg">{type.emoji}</span>
                    {type.label}
                  </button>
                );
              })}
            </div>

            {errors.locationType ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {errors.locationType}
              </p>
            ) : null}
          </div>

          <Input
            label="Nom du récepteur (optionnel)"
            name="receiverName"
            value={form.receiverName}
            onChange={handleChange}
            error={errors.receiverName}
            placeholder="Si quelqu'un d'autre reçoit la commande"
          />
        </div>

        <Button type="submit" icon={ArrowRight} className="mt-6 w-full">
          Continuer
        </Button>
      </form>
    </StepLayout>
  );
};

export default DeliveryInfo;