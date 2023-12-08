import { Link } from "react-router-dom";
import "./styles/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footerLeftCol span2Row">
                <h3>Get in the know</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Numquam quo odio nostrum mollitia ratione beatae laboriosam
                    culpa nesciunt repellat deleniti deserunt dolorem, eligendi
                    voluptates id, vero amet molestiae eveniet quia.
                </p>
            </div>
            <div className="footerRightCol">
                <div>
                    <h4>About</h4>
                    <a href="">About Us</a>
                    <a href="">Our Vision</a>
                </div>
                <div>
                    <h4>Contact Us</h4>
                    <a href="">Advertise</a>
                    <a href="">Email</a>
                </div>
            </div>
            <div className="acknowledgements">
                <hr />
                <p>Developed by Patrick Brebner</p>
            </div>
        </footer>
    );
}

export default Footer;
