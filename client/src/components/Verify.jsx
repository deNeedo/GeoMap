import React, {useCallback, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useAuth} from "../components/AuthContext.jsx";
import Styles from "../styles/Verify.module.css"

const Verify = () => {
    const {serverIP, serverPORT} = useAuth();
    const [message, setMessage] = useState("");
    const location = useLocation();

    const handleVerifyEmail = useCallback(async(token) => {
        try {
            const response = await fetch(`http://${serverIP}:${serverPORT}/verify?token=${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.text();
            setMessage(data);
        } catch (error) {
            console.error("Error during email verification:", error);
            setMessage("Email verification failed.");
        }
    }, [serverIP, serverPORT]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");
        if (token) {
            handleVerifyEmail(token);
        } else {
            setMessage("No verification token provided.");
        }
    }, [location, handleVerifyEmail]);

    return (
        <div className={Styles.container}>
            <div className={Styles.messageBox}>
                <div className={Styles.messageTitle}> Email Verification </div>
                <div className={Styles.messageContent}> {message} </div>
            </div>
        </div>
    );
};

export default Verify;
