import api from "./apiservice";

export const createPayment = async ({ saleId, amount, method, phoneNumber }) => {
  const response = await api.post("/payment", {
    saleId,
    amount,
    method,
    phoneNumber,
  });

  return response.data;
};
