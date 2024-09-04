import Modal from "@/src/components/ui/modals/modal";
import React from "react";
import styles from "@/styles/modal.module.css";

export const InfoModal = ({
  openModal,
  title,
  content,
  onClose,
  primaryAction,
}) => {
  const handleClose = () => {
    onClose && onClose();
    primaryAction && primaryAction();
  };
  return (
    <Modal isOpen={openModal} onClose={onClose}>
      {title && (
        <Modal.Header>
          <h3>{title}</h3>
        </Modal.Header>
      )}
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <button
          onClick={handleClose}
          className={`${styles.button} ${styles.buttonPrimary}`}
          style={{ margin: 0 }}
        >
          Don&apos;t show again
        </button>
      </Modal.Footer>
    </Modal>
  );
};
