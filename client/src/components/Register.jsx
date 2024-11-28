import React, {useState} from "react";
import {useAuth} from "../components/AuthContext.jsx";
import Styles from "../styles/Register.module.css"

const Register = () => {
    const {serverIP, serverPORT} = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const response = await fetch(`http://${serverIP}:${serverPORT}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, email, password}),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <div className={Styles.container}>
            <div className={Styles.registerForm}>
                <div className={Styles.registerTitle}> Register </div>
                <input className={Styles.registerInput} type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <br/>
                <input className={Styles.registerInput} type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br/>
                <input className={Styles.registerInput} type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br/>
                <button className={Styles.registerButton} onClick={handleRegister}> Register </button>
            </div>
        </div>
    );
};

export default Register;
