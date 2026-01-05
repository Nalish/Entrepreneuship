import api from "./apiservice";

export const checkout = async ({ branchId, customerId, items }) => {
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
