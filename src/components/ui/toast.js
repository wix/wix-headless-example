"use client"
import {useEffect, useState} from "react";
import styles from "@/styles/app.module.css";
import {CLIENT_ID} from "@/constants/constants";

export default function Toast({children}) {
    const [showToast, setShowToast] = useState(false);
    const exampleClientId = '9e37d7b0-3621-418f-a6b6-b82bdeaf051d';

    useEffect(() => {
        const toastClosed = localStorage.getItem('toastClosed');

        if (toastClosed === null && CLIENT_ID === exampleClientId) {
            setShowToast(true);
        } else {
            setShowToast(false);

            localStorage.removeItem('toastClosed');
        }

        return () => {
            localStorage.removeItem('toastClosed');
        };
    }, []);

    const closeToast = () => {
        setShowToast(false);
        localStorage.setItem('toastClosed', 'true');
    };

    if (!showToast) return null;

    return (
        <div className={`${styles.toast}`}>
            <div className={`${styles['toast-icon-wrapper']}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 192 512"
                    className={`${styles['toast-icon']}`}
                >
                    <path
                        d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"
                    />
                </svg>
            </div>
            <span className={`${styles['toast-content']}`}>{children}</span>
            <button onClick={closeToast} className={`${styles['toast-close']}`} aria-label="Close">
                &times;
            </button>
        </div>
    );
}