import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

function App() {
    let [loggedIn, setLoggedIn] = useState(false);

    return (
        <>
            <Header />
            <h1>This is the main App Page</h1>
            <Outlet />
            <Footer />
        </>
    );
}

export default App;
