"use client";

import React from "react";
import Modal from "@/internal/components/ui/modals/modal";
import {useModal} from "@/internal/providers/modal-provider";

export const PremiumModal = () => {
    const {modalState, closeModal} = useModal();
    const {isOpen, props} = modalState.premium;

    return (
        <Modal isOpen={isOpen} onClose={() => closeModal("premium")}>
            <Modal.Body>
                <div className="app">
                    <div className="modal">
                        <h1>Upgrade this site to accept payments online</h1>
                        <p>To start getting paid online, upgrade your site with a premium that allows you to see
                            the full payment flow</p>
                        <button className="upgrade-button" onClick={props?.primaryAction}>Upgrade Now</button>
                    </div>
                </div>
                <style jsx>{`
                    .app {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                    }

                    .modal {
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        width: 90%;
                        max-width: 500px;
                        text-align: center;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }

                    h1 {
                        font-size: 24px;
                        margin-bottom: 15px;
                    }

                    p {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 20px;
                    }

                    .upgrade-button {
                        background-color: #9A27D5;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        margin: 20px 0 0 0;
                        border-radius: 20px;
                        font-size: 16px;
                        cursor: pointer;
                        justify-self: flex-end;
                    }
                `}</style>
            </Modal.Body>
        </Modal>
    );
}
