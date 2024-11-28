import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Styles from "../styles/Verify.module.css"

const Verify = () => {
    const [message, setMessage] = useState("");
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");
        if (token) {
            handleVerifyEmail(token);
        } else {
            setMessage("No verification token provided.");
        }
    }, [location]);

    const handleVerifyEmail = async (token) => {
        try {
            const response = await fetch(`http://10.147.17.201:8080/verify?token=${token}`, {
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
    };

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
