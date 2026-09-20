import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Package, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

import * as productApi from "../../api/productApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ProductFormModal from "../../components/products/ProductFormModal";
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
import { formatCurrency, formatDays } from "../../utils/format";

const Products = () => {
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await productApi.getProducts();
      setProducts(data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load products");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await productApi.deleteProduct(deleteTarget._id);
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete product"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Manage your meal products"
        actions={
          <>
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={loadProducts}
              disabled={loading}
            >
              Refresh
            </Button>

            <Button icon={Plus} onClick={openCreate}>
              Add product
            </Button>
          </>
        }
      />

      {loading ? (
        <TableWrapper>
          <TBody>
            <TableState colSpan={6}>Loading products...</TableState>
          </TBody>
        </TableWrapper>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
          <p className="text-sm font-medium text-red-600">{error}</p>
          <Button variant="outline" icon={RefreshCw} onClick={loadProducts}>
            Try again
          </Button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Start by adding your first meal product."
          action={
            <Button icon={Plus} onClick={openCreate}>
              Add product
            </Button>
          }
        />
      ) : (
        <TableWrapper>
          <THead>
            <TH>Product</TH>
            <TH>Meal days</TH>
            <TH>Price</TH>
            <TH>Stock</TH>
            <TH>Status</TH>
            <TH className="text-right">Actions</TH>
          </THead>

          <TBody>
            {products.map((product) => {
              const promotion = product.promotion;
              const lowStock = product.stock <= 5;

              return (
                <TR key={product._id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />

                      <span className="font-semibold text-gray-800">
                        {product.name}
                      </span>
                    </div>
                  </TD>

                  <TD className="max-w-xs whitespace-normal text-gray-500">
                    {formatDays(product.mealDays)}
                  </TD>

                  <TD>
                    {promotion ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-forest">
                          {formatCurrency(promotion.finalPrice)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(promotion.originalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-forest">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </TD>

                  <TD>
                    <Badge color={lowStock ? "red" : "leaf"}>
                      {product.stock}
                    </Badge>
                  </TD>

                  <TD>
                    {promotion ? (
                      <Badge color="primary">Promotion</Badge>
                    ) : (
                      <Badge color="gray">Regular</Badge>
                    )}
                  </TD>

                  <TD className="text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(product)}
                        aria-label="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(product)}
                        aria-label="Delete product"
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

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        onSaved={loadProducts}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete product"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </>
  );
};

export default Products;
