import React from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import MapView from "./components/MapView.jsx";
import ServerRequest from "./components/ServerRequest.jsx";
import Styles from "./styles/App.module.css";

const App = () => {
    return (
        <BrowserRouter>
            <div className={Styles.mainContainer}>
                <div className={Styles.sideMenu}>
                    <ul>
                        <li> <Link to="/"> Home </Link> </li>
                        <li> <Link to="/about"> About </Link> </li>
                        <li> <Link to="/map"> Map View </Link> </li>
                    </ul>
                </div>
                <div className={Styles.pageContent}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/map" element={<MapView />} />
                        <Route path="/*" element={<ServerRequest />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;