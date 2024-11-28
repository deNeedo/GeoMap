import React from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import About from "./components/About.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import NotFound from "./components/NotFound.jsx";
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
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <div className={Styles.bottomMenu}>
                    <Link className={Styles.bottomMenuLink} to="/"> <button className={Styles.bottomMenuButton}> Home </button> </Link>
                    <Link className={Styles.bottomMenuLink} to="/login"> <button className={Styles.bottomMenuButton}> Login </button> </Link>
                    <Link className={Styles.bottomMenuLink} to="/register"> <button className={Styles.bottomMenuButton}> Register </button> </Link>
                    <Link className={Styles.bottomMenuLink} to="/about"> <button className={Styles.bottomMenuButton}> About </button> </Link>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
