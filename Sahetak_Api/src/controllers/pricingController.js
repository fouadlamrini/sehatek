const { calculateCartPrice } = require("../utils/pricingService");

// =========================
// CALCULATE PRICE
// =========================

const calculate = async (req, res, next) => {
  try {
    const { productIds } = req.body;

    const result = await calculateCartPrice(productIds);

    return res.status(200).json({
      success: true,
      message: "Price calculated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculate,
};