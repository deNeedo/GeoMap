import React from 'react';
import {useAuth} from './AuthContext';

const Logout = () => {
    const {authToken, logout} = useAuth();
    
    const handleLogout = async () => {
        try {
            await fetch(`http://10.147.17.201:8080/logout1`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Auth-Token": authToken
                }
            });
            logout()
        } catch (error) {
            console.error("Unexpected error during logout: ", error);
        }
    };

    return <button onClick={handleLogout}> Logout </button>;
};

export default Logout;