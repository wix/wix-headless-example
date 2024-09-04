"use client";

import styles from "@/styles/app.module.css";
import Image from "next/image";
import React from "react";
import Modal from "@/src/components/ui/modals/modal";
import Link from "next/link";

export default function LoginModal({
  openModal,
  WixLoginAction,
  CustomLoginAction,
  onClose,
}) {
  return (
    <Modal isOpen={openModal} onClose={onClose}>
      <Modal.Header>
        <h3 style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          Choose a login method
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.row} style={{ margin: "0", padding: "25px" }}>
          <section
            onClick={WixLoginAction}
            className={`${styles.selectable} ${styles.column}`}
            style={{
              textAlign: "center",
            }}
          >
            <h2>Login with Wix</h2>
            <span>
              <Image
                src="/wix.svg"
                alt="Wix Logo"
                width={88}
                height={34}
                priority
              />
            </span>
          </section>
          <div className={styles.divider} />
          <section
            onClick={CustomLoginAction}
            className={`${styles.selectable} ${styles.column}`}
            style={{
              textAlign: "center",
            }}
          >
            <h2>
              Custom
              <br />
              Login
            </h2>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="88"
                height="34"
                fill="#20303C"
              >
                <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
              </svg>
            </span>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <p>
          Not sure what&rsquo;s the difference?{" "}
          <Link
            href="https://dev.wix.com/docs/go-headless/coding/java-script-sdk/visitors-and-members/handle-members-with-wix-managed-login"
            target="_blank"
            style={{ color: "#116DFF" }}
          >
            Wix Managed Login
          </Link>{" "}
          vs{" "}
          <Link
            href="https://dev.wix.com/docs/go-headless/coding/java-script-sdk/visitors-and-members/handle-members-with-custom-login"
            target="_blank"
            style={{ color: "#116DFF" }}
          >
            Custom Login
          </Link>
        </p>
      </Modal.Footer>
    </Modal>
  );
}
