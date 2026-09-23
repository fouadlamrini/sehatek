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
    latitude: null,
    longitude: null,
  });
  const [submittedOrder, setSubmittedOrder] = useState(null);

  const addItem = useCallback((product, mealDay) => {
    const key = buildKey(product._id, mealDay);

    setItems((current) => {
      const existing = current.find((item) => item.key === key);

      if (existing) {
        return current.map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY),
              }
            : item
        );
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
          unitPrice: Number(product.promotion?.finalPrice ?? product.price),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((key) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const setQuantity = useCallback((key, quantity) => {
    setItems((current) =>
      current.map((item) => {
        if (item.key !== key) {
          return item;
        }

        const next = Math.max(
          1,
          Math.min(Number(quantity) || 1, MAX_ITEM_QUANTITY)
        );

        return { ...item, quantity: next };
      })
    );
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
      latitude: null,
      longitude: null,
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
