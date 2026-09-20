import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Pencil,
  Percent,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import * as promotionApi from "../../api/promotionApi";
import * as productApi from "../../api/productApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Switch from "../../components/ui/Switch";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PromotionFormModal from "../../components/promotions/PromotionFormModal";
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

const formatDiscount = (promotion) =>
  promotion.type === "percentage"
    ? `${promotion.value}%`
    : formatCurrency(promotion.value);

const Promotions = () => {
  const toast = useToast();

  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
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
      const [promotionsRes, productsRes] = await Promise.all([
        promotionApi.getPromotions(),
        productApi.getProducts(),
      ]);

      setPromotions(promotionsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load promotions");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Products that already have a promotion (active or not) cannot get another.
  const takenProductIds = useMemo(
    () =>
      new Set(
        promotions.map((promotion) => promotion.product?._id ?? promotion.product)
      ),
    [promotions]
  );

  const handleToggle = async (promotion) => {
    setTogglingId(promotion._id);

    try {
      await promotionApi.updatePromotion(promotion._id, {
        active: !promotion.active,
      });

      toast.success(
        promotion.active
          ? "Promotion deactivated successfully"
          : "Promotion activated successfully"
      );

      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update promotion"));
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
      await promotionApi.deletePromotion(deleteTarget._id);
      toast.success("Promotion deleted successfully");
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete promotion"));
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (promotion) => {
    setEditing(promotion);
    setFormOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Promotions"
        subtitle="Manage product promotions"
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
              Add promotion
            </Button>
          </>
        }
      />

      {loading ? (
        <TableWrapper>
          <TBody>
            <TableState colSpan={6}>Loading promotions...</TableState>
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
      ) : promotions.length === 0 ? (
        <EmptyState
          icon={Percent}
          title="No promotions found"
          description="Create a promotion to offer discounts on your products."
          action={
            <Button icon={Plus} onClick={openCreate} disabled={products.length === 0}>
              Add promotion
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <THead>
            <TH>Product</TH>
            <TH>Type</TH>
            <TH>Discount</TH>
            <TH>Status</TH>
            <TH>Active</TH>
            <TH className="text-right">Actions</TH>
          </THead>

          <TBody>
            {promotions.map((promotion) => {
              const product = promotion.product;

              return (
                <TR key={promotion._id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {product?.image ? (
                        <img
                          src={product.image}
                          alt={product?.name}
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                        />
                      ) : null}

                      <div>
                        <p className="font-semibold text-gray-800">
                          {product?.name ?? "Deleted product"}
                        </p>
                        {product?.price !== undefined ? (
                          <p className="text-xs text-gray-400">
                            Base {formatCurrency(product.price)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </TD>

                  <TD>
                    <Badge color="forest">
                      {promotion.type === "percentage"
                        ? "Percentage"
                        : "Fixed"}
                    </Badge>
                  </TD>

                  <TD className="font-bold text-primary">
                    {formatDiscount(promotion)}
                  </TD>

                  <TD>
                    {promotion.active ? (
                      <Badge color="leaf">Active</Badge>
                    ) : (
                      <Badge color="gray">Inactive</Badge>
                    )}
                  </TD>

                  <TD>
                    <Switch
                      id={`promotion-${promotion._id}`}
                      checked={promotion.active}
                      disabled={togglingId === promotion._id}
                      onChange={() => handleToggle(promotion)}
                    />
                  </TD>

                  <TD className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(promotion)}
                        aria-label="Edit promotion"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(promotion)}
                        aria-label="Delete promotion"
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

      <PromotionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        promotion={editing}
        products={products}
        takenProductIds={takenProductIds}
        onSaved={loadData}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete promotion"
        message={
          deleteTarget
            ? `Delete the promotion for "${deleteTarget.product?.name ?? "this product"}"?`
            : ""
        }
        confirmLabel="Delete"
      />
    </>
  );
};

export default Promotions;
