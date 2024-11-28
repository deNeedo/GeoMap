import React, {useState} from "react";
import {useAuth} from "./AuthContext";
import Styles from "../styles/Login.module.css"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();

    const handleLogin = async () => {
        try {
            const response = await fetch(`http://10.147.17.201:8080/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, password}),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.text();
            if (data !== "") {login(data);}
            else {console.log("Login failure");}
        } catch (error) {
            console.error("Unexpected error during login: ", error);
        }
    };

    return (
        <div className={Styles.container}>
            <div className={Styles.loginForm}>
                <div className={Styles.loginTitle}> Login </div>
                <input className={Styles.loginInput} type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <br/>
                <input className={Styles.loginInput} type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br/>
                <button className={Styles.loginButton} onClick={handleLogin}> Log In </button>
            </div>
        </div>
    );
}

export default Login
