import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { MAX_ITEM_QUANTITY } from "../constants";

const OrderContext = createContext(null);

const buildKey = (productId, mealDay) => `${productId}__${mealDay}`;

export const OrderProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });
  const [delivery, setDelivery] = useState({
    city: "",
    quartier: "",
    locationType: "home",
    receiverName: "",
  });
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const addItem = useCallback((product, mealDay) => {
    const key = buildKey(product._id, mealDay);
    const stock = Number(product.stock);

    setItems((current) => {
      const existing = current.find((item) => item.key === key);

      if (existing) {
        const usedForProduct = current
          .filter((item) => item.productId === product._id)
          .reduce((sum, item) => sum + item.quantity, 0);

        const hardCap = Number.isFinite(stock) ? stock : MAX_ITEM_QUANTITY;
        const remaining = hardCap - usedForProduct;

        if (remaining <= 0) {
          return current;
        }

        return current.map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  MAX_ITEM_QUANTITY,
                  item.quantity + remaining
                ),
              }
            : item
        );
      }

      if (Number.isFinite(stock) && stock <= 0) {
        return current;
      }

      return [
        ...current,
        {
          key,
          productId: product._id,
          name: product.name,
          image: product.image,
          mealDay,
          quantity: 1,
          note: "",
          stock,
          unitPrice: Number(product.promotion?.finalPrice ?? product.price),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const setQuantity = useCallback((key, quantity) => {
    setItems((current) => {
      const target = current.find((item) => item.key === key);

      if (!target) {
        return current;
      }

      let max = MAX_ITEM_QUANTITY;
      const stock = Number(target.stock);

      if (Number.isFinite(stock)) {
        const usedElsewhere = current
          .filter(
            (item) => item.productId === target.productId && item.key !== key
          )
          .reduce((sum, item) => sum + item.quantity, 0);

        max = Math.min(max, stock - usedElsewhere);
      }

      const next = Math.max(1, Math.min(Number(quantity) || 1, max));

      return current.map((item) =>
        item.key === key ? { ...item, quantity: next } : item
      );
    });
  }, []);

  const setNote = useCallback((key, note) => {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, note } : item))
    );
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const clearOrder = useCallback(() => {
    setItems([]);
    setCustomer({ name: "", phone: "" });
    setDelivery({
      city: "",
      quartier: "",
      locationType: "home",
      receiverName: "",
    });
    setSubmittedOrder(null);
  }, []);

  const value = useMemo(() => {
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const distinctProductIds = [
      ...new Set(items.map((item) => item.productId)),
    ];

    return {
      items,
      customer,
      delivery,
      submittedOrder,
      itemsCount,
      distinctProductIds,
      addItem,
      removeItem,
      setQuantity,
      setNote,
      setCustomer,
      setDelivery,
      setSubmittedOrder,
      clearItems,
      clearOrder,
    };
  }, [
    items,
    customer,
    delivery,
    submittedOrder,
    addItem,
    removeItem,
    setQuantity,
    setNote,
    clearItems,
    clearOrder,
  ]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }

  return context;
};
