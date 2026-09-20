import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  Package,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import * as statisticsApi from "../../api/statisticsApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FullPageLoader } from "../../components/ui/Spinner";
import StatCard from "../../components/dashboard/StatCard";
import { getErrorMessage } from "../../utils/error";
import { formatCurrency } from "../../utils/format";
import { ORDER_STATUSES, ORDER_STATUS_COLORS } from "../../constants";

const PERIOD_LABELS = {
  today: "Today",
  week: "This week",
  month: "This month",
};

const LoadingOrError = ({ loading, error, onRetry }) => {
  if (loading) {
    return <FullPageLoader label="Loading statistics..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-14 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500" />

        <div>
          <h3 className="text-base font-bold text-red-700">
            Failed to load statistics
          </h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>

        <Button variant="outline" icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStatistics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await statisticsApi.getStatistics();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load statistics"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  if (loading || error || !stats) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Overview of Sehatek activity" />
        <LoadingOrError loading={loading} error={error} onRetry={loadStatistics} />
      </>
    );
  }

  const { orders, sales, products, customers, periods } = stats;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of Sehatek activity"
        actions={
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={loadStatistics}
            loading={loading}
          >
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Total Orders"
          value={orders.total}
          hint={`${orders.pending} pending · ${orders.delivered} delivered`}
          color="primary"
        />

        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={formatCurrency(sales.totalRevenue)}
          hint={`Avg. ${formatCurrency(sales.averageOrderValue)} / order`}
          color="leaf"
        />

        <StatCard
          icon={Package}
          label="Total Products"
          value={products.total}
          hint={
            products.lowStock > 0
              ? `${products.lowStock} low on stock`
              : "Stock levels healthy"
          }
          color="forest"
        />

        <StatCard
          icon={Users}
          label="Total Customers"
          value={customers.total}
          hint="Unique phone numbers"
          color="blue"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-forest">Orders by status</h2>

          <ul className="mt-4 space-y-3">
            {ORDER_STATUSES.map((status) => (
              <li
                key={status.value}
                className="flex items-center justify-between"
              >
                <Badge color={ORDER_STATUS_COLORS[status.value]}>
                  {status.label}
                </Badge>

                <span className="text-sm font-bold text-gray-700">
                  {orders[status.value] ?? 0}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-forest">Sales</h2>

          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs font-medium text-gray-400">
                Total revenue
              </dt>
              <dd className="text-lg font-extrabold text-forest">
                {formatCurrency(sales.totalRevenue)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-400">
                Total discount
              </dt>
              <dd className="text-lg font-bold text-primary">
                {formatCurrency(sales.totalDiscount)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-400">
                Average order value
              </dt>
              <dd className="text-lg font-bold text-gray-700">
                {formatCurrency(sales.averageOrderValue)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-forest">Inventory</h2>

          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs font-medium text-gray-400">
                Total products
              </dt>
              <dd className="text-lg font-extrabold text-forest">
                {products.total}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-gray-400">
                Low stock (≤ 5)
              </dt>
              <dd
                className={
                  products.lowStock > 0
                    ? "text-lg font-bold text-red-600"
                    : "text-lg font-bold text-leaf"
                }
              >
                {products.lowStock}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-forest">
          <CalendarDays className="h-4 w-4 text-primary" />
          Recent activity
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Object.entries(periods).map(([key, period]) => (
            <div
              key={key}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {PERIOD_LABELS[key] ?? key}
              </p>

              <p className="mt-2 flex items-center gap-2 text-xl font-extrabold text-forest">
                <TrendingUp className="h-4 w-4 text-leaf" />
                {formatCurrency(period.revenue)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {period.orders} order{period.orders === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
