import React from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import About from "./components/About.jsx";
import Auth from "./components/Auth.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx"
import Logout from "./components/Logout.jsx";
import MapView from "./components/MapView.jsx";
import Register from "./components/Register.jsx"
import ServerRequest from "./components/ServerRequest.jsx";
import Styles from "./styles/App.module.css";
import PrivateRoute from "./components/PrivateRoute.jsx";

const App = () => {
    return (
        <BrowserRouter future={{v7_relativeSplatPath: true, v7_startTransition: true}}>
            <div className={Styles.mainContainer}>
                <div className={Styles.sideMenu}>
                    <ul>
                        <li> <Link to="/"> Home </Link> </li>
                        <li> <Link to="/login"> Login </Link> </li>
                        <li> <Link to="/logout"> Logout </Link> </li>
                        <li> <Link to="/register"> Register </Link> </li>
                        <li> <Link to="/about"> About </Link> </li>
                        <li> <Link to="/map"> Map View </Link> </li>
                    </ul>
                </div>
                <div className={Styles.pageContent}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<PrivateRoute children={<Logout />} />} />
                        <Route path="/map" element={<PrivateRoute children={<MapView />} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify" element={<Auth />} />
                        <Route path="*" element={<ServerRequest />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
