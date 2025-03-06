import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/Header.jsx";
import AppError from "./components/AppError";
import Footer from "./components/Footer.jsx";
import "./App.css";

function App() {
    let [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState("");

    // Initially checks if logged in when page is refreshed
    useEffect(() => {
        setLoggedIn(localStorage.getItem("userAuth") || false);
    }, []);

    return (
        <div className="app">
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            {error && <AppError error={error} />}
            <Outlet context={[loggedIn, setLoggedIn, setError]} />
            <Footer />
        </div>
    );
}

export default App;
