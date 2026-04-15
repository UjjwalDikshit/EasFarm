import axiosClient from "../../../utils/axiosClient";

export const transactionAPI = async () => {
    const { data } = await axiosClient.get("/payment/transaction");
    return data;
};