import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  MapPin,
  PackageSearch,
  Pencil,
  RotateCcw,
  XCircle,
} from "lucide-react";

import * as orderApi from "../api/orderApi";

import SiteHeader from "../components/layout/SiteHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";

import {
  LOCATION_TYPES,
  LOCATION_TYPE_LABELS,
  ORDER_STATUS_LABELS,
  TRACK_STEPS,
} from "../constants";
import { formatCurrency } from "../utils/formatters";
import { getErrorMessage } from "../utils/error";
import { cn } from "../utils/cn";

const STATUS_BADGE_COLOR = {
  pending: "soft",
  confirmed: "primary",
  preparing: "forest",
  delivering: "leaf",
  delivered: "leaf",
  cancelled: "red",
};

const emptyFields = (order) => ({
  customerName: order.customer?.name ?? "",
  newPhone: order.customer?.phone ?? "",
  city: order.delivery?.city ?? "",
  quartier: order.delivery?.quartier ?? "",
  locationType: order.delivery?.locationType ?? "home",
  receiverName: order.delivery?.receiverName ?? "",
});

const TrackOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    trackingCode: searchParams.get("code") || "",
    phone: "",
  });
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [order, setOrder] = useState(null);
  // Short-lived capability for update/cancel, kept only in memory (never in
  // the URL and never persisted) and refreshed after every successful track.
  const [trackToken, setTrackToken] = useState(null);
  const [actionError, setActionError] = useState("");

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(emptyFields(order || {}));
  const [saving, setSaving] = useState(false);

  const [cancelArmed, setCancelArmed] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSearchError("");
  };

  const handleSearch = useCallback(async () => {
    if (!form.trackingCode.trim() || !form.phone.trim()) {
      setSearchError("Le code de suivi et le téléphone sont requis.");
      return;
    }

    setSearching(true);
    setSearchError("");
    setActionError("");

    try {
      const { data, trackToken: nextToken } = await orderApi.trackOrder(
        form.trackingCode.trim(),
        form.phone.trim()
      );

      setOrder(data);
      setTrackToken(nextToken);
      setEditForm(emptyFields(data));
      setCancelArmed(false);
      setEditing(false);
    } catch (err) {
      setOrder(null);
      setTrackToken(null);
      setSearchError(
        getErrorMessage(err, "Commande introuvable. Vérifiez vos informations.")
      );
    } finally {
      setSearching(false);
    }
  }, [form]);

  const handleNewSearch = () => {
    setOrder(null);
    setTrackToken(null);
    setEditing(false);
    setCancelArmed(false);
    setActionError("");
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditForm(emptyFields(order));
    setEditing(false);
  };

  const handleSave = async () => {
    if (!editForm.city.trim() || !editForm.quartier.trim()) {
      setActionError("La ville et le quartier sont requis.");
      return;
    }

    setSaving(true);
    setActionError("");

    try {
      const { data, trackToken: nextToken } = await orderApi.updateOrder({
        trackingCode: order.trackingCode,
        trackToken,
        // Identity: current stored phone (a new phone is provided via newPhone)
        phone: order.customer.phone,
        ...(editForm.customerName.trim()
          ? { customerName: editForm.customerName.trim() }
          : {}),
        ...(editForm.newPhone.trim() ? { newPhone: editForm.newPhone.trim() } : {}),
        delivery: {
          city: editForm.city.trim(),
          quartier: editForm.quartier.trim(),
          locationType: editForm.locationType,
          receiverName: editForm.receiverName.trim(),
        },
      });

      setOrder(data);
      setTrackToken(nextToken);
      setEditing(false);
    } catch (err) {
      setActionError(
        getErrorMessage(err, "Échec de la modification. Réessayez.")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelArmed) {
      setCancelArmed(true);
      setActionError("");
      return;
    }

    setCancelling(true);
    setActionError("");

    try {
      const { data } = await orderApi.cancelOrder({
        trackingCode: order.trackingCode,
        phone: order.customer.phone,
        trackToken,
      });

      setOrder(data);
      setCancelArmed(false);
    } catch (err) {
      setActionError(
        getErrorMessage(err, "Échec de l'annulation. Réessayez.")
      );
    } finally {
      setCancelling(false);
    }
  };

  const statusIndex = order
    ? TRACK_STEPS.findIndex((step) => step.key === order.status)
    : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <SiteHeader itemsCount={0} />

      <main className="mx-auto max-w-xl px-4 pt-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au menu
        </button>

        {!order ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <PackageSearch className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-forest">
                  Suivre ma commande
                </h1>
                <p className="text-sm text-gray-500">
                  Entrez votre code de suivi et votre téléphone
                </p>
              </div>
            </div>

            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
              }}
            >
              <Input
                label="Code de suivi"
                name="trackingCode"
                value={form.trackingCode}
                onChange={handleChange}
                placeholder="Ex: STK-1A2B3C4D5"
                autoCapitalize="characters"
              />

              <Input
                label="Téléphone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="0612345678"
                autoComplete="tel"
              />

              {searchError ? (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{searchError}</span>
                </div>
              ) : null}

              <Button
                type="submit"
                loading={searching}
                icon={PackageSearch}
                className="w-full"
              >
                Retrouver ma commande
              </Button>
            </form>
          </div>
        ) : searching ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Commande
                  </p>
                  <p className="text-lg font-extrabold text-primary">
                    {order.trackingCode}
                  </p>
                </div>

                <Badge color={STATUS_BADGE_COLOR[order.status] ?? "primary"}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </Badge>
              </div>

              {isCancelled ? (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Cette commande a été annulée. Les produits ont été remis en
                    stock.
                  </span>
                </div>
              ) : (
                <ol className="mt-6 flex items-start">
                  {TRACK_STEPS.map((step, index) => {
                    const done = index <= statusIndex;

                    return (
                      <li key={step.key} className="flex flex-1 items-start last:flex-none">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition",
                              done
                                ? "border-primary bg-primary text-white"
                                : "border-gray-300 bg-white text-gray-400"
                            )}
                          >
                            {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                          </span>
                          <span
                            className={cn(
                              "mt-1.5 whitespace-nowrap text-[10px] font-semibold",
                              done ? "text-primary" : "text-gray-400"
                            )}
                          >
                            {step.label}
                          </span>
                        </div>

                        {index < TRACK_STEPS.length - 1 ? (
                          <span
                            className={cn(
                              "mt-3.5 mx-1 h-0.5 flex-1 rounded",
                              index < statusIndex ? "bg-primary" : "bg-gray-200"
                            )}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              )}

              <p className="mt-4 text-center text-xs text-gray-400">
                Passée le{" "}
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Items */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-forest">Votre commande</h2>

              <ul className="mt-2 divide-y divide-gray-100">
                {order.items.map((item) => {
                  const product = item.product ?? {};
                  const lineTotal = (item.price ?? 0) * item.quantity;

                  return (
                    <li key={`${item.product?._id ?? item.mealDay}-${item.mealDay}`} className="flex items-center gap-3 py-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-gray-800">
                          {product.name ?? "Produit"}
                        </p>
                        <p className="text-xs font-semibold text-primary">{item.mealDay}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>

                      <span className="font-extrabold text-forest">
                        {formatCurrency(lineTotal)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Sous-total</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>

                {order.discount > 0 ? (
                  <div className="flex justify-between text-gray-500">
                    <span>Remise</span>
                    <span className="text-leaf">-{formatCurrency(order.discount)}</span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-base font-extrabold text-forest">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Delivery / customer */}
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-forest">Livraison</h2>

              <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {LOCATION_TYPE_LABELS[order.delivery?.locationType] ?? order.delivery?.locationType}
                  </p>
                  <p>
                    {order.delivery?.quartier}, {order.delivery?.city}
                  </p>
                  {order.delivery?.receiverName ? (
                    <p className="text-gray-400">Reçu par : {order.delivery.receiverName}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-600">
                <p>
                  <span className="text-gray-400">Client : </span>
                  <span className="font-semibold text-gray-800">{order.customer?.name}</span>
                </p>
                <p>
                  <span className="text-gray-400">Téléphone : </span>
                  <span className="font-semibold text-gray-800">{order.customer?.phone}</span>
                </p>
              </div>
            </div>

            {actionError ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            ) : null}

            {order.status === "pending" ? (
              <>
                {editing ? (
                  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-forest">
                      Modifier ma commande
                    </h2>

                    <div className="mt-4 space-y-4">
                      <Input
                        label="Nom"
                        name="customerName"
                        value={editForm.customerName}
                        onChange={handleEditChange}
                      />

                      <Input
                        label="Nouveau téléphone"
                        name="newPhone"
                        type="tel"
                        value={editForm.newPhone}
                        onChange={handleEditChange}
                        placeholder="0699998877"
                      />

                      <Input
                        label="Ville"
                        name="city"
                        value={editForm.city}
                        onChange={handleEditChange}
                        error={!editForm.city.trim() ? "La ville est requise" : undefined}
                      />

                      <Input
                        label="Quartier"
                        name="quartier"
                        value={editForm.quartier}
                        onChange={handleEditChange}
                        error={!editForm.quartier.trim() ? "Le quartier est requis" : undefined}
                      />

                      <div>
                        <label
                          htmlFor="trackLocationType"
                          className="mb-1.5 block text-sm font-semibold text-gray-700"
                        >
                          Type de livraison
                        </label>
                        <select
                          id="trackLocationType"
                          name="locationType"
                          value={editForm.locationType}
                          onChange={handleEditChange}
                          className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                          {LOCATION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.emoji} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="Reçu par"
                        name="receiverName"
                        value={editForm.receiverName}
                        onChange={handleEditChange}
                        placeholder="(optionnel)"
                      />
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleEditCancel}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                      <Button
                        variant="leaf"
                        icon={Check}
                        loading={saving}
                        onClick={handleSave}
                        className="flex-1"
                      >
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      icon={Pencil}
                      onClick={() => setEditing(true)}
                      className="w-full"
                    >
                      Modifier la livraison
                    </Button>

                    <Button
                      variant="danger"
                      icon={cancelArmed ? RotateCcw : XCircle}
                      loading={cancelling}
                      onClick={handleCancel}
                      className="w-full"
                    >
                      {cancelArmed
                        ? "Confirmer l'annulation"
                        : "Annuler la commande"}
                    </Button>

                    {cancelArmed ? (
                      <p className="text-center text-xs text-gray-400">
                        Cliquez à nouveau pour confirmer l&apos;annulation.
                      </p>
                    ) : null}
                  </div>
                )}
              </>
            ) : null}

            <button
              type="button"
              onClick={handleNewSearch}
              className="w-full text-center text-sm font-semibold text-gray-500 transition hover:text-primary"
            >
              Rechercher une autre commande
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackOrder;