import { Toast, ToastContainer } from "react-bootstrap";

export default function AppToast({ show, onClose, text, variant = "success" }) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast
        bg={variant === "danger" ? "danger" : "success"}
        show={show}
        onClose={onClose}
        delay={3500}
        autohide
      >
        <Toast.Header closeButton>
          <strong className="me-auto">
            {variant === "danger" ? "Error" : "Éxito"}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">{text}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
