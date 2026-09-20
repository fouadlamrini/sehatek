import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Gift,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import * as packApi from "../../api/packApi";
import * as productApi from "../../api/productApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Switch from "../../components/ui/Switch";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PackFormModal from "../../components/packs/PackFormModal";
import PackDetailsDrawer from "../../components/packs/PackDetailsDrawer";
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
import { formatCurrency } from "../../utils/format";
import { computePackPricing } from "../../utils/pack";
import { PACK_TYPE_LABELS } from "../../constants";

const Packs = () => {
  const toast = useToast();

  const [packs, setPacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState(null);

  const [selected, setSelected] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [packsRes, productsRes] = await Promise.all([
        packApi.getPacks(),
        productApi.getProducts(),
      ]);

      setPacks(packsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load packs");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (pack) => {
    setTogglingId(pack._id);

    try {
      await packApi.updatePack(pack._id, { active: !pack.active });

      toast.success(
        pack.active
          ? "Pack deactivated successfully"
          : "Pack activated successfully"
      );

      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update pack"));
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
      await packApi.deletePack(deleteTarget._id);
      toast.success("Pack deleted successfully");
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete pack"));
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (pack) => {
    setEditing(pack);
    setFormOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Packs"
        subtitle="Manage meal packs"
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

            <Button icon={Plus} onClick={openCreate} disabled={products.length === 0}>
              Add pack
            </Button>
          </>
        }
      />

      {loading ? (
        <TableWrapper>
          <TBody>
            <TableState colSpan={6}>Loading packs...</TableState>
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
      ) : packs.length === 0 ? (
        <EmptyState
          icon={Gift}
          title="No packs found"
          description="Create a pack to combine products at a special price."
          action={
            <Button icon={Plus} onClick={openCreate} disabled={products.length === 0}>
              Add pack
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <THead>
            <TH>Pack</TH>
            <TH>Products</TH>
            <TH>Type</TH>
            <TH>Final price</TH>
            <TH>Active</TH>
            <TH className="text-right">Actions</TH>
          </THead>

          <TBody>
            {packs.map((pack) => {
              const { originalTotal, finalPrice, discount } =
                computePackPricing(pack);

              return (
                <TR key={pack._id}>
                  <TD>
                    <button
                      type="button"
                      onClick={() => setSelected(pack)}
                      className="group flex items-center gap-3 text-left"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Gift className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 group-hover:text-primary">
                          {pack.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {pack.products?.length ?? 0} product
                          {(pack.products?.length ?? 0) === 1 ? "" : "s"} · view
                        </p>
                      </div>
                    </button>
                  </TD>

                  <TD className="max-w-xs whitespace-normal">
                    <div className="flex flex-wrap gap-1">
                      {(pack.products ?? []).map((product) => (
                        <span
                          key={product?._id ?? product}
                          className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {product?.name ?? "Unknown"}
                        </span>
                      ))}
                    </div>
                  </TD>

                  <TD>
                    <Badge color="forest">
                      {PACK_TYPE_LABELS[pack.type] ?? pack.type}
                    </Badge>
                  </TD>

                  <TD>
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">
                        {formatCurrency(finalPrice)}
                      </span>

                      {discount > 0 ? (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(originalTotal)}
                        </span>
                      ) : null}
                    </div>
                  </TD>

                  <TD>
                    <Switch
                      id={`pack-${pack._id}`}
                      checked={pack.active}
                      disabled={togglingId === pack._id}
                      onChange={() => handleToggle(pack)}
                    />
                  </TD>

                  <TD className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(pack)}
                        aria-label="Edit pack"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(pack)}
                        aria-label="Delete pack"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </TableWrapper>
      )}

      <PackFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        pack={editing}
        products={products}
        onSaved={loadData}
      />

      <PackDetailsDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        pack={selected}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete pack"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"?`
            : ""
        }
        confirmLabel="Delete"
      />
    </>
  );
};

export default Packs;
