import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Eye,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import * as orderApi from "../../api/orderApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import OrderDetailsDrawer from "../../components/orders/OrderDetailsDrawer";
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
import { formatCurrency, formatDate } from "../../utils/format";
import { ORDER_STATUSES } from "../../constants";
import { cn } from "../../utils/cn";

const Orders = () => {
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await orderApi.getOrders();
      setOrders(data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load orders");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!term) {
        return true;
      }

      const haystack = [
        order._id,
        order.customer?.name,
        order.customer?.phone,
        order.delivery?.city,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (status) => {
    if (!selected) {
      return;
    }

    setUpdatingStatus(true);

    try {
      await orderApi.updateOrderStatus(selected._id, status);

      toast.success("Order status updated successfully");

      setOrders((current) =>
        current.map((order) =>
          order._id === selected._id ? { ...order, status } : order
        )
      );

      setSelected((current) => (current ? { ...current, status } : current));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update order status"));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await orderApi.deleteOrder(deleteTarget._id);
      toast.success("Order deleted successfully");

      if (selected?._id === deleteTarget._id) {
        setSelected(null);
      }

      setDeleteTarget(null);
      loadOrders();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete order"));
    } finally {
      setDeleting(false);
    }
  };

  const filters = [{ value: "all", label: "All" }, ...ORDER_STATUSES];

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders"
        actions={
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={loadOrders}
            disabled={loading}
          >
            Refresh
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                statusFilter === filter.value
                  ? "border-primary bg-primary text-white"
                  : "border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Input
            placeholder="Search customer, phone, city..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <TableWrapper>
          <TBody>
            <TableState colSpan={7}>Loading orders...</TableState>
          </TBody>
        </TableWrapper>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
          <p className="text-sm font-medium text-red-600">{error}</p>
          <Button variant="outline" icon={RefreshCw} onClick={loadOrders}>
            Try again
          </Button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={orders.length === 0 ? "No orders yet" : "No matching orders"}
          description={
            orders.length === 0
              ? "Orders placed by customers will appear here."
              : "Try changing the status filter or search term."
          }
        />
      ) : (
        <TableWrapper>
          <THead>
            <TH>Order</TH>
            <TH>Customer</TH>
            <TH>City</TH>
            <TH>Items</TH>
            <TH>Total</TH>
            <TH>Status</TH>
            <TH className="text-right">Actions</TH>
          </THead>

          <TBody>
            {filteredOrders.map((order) => (
              <TR key={order._id}>
                <TD>
                  <div>
                    <p className="font-semibold text-gray-800">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </TD>

                <TD>
                  <div>
                    <p className="font-semibold text-gray-700">
                      {order.customer?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.customer?.phone}
                    </p>
                  </div>
                </TD>

                <TD className="text-gray-500">{order.delivery?.city ?? "-"}</TD>

                <TD className="text-gray-500">
                  {order.items?.length ?? 0}
                </TD>

                <TD className="font-bold text-forest">
                  {formatCurrency(order.totalPrice)}
                </TD>

                <TD>
                  <OrderStatusBadge status={order.status} />
                </TD>

                <TD className="text-right">
                  <div className="inline-flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(order)}
                      aria-label="View order"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(order)}
                      aria-label="Delete order"
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

      <OrderDetailsDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        order={selected}
        onStatusChange={handleStatusChange}
        updating={updatingStatus}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete order"
        message="Deleting this order will restore the product stock. This action cannot be undone."
        confirmLabel="Delete"
      />
    </>
  );
};

export default Orders;
