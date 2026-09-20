import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import ToastViewport from "../components/ui/Toast";

export const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 4000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);
  const timers = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message, type) => {
      const id = (counter.current += 1);

      setToasts((current) => [...current, { id, message, type }]);

      const timer = setTimeout(() => removeToast(id), AUTO_DISMISS_MS);

      timers.current.set(id, timer);
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (message) => addToast(message, "success"),
      error: (message) => addToast(message, "error"),
      info: (message) => addToast(message, "info"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
