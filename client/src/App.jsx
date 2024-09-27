import React from "react";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import NotFound from "./components/NotFound.jsx";
import "./styles/App.css";

const App = () => {
    return (
        <BrowserRouter>
            <nav>
                <ul>
                    <li>
                        <Link to="/"> Home </Link>
                    </li>
                    <li>
                        <Link to="/about"> About </Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;