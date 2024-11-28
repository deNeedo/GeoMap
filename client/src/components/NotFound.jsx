import React from "react";
import Styles from "../styles/NotFound.module.css"

const NotFound = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.messageBox}>
                <div className={Styles.message}> 404 - Not Found </div>    
            </div>
        </div>
    )
};

export default NotFound;
