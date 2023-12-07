import Nav from "./Nav";
import "./styles/Header.css";

function Header() {
    return (
        <div className="header">
            <div className="headerTitle">Blog</div>
            <Nav />
        </div>
    );
}

export default Header;
