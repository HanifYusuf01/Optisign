
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";

export const showToast = (message, type = "default", options = {}) => {
  toast(
    <CustomToast
      message={message}
      type={type}
      onClose={() => toast.dismiss()}
    />,
    {
      position: options.position || "top-right",
      autoClose: options.autoClose ?? 3000,
      hideProgressBar: options.hideProgressBar ?? false,
      closeOnClick: options.closeOnClick ?? true,
      pauseOnHover: options.pauseOnHover ?? true,
      draggable: options.draggable ?? true,
      progress: undefined,
      ...options,
    }
  );
};

  