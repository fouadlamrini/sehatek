const Order = require("../models/Order");
const Product = require("../models/Product");

const getStatistics = async (req, res, next) => {
  try {
    const now = new Date();

    // =========================
    // DATE RANGES
    // =========================

    // بداية اليوم
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // بداية الأسبوع - Monday
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // بداية الشهر
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    // =========================
    // ORDERS
    // =========================

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const confirmedOrders = await Order.countDocuments({
      status: "confirmed",
    });

    const preparingOrders = await Order.countDocuments({
      status: "preparing",
    });

    const deliveringOrders = await Order.countDocuments({
      status: "delivering",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      status: "cancelled",
    });

    // =========================
    // SALES
    // =========================

    // Cancelled orders are excluded
    const salesStats = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$totalPrice",
          },

          totalDiscount: {
            $sum: "$discount",
          },

          averageOrderValue: {
            $avg: "$totalPrice",
          },
        },
      },
    ]);

    const sales = salesStats[0] || {
      totalRevenue: 0,
      totalDiscount: 0,
      averageOrderValue: 0,
    };

    // =========================
    // TODAY
    // =========================

    const todayStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
          },

          status: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,

          orders: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const today = todayStats[0] || {
      orders: 0,
      revenue: 0,
    };

    // =========================
    // THIS WEEK
    // =========================

    const weekStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
          },

          status: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,

          orders: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const week = weekStats[0] || {
      orders: 0,
      revenue: 0,
    };

    // =========================
    // THIS MONTH
    // =========================

    const monthStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
          },

          status: {
            $ne: "cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,

          orders: {
            $sum: 1,
          },

          revenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const month = monthStats[0] || {
      orders: 0,
      revenue: 0,
    };

    // =========================
    // PRODUCTS
    // =========================

    const totalProducts = await Product.countDocuments();

    // Produit avec stock <= 5
    const lowStockProducts = await Product.countDocuments({
      stock: {
        $lte: 5,
      },
    });

    // =========================
    // CUSTOMERS
    // =========================

    // Customer n'est pas une collection.
    // Customer est embedded داخل Order.
    // لذلك نحسب أرقام الهاتف المختلفة.
    const uniquePhones = await Order.distinct("customer.phone");

    const totalCustomers = uniquePhones.length;

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,
      message: "Statistics retrieved successfully",
      data: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          preparing: preparingOrders,
          delivering: deliveringOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },

        sales: {
          totalRevenue: Number(sales.totalRevenue.toFixed(2)),
          totalDiscount: Number(sales.totalDiscount.toFixed(2)),
          averageOrderValue: Number(
            sales.averageOrderValue.toFixed(2)
          ),
        },

        products: {
          total: totalProducts,
          lowStock: lowStockProducts,
        },

        customers: {
          total: totalCustomers,
        },

        periods: {
          today: {
            orders: today.orders,
            revenue: Number(today.revenue.toFixed(2)),
          },

          week: {
            orders: week.orders,
            revenue: Number(week.revenue.toFixed(2)),
          },

          month: {
            orders: month.orders,
            revenue: Number(month.revenue.toFixed(2)),
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatistics,
};