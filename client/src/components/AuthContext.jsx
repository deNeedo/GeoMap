import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

    const serverIP = process.env.REACT_APP_SERVER_IP;
    const serverPORT = process.env.REACT_APP_SERVER_PORT;

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
    };

    return (
        <AuthContext.Provider value={{authToken, login, logout, serverIP, serverPORT}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};