import PropTypes from "prop-types";


const CustomToast = ({ message, type, onClose }) => {
  // Define styles based on the toast type
  const getStyles = (type) => {
    switch (type) {
      case "success":
        return { background: "#4CAF50", color: "#FFF" };
      case "error":
        return { background: "#F44336", color: "#FFF" };
      case "info":
        return { background: "#2196F3", color: "#FFF" };
      case "warning":
        return { background: "#FF9800", color: "#FFF" };
      default:
        return { background: "#333", color: "#FFF" };
    }
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        borderRadius: "4px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        ...getStyles(type),
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#FFF",
          marginLeft: "10px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        aria-label="Close Toast"
      >
        &times;
      </button>
    </div>
  );
};

CustomToast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info", "warning", "default"]),
  onClose: PropTypes.func.isRequired,
};

export default CustomToast;

