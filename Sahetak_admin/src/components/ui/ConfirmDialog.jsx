import { AlertTriangle } from "lucide-react";

import Button from "./Button";
import Modal from "./Modal";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
}) => (
  <Modal
    open={open}
    onClose={loading ? () => {} : onClose}
    size="sm"
    footer={
      <>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>

        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
