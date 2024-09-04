import React, { useCallback, useEffect, useState } from "react";
import styles from "@/styles/modal.module.css";

const Modal = ({ children, isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    onClose();
  }, [onClose]);

  if (!isModalOpen) return null;

  return (
    <>
      <div className={styles["modal-overlay"]}></div>
      <div className={styles["modal-container"]}>
        <div className={styles["modal-content-wrapper"]}>
          <div className={styles["modal-content"]}>
            <button
              className={styles["modal-close-button"]}
              onClick={handleClose}
            >
              &times;
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

const Header = ({ children }) => (
  <div className={styles["modal-header"]}>{children}</div>
);

const Body = ({ children }) => (
  <div className={styles["modal-body"]}>{children}</div>
);

const Footer = ({ children }) => (
  <div className={styles["modal-footer"]}>{children}</div>
);

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;

export default Modal;
