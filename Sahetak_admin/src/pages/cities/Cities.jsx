import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import * as cityApi from "../../api/cityApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Switch from "../../components/ui/Switch";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import CityFormModal from "../../components/cities/CityFormModal";
import {
  TableWrapper,
  THead,
  TBody,
  TR,
  TH,
  TD,
  TableState,
} from "../../components/ui/Table";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/error";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const Cities = () => {
  const toast = useToast();

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const citiesRes = await cityApi.getCities();

      setCities(citiesRes.data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load cities");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (city) => {
    setTogglingId(city._id);

    try {
      await cityApi.updateCity(city._id, { active: !city.active });

      toast.success(
        city.active
          ? "City deactivated successfully"
          : "City activated successfully"
      );

      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update city"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await cityApi.deleteCity(deleteTarget._id);
      toast.success("City deleted successfully");
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete city"));
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (city) => {
    setEditing(city);
    setFormOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Delivery cities"
        subtitle="Manage the cities customers can order from"
        actions={
          <>
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={loadData}
              disabled={loading}
            >
              Refresh
            </Button>

            <Button icon={Plus} onClick={openCreate}>
              Add city
            </Button>
          </>
        }
      />

      {loading ? (
        <TableWrapper>
          <TBody>
            <TableState colSpan={4}>Loading cities...</TableState>
          </TBody>
        </TableWrapper>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
          <p className="text-sm font-medium text-red-600">{error}</p>
          <Button variant="outline" icon={RefreshCw} onClick={loadData}>
            Try again
          </Button>
        </div>
      ) : cities.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No cities found"
          description="Add a city to make it available in the delivery dropdown on the customer site."
          action={
            <Button icon={Plus} onClick={openCreate}>
              Add city
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <THead>
            <TH>City</TH>
            <TH>Status</TH>
            <TH>Active</TH>
            <TH className="text-right">Actions</TH>
          </THead>

          <TBody>
            {cities.map((city) => (
              <TR key={city._id}>
                <TD>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-leaf-soft">
                      <MapPin className="h-5 w-5 text-leaf" />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">{city.name}</p>
                      <p className="text-xs text-gray-400">
                        Added {formatDate(city.createdAt)}
                      </p>
                    </div>
                  </div>
                </TD>

                <TD>
                  {city.active ? (
                    <Badge color="leaf">Active</Badge>
                  ) : (
                    <Badge color="gray">Inactive</Badge>
                  )}
                </TD>

                <TD>
                  <Switch
                    id={`city-${city._id}`}
                    checked={city.active}
                    disabled={togglingId === city._id}
                    onChange={() => handleToggle(city)}
                  />
                </TD>

                <TD className="text-right">
                  <div className="inline-flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(city)}
                      aria-label="Edit city"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(city)}
                      aria-label="Delete city"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </TableWrapper>
      )}

      <CityFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        city={editing}
        onSaved={loadData}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete city"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.name}"? Customers will no longer be able to select it. Existing orders keep their city.`
            : ""
        }
        confirmLabel="Delete"
      />
    </>
  );
};

export default Cities;
