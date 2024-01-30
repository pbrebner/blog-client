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
    const [error, setError] = useState("");

    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            username: username,
            password: password,
        });

        // Need to add a try/catch to handle errors
        try {
            const response = await fetch(
                "https://blog-api-test.fly.dev/api/login",
                {
                    method: "post",
                    body: formData,
                    headers: { "content-Type": "application/json" },
                }
            );

            console.log(response);
            const result = await response.json();
            console.log(result);

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
        }
    }

    return (
        <div className="main formPage">
            {error && (
                <div className="errorContainer">
                    There was problem handling your request. Please try again
                    later.
                </div>
            )}
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
                        required
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
