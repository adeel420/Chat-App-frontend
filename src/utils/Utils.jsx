import { toast } from "react-hot-toast";

export const handleSuccess = (msg) => {
  return toast.success(msg, { position: "top-center" });
};

export const handleError = (msg) => {
  return toast.error(msg, { position: "top-center" });
};
