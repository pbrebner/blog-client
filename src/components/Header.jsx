import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import icon from "../assets/icons/icon.svg";
import "./styles/Header.css";

function Header({ loggedIn, setLoggedIn }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.clear();
        setLoggedIn(false);
        setMenuOpen(false);
        navigate("/blog-client");
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    function toggleMenuOpen() {
        menuOpen === false ? setMenuOpen(true) : setMenuOpen(false);
    }

    if (loggedIn) {
        return (
            <>
                <header className="header">
                    <div className="headerInnerContainer">
                        <div className="headerMain">
                            <Link to="/blog-client">
                                <img
                                    src={icon}
                                    alt="Icon"
                                    className="headerIcon"
                                />
                            </Link>
                            <Link to="/blog-client" className="headerTitle">
                                Creative Umbrella
                            </Link>
                        </div>
                        <div className="nav">
                            <Link
                                to="/blog-client/posts/createpost"
                                className="navLink write"
                            >
                                Write
                            </Link>
                            <button
                                onClick={toggleMenuOpen}
                                className="menuBtn"
                            >
                                Menu
                            </button>
                        </div>
                        <div className={`menuTab ${menuOpen ? "display" : ""}`}>
                            <Link
                                to={`/blog-client/account/${localStorage.getItem(
                                    "userId"
                                )}`}
                                onClick={closeMenu}
                                className="menuLink"
                            >
                                Account
                            </Link>
                            <Link onClick={handleLogout} className="menuLink">
                                Sign out
                            </Link>
                        </div>
                    </div>
                    <div
                        className={`overlay ${menuOpen ? "display" : ""}`}
                        onClick={closeMenu}
                    ></div>
                </header>
            </>
        );
    } else {
        return (
            <header className="header">
                <div className="headerInnerContainer">
                    <div className="headerMain">
                        <Link to="/blog-client">
                            <img src={icon} alt="Icon" className="headerIcon" />
                        </Link>
                        <Link to="/blog-client" className="headerTitle">
                            Creative Umbrella
                        </Link>
                    </div>
                    <div className="nav">
                        <Link
                            to="/blog-client/account/login"
                            className="navLink signin"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/blog-client/account/signup"
                            className="navLink signup"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
