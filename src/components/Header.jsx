import { Link } from "react-router-dom";
import "./styles/Header.css";

function Header() {
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

export default Header;
