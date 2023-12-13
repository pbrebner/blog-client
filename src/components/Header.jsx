import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./styles/Header.css";

function Header({ loggedIn, setLoggedIn }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.clear();
        setLoggedIn(false);
        navigate("/");
    }

    if (loggedIn) {
        return (
            <header className="header">
                <Link to="/" className="headerTitle">
                    Blog
                </Link>
                <div className="navLinks">
                    <Link
                        to={`/account/${localStorage.getItem("userId")}`}
                        className="navLink"
                    >
                        Account
                    </Link>
                    <Link onClick={handleLogout} className="navLink">
                        Log out
                    </Link>
                </div>
            </header>
        );
    } else {
        return (
            <header className="header">
                <Link to="/" className="headerTitle">
                    Blog
                </Link>
                <Link to="/account/login" className="navLink">
                    Log in
                </Link>
            </header>
        );
    }
}

export default Header;
