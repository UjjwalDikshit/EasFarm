import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";

const createReport = async (data) => {
  try {
    const res = await axiosClient.post("/blog/reports", {...data});
    // toast.success(res.data.message);
    toast.success(`Thank You for Your Responsible Action 🙏`);
  } catch (err) {
    console.log(err);
    toast.error(err.response?.data?.error || "Something went wrong");
  }
};

export default createReport;
