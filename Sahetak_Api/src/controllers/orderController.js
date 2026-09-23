const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { signTrackToken, verifyTrackToken } = require("../utils/trackToken");

const {
  calculateCartPrice,
  computeOrderTotals,
} = require("../utils/pricingService");

// =========================
// CREATE ORDER
// =========================

const createOrder = async (req, res, next) => {
  try {
    const { items, customer, delivery } = req.body;

    // =========================
    // PROCESS ITEMS (single batch fetch, no N+1)
    // =========================

    const productIds = items.map((item) => item.product);

    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(
      products.map((product) => [String(product._id), product])
    );

    // Aggregated quantity per product across every meal day
    const neededPerProduct = new Map();

    for (const item of items) {
      const productData = productMap.get(String(item.product));

      if (!productData) {
        throw new AppError(`Product not found: ${item.product}`, 404);
      }

      // =========================
      // CHECK MEAL DAY
      // =========================

      if (!productData.mealDays.includes(item.mealDay)) {
        throw new AppError(
          `${productData.name} is not available on ${item.mealDay}`,
          400
        );
      }

      neededPerProduct.set(
        String(productData._id),
        (neededPerProduct.get(String(productData._id)) ?? 0) +
          Number(item.quantity)
      );
    }

    // =========================
    // CHECK STOCK (cumulative across the whole order)
    // =========================

    for (const [productId, needed] of neededPerProduct) {
      if (productMap.get(productId).stock < needed) {
        throw new AppError(
          `Not enough stock for ${productMap.get(productId).name}`,
          400
        );
      }
    }

    const processedItems = items.map((item) => {
      const productData = productMap.get(String(item.product));

      return {
        product: productData._id,
        mealDay: item.mealDay,
        quantity: Number(item.quantity),
        price: productData.price,
        note: item.note || "",
      };
    });

    // =========================
    // PRICING (Promotion / Pack)
    // =========================

    // Pricing works on the set of distinct selected products.
    const distinctProductIds = [
      ...new Set(processedItems.map((item) => item.product.toString())),
    ];

    const pricing = await calculateCartPrice(distinctProductIds);

    const orderTotals = computeOrderTotals(pricing, processedItems);

    // =========================
    // DECREASE STOCK
    // =========================

    for (const item of processedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // =========================
    // CREATE ORDER
    // =========================

    const order = await Order.create({
      items: processedItems,

      customer: {
        name: customer.name,
        phone: customer.phone,
      },

      delivery: {
        city: delivery.city,
        quartier: delivery.quartier,
        locationType: delivery.locationType,
        receiverName: delivery.receiverName || "",
      },

      subtotal: orderTotals.subtotal,

      promotion: null,

      discount: orderTotals.discountAmount,

      totalPrice: orderTotals.totalPrice,

      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GUEST ORDER TRACKING
// =========================

const getOrderByTracking = async (trackingCode, phone) => {
  const order = await Order.findOne({
    trackingCode: String(trackingCode).trim().toUpperCase(),
    "customer.phone": String(phone).trim(),
  }).populate("items.product", "name image price mealDays");

  if (!order) {
    throw new AppError(
      "Order not found. Check the tracking code and phone number.",
      404
    );
  }

  return order;
};

const getGuestOrder = async (req, res, next) => {
  try {
    const { trackingCode, phone } = req.body;

    const order = await getOrderByTracking(trackingCode, phone);

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
      // Signed, short-lived capability for mutations — never reveal it in URLs.
      trackToken: signTrackToken({
        orderId: order._id,
        phone: order.customer.phone,
      }),
    });
  } catch (error) {
    next(error);
  }
};

const assertTrackToken = (req, order) => {
  const { trackToken } = req.body;

  if (!verifyTrackToken(trackToken, { orderId: order._id, phone: order.customer.phone })) {
    throw new AppError("Invalid or expired track token", 401);
  }
};

const cancelGuestOrder = async (req, res, next) => {
  try {
    const { trackingCode, phone } = req.body;

    const order = await getOrderByTracking(trackingCode, phone);

    // The (code + phone) pair alone is no longer enough: the short-lived
    // signed token obtained from /orders/track must be presented.
    assertTrackToken(req, order);

    // Only pending orders can be cancelled by the guest
    if (order.status !== "pending") {
      throw new AppError(
        "Order can only be cancelled while it is pending",
        400
      );
    }

    // Restore stock for each item
    for (const item of order.items) {
      const productId = item.product._id || item.product;

      await Product.findByIdAndUpdate(productId, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    order.status = "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const updateGuestOrder = async (req, res, next) => {
  try {
    const { trackingCode, phone, delivery, customerName, newPhone } =
      req.body;

    const order = await getOrderByTracking(trackingCode, phone);

    // Require the signed capability issued at /orders/track
    assertTrackToken(req, order);

    // Only pending orders can be updated by the guest
    if (order.status !== "pending") {
      throw new AppError(
        "Order can only be updated while it is pending",
        400
      );
    }

    if (customerName) {
      order.customer.name = customerName;
    }

    if (newPhone) {
      order.customer.phone = newPhone;
    }

    if (delivery) {
      if (delivery.city) {
        order.delivery.city = delivery.city;
      }

      if (delivery.quartier) {
        order.delivery.quartier = delivery.quartier;
      }

      if (delivery.locationType) {
        order.delivery.locationType = delivery.locationType;
      }

      if (delivery.receiverName !== undefined) {
        order.delivery.receiverName = delivery.receiverName;
      }
    }

    await order.save();

    // Re-issue a fresh capability bound to the (possibly new) phone so the
    // customer can continue managing the order without re-typing the phone.
    const nextTrackToken = signTrackToken({
      orderId: order._id,
      phone: order.customer.phone,
    });

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
      trackToken: nextTrackToken,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET ALL ORDERS
// =========================

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name image price mealDays")
      .populate("promotion", "type value")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET ONE ORDER
// =========================

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name image price mealDays")
      .populate("promotion", "type value");

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE ORDER STATUS
// =========================

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE ORDER
// =========================

const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Restore stock only if order is not cancelled
    // and stock was already decreased
    if (order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: item.quantity,
          },
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getGuestOrder,
  cancelGuestOrder,
  updateGuestOrder,
};