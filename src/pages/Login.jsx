import { useState } from "react";
import {
    Link,
    useNavigate,
    useOutletContext,
    useLocation,
} from "react-router-dom";

import Button from "../components/Button";
import "./styles/FormPages.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");

    const [loggedIn, setLoggedIn, setError] = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogin(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            username: username,
            password: password,
        });

        login(formData);
    }

    function handleGuestLogin(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            username: "jimsmith@example.com",
            password: "userPassword",
        });

        login(formData);
    }

    async function login(formData) {
        setShowLoader(true);

        setFormError("");
        setError("");

        try {
            const response = await fetch(
                "https://blog-api-test.fly.dev/api/login",
                {
                    method: "post",
                    body: formData,
                    headers: { "content-Type": "application/json" },
                }
            );

            const result = await response.json();
            setShowLoader(false);

            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else if (result.token) {
                // Save token to local storage and setLoggedInd
                localStorage.setItem("token", result.token);
                localStorage.setItem("userAuth", true);
                localStorage.setItem("name", result.body.name);
                localStorage.setItem("userId", result.body._id);

                setLoggedIn(true);
                navigate("/blog-client");
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    return (
        <div className="main formPage">
            <h2>Login</h2>
            {location.state && <div>{location.state.message}</div>}
            <form className="pageForm">
                <div className="formElement">
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div className="formElement">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="formElement">
                    <Button
                        text="Log In"
                        onClick={handleLogin}
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
                <div className="formElement">
                    <Button
                        text="Guest Log In"
                        onClick={handleGuestLogin}
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
                {formError && (
                    <div className="formErrorContainer">
                        <ul className="formErrorList">
                            <li className="formError">{formError}</li>
                        </ul>
                    </div>
                )}
            </form>
            <p>
                Don't have an account yet?{" "}
                <Link to="../signup" className="formLink">
                    Sign-up
                </Link>
            </p>
        </div>
    );
}

export default Login;
