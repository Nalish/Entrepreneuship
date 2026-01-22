import api from "./apiservice";

export const checkout = async ({ branchId, customerId, items, paymentMethod }) => {
  // For M-Pesa, only create cart/temporary data, don't process sale yet
  if (paymentMethod === "mpesa") {
    return {
      saleId: null,
      cartData: { branchId, customerId, items },
      message: "Ready for M-Pesa payment",
    };
  }

  // For Cash/Card, create the sale immediately
  const response = await api.post("/checkout", {
    branchId,
    customerId,
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice ?? item.price,
    })),
  });

  return response.data;
};
