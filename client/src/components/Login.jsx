import React, {useState} from "react";
import {useAuth} from "./AuthContext";

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
            const data = await response.text(); login(data);
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <>
            <div>
                <h2> Login </h2>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button onClick={handleLogin}> Log In </button>
            </div>
        </>
    );
}

export default Login
