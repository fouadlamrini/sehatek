import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

import * as adminApi from "../../api/adminApi";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/error";
import { formatDate, getInitials } from "../../utils/format";
import { ROLE_LABELS } from "../../constants";

const Admins = () => {
  const toast = useToast();
  const { admin } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const currentId = admin?.id;

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await adminApi.getAdmins();
      setAdmins(data);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load admins");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      await adminApi.deleteAdmin(deleteTarget.id);
      toast.success("Admin deleted successfully");
      setDeleteTarget(null);
      loadAdmins();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete admin"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Admins"
        subtitle="Manage administrator accounts"
        actions={
          <>
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={loadAdmins}
              disabled={loading}
            >
              Refresh
            </Button>

            <Link to="/admins/create">
              <Button icon={Plus}>Add admin</Button>
            </Link>
          </>
        }
      />

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          Loading admins...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <AlertTriangle className="h-7 w-7 text-red-500" />
          <p className="text-sm font-medium text-red-600">{error}</p>
          <Button variant="outline" icon={RefreshCw} onClick={loadAdmins}>
            Try again
          </Button>
        </div>
      ) : admins.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No admins found"
          description="Add an administrator account to get started."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {admins.map((item) => {
            const isSelf = item.id === currentId;
            const canDelete = !isSelf && item.role !== "super_admin";

            return (
              <div
                key={item.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                      {getInitials(item.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800">
                        {item.name}
                        {isSelf ? (
                          <span className="ml-1 text-xs font-normal text-gray-400">
                            (you)
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {item.email}
                      </p>
                    </div>
                  </div>

                  <Badge color={item.role === "super_admin" ? "leaf" : "primary"}>
                    {ROLE_LABELS[item.role] ?? item.role}
                  </Badge>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400">
                    {item.createdAt ? `Joined ${formatDate(item.createdAt)}` : ""}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    disabled={!canDelete}
                    onClick={() => setDeleteTarget(item)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete admin"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? They will lose access to the dashboard.`
            : ""
        }
        confirmLabel="Delete"
      />
    </>
  );
};

export default Admins;
