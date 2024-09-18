"use client";

import React from "react";
import styles from "@/styles/modal.module.css";
import Modal from "@/internal/components/ui/modals/modal";
import {useModal} from "@/internal/providers/modal-provider";

export default function PremiumModal() {
    const {modalState, closeModal} = useModal();
    const {isOpen, props} = modalState.premium;

    return (
        <Modal isOpen={isOpen} onClose={() => closeModal("premium")}>
            <Modal.Header>
        <span style={{display: "flex", alignItems: "center", gap: "1rem"}}>
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
          <h3>{props.title}</h3>
        </span>
            </Modal.Header>

            <Modal.Body>
                <p>{props.content}</p>
            </Modal.Body>

            <Modal.Footer>
                <button
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    onClick={props.primaryAction}
                >
                    {props.primaryText}
                </button>
                <button
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={() => closeModal("premium")}
                >
                    {props.secondaryText}
                </button>
            </Modal.Footer>
        </Modal>
    );
}
