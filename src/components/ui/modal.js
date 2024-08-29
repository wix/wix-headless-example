"use client";

import styles from "@/styles/modal.module.css";

export default function Modal({
  openModal,
  title,
  content,
  primaryText,
  secondaryText,
  primaryAction,
  secondaryAction,
}) {
  return (
    <>
      {openModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalBody}>
              <div className={styles.modalContent}>
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
                <h3 className={styles.modalTitle}>{title}</h3>
                <p className={styles.modalText}>{content}</p>
                <div className={styles.buttonContainer}>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
