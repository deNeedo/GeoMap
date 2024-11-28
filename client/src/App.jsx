import React from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import About from "./components/About.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import ServerRequest from "./components/ServerRequest.jsx";
import Verify from "./components/Verify.jsx";
import Styles from "./styles/App.module.css";
import RouteSelector from "./components/RouteSelector.jsx";

const App = () => {
    return (
        <BrowserRouter future={{v7_relativeSplatPath: true, v7_startTransition: true}}>
            <div className={Styles.container}>
                <div className={Styles.pageContent}>
                    <Routes>
                        <Route path="/" element={<RouteSelector children={[<Home key={0}/>, <Login key={1}/>]} />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<RouteSelector children={[<Home key={0}/>, <Login key={1}/>]} />} />
                        <Route path="/register" element={<RouteSelector children={[<Home key={0}/>, <Register key={1}/>]} />} />
                        <Route path="/verify" element={<RouteSelector children={[<Home key={0}/>, <Verify key={1}/>]} />} />
                        <Route path="*" element={<ServerRequest />} />
                    </Routes>
                </div>
                <div className={Styles.bottomMenu}>
                    <button className={Styles.bottomMenuButton}>
                        <Link to="/"> Home </Link>
                    </button>
                    <button className={Styles.bottomMenuButton}>
                        <Link to="/login"> Login </Link>
                    </button>
                    <button className={Styles.bottomMenuButton}>
                        <Link to="/register"> Register </Link>
                    </button>
                    <button className={Styles.bottomMenuButton}>
                        <Link to="/about"> About </Link>
                    </button>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
