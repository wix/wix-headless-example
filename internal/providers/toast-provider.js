import React, {createContext, useContext, useEffect, useState} from "react";
import Link from "next/link";
import Toast from "@/internal/components/ui/toast";

// Create a context for the toast
const ToastContext = createContext(null);

// Provider component to manage the toast
export function ToastProvider({children}) {
    const [mounted, setMounted] = useState(true);

    useEffect(() => {
        setMounted(false);
    }, []);

    return (
        <ToastContext.Provider value={mounted}>
            <Toast>
                The client IDs provided in the examples are for demonstration purposes
                only. Please use your own client ID that can be found{" "}
                <Link
                    href={
                        "https://www.wix.com/my-account/site-selector/?buttonText=Select%20Site&title=Select%20a%20Site&autoSelectOnSingleSite=true&actionUrl=https:%2F%2Fwww.wix.com%2Fdashboard%2F%7B%7BmetaSiteId%7D%7D%2Foauth-apps-settings"
                    }
                    target={"_blank"}
                    style={{color: "#116DFF"}}
                >
                    here
                </Link>
                . Edit the file <code>constants/constants.js</code> and replace the
                value of CLIENT_ID with your own client ID.{" "}
                <Link
                    href={
                        "https://dev.wix.com/docs/go-headless/getting-started/setup/authentication/create-an-oauth-app-for-visitors-and-members"
                    }
                    target={"_blank"}
                    style={{color: "#116DFF"}}
                >
                    Learn more about creating an OAuth app
                </Link>
                .
            </Toast>
            {children}
        </ToastContext.Provider>
    );
}

// Custom hook to use the client context
export function useClient() {
    const context = useContext(ToastContext);
    if (context === null) {
        throw new Error("useClient must be used within a ClientProvider");
    }
    return context;
}
