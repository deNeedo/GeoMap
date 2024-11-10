import React, {useEffect, useState} from "react";

const ServerRequest = () => {
    const [message, setMessage] = useState("");

    const fetchMessage = async () => {
        try {
            const response = await fetch(`http://10.147.17.201:8080${window.location.pathname}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setMessage(response.status);
        } catch (error) {
            setMessage(null);
        }
    };

    useEffect(() => {
        fetchMessage()
    }, [message]);

    if (message === null) {
        return <h1> An unexpected error occured </h1>
    } else {
        return <h1> {message} </h1>
    }
};

export default ServerRequest;
