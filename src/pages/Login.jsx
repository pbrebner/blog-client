import { useState } from "react";
import {
    Link,
    useNavigate,
    useOutletContext,
    useLocation,
} from "react-router-dom";

import Button from "../components/Button";
import "./styles/FormPages.css";

// TODO: Add action to form (url of API)

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showLoader, setShowLoader] = useState(false);

    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(e) {
        e.preventDefault();
        setShowLoader(true);

        const formData = JSON.stringify({
            username: username,
            password: password,
        });

        // Need to add a try/catch to handle errors
        const response = await fetch(
            "https://blog-api-test.fly.dev/api/login",
            {
                method: "post",
                body: formData,
                headers: { "content-Type": "application/json" },
            }
        );

        console.log(response);
        const data = await response.json();
        console.log(data);

        if (data.token) {
            // Save token to local storage and setLoggedInd
            localStorage.setItem("token", data.token);
            localStorage.setItem("userAuth", true);
            localStorage.setItem("name", data.body.name);
            localStorage.setItem("userId", data.body._id);
            setLoggedIn(true);
            setShowLoader(false);
            navigate("/");
        }
    }

    return (
        <div className="main formPage">
            <h2>Login Page</h2>
            {location.state && <div>{location.state.message}</div>}

            <form>
                <div className="formElement">
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="formElement">
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="formElement">
                    <Button
                        text="Log in"
                        onClick={handleSubmit}
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
            </form>
            <p>
                Don't have and account yet?{" "}
                <Link to="../signup" className="formLink">
                    Sign up now
                </Link>
            </p>
        </div>
    );
}

export default Login;
