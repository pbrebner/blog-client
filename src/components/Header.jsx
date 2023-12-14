import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./styles/Header.css";

function Header({ loggedIn, setLoggedIn }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.clear();
        setLoggedIn(false);
        setMenuOpen(false);
        navigate("/");
    }

    function handleMenuClick() {
        setMenuOpen(false);
    }

    function toggleMenuOpen() {
        isMenuOpen === false ? setMenuOpen(true) : setMenuOpen(false);
    }

    if (loggedIn) {
        return (
            <>
                <header className="header">
                    <Link to="/" className="headerTitle">
                        Little Things Everyday
                    </Link>
                    <div className="nav">
                        <Link to="/posts/createpost" className="navLink write">
                            Write
                        </Link>
                        <button onClick={toggleMenuOpen} className="menuBtn">
                            Menu
                        </button>
                    </div>
                </header>
                <div className={`menuTab ${isMenuOpen ? "display" : ""}`}>
                    <Link
                        to={`/account/${localStorage.getItem("userId")}`}
                        onClick={handleMenuClick}
                        className="menuLink"
                    >
                        Account
                    </Link>
                    <Link onClick={handleLogout} className="menuLink">
                        Sign out
                    </Link>
                </div>
            </>
        );
    } else {
        return (
            <header className="header">
                <Link to="/" className="headerTitle">
                    Little Things Everyday
                </Link>
                <div className="nav">
                    <Link to="/account/login" className="navLink signin">
                        Sign in
                    </Link>
                    <Link to="/account/signup" className="navLink signup">
                        Sign up
                    </Link>
                </div>
            </header>
        );
    }
}

export default Header;
