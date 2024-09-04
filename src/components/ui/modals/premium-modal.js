"use client";

import styles from "@/styles/modal.module.css";
import Modal from "@/src/components/ui/modals/modal";

export default function PremiumModal({
  openModal,
  title,
  content,
  primaryText,
  secondaryText,
  primaryAction,
  secondaryAction,
}) {
  return (
    <Modal isOpen={openModal} onClose={secondaryAction}>
      <Modal.Header>
        <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <svg
            className={styles.icon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>{title}</h3>
        </span>
      </Modal.Header>

      <Modal.Body>
        <p>{content}</p>
      </Modal.Body>

      <Modal.Footer>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={primaryAction}
        >
          {primaryText}
        </button>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={secondaryAction}
        >
          {secondaryText}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
