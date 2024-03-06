import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import "./styles/FormPages.css";

function Signup() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [showLoader, setShowLoader] = useState(false);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            name: name,
            username: username,
            password: password,
            passwordConfirm: passwordConfirm,
        });

        try {
            const response = await fetch(
                "https://blog-api-test.fly.dev/api/users",
                {
                    method: "post",
                    body: formData,
                    headers: { "content-Type": "application/json" },
                }
            );

            const result = await response.json();
            //console.log(result);

            setShowLoader(false);

            if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                navigate("/blog-client/account/login");
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
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
            <h2>Sign-up</h2>
            <form className="pageForm">
                <div className="formElement">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                    <input
                        type="password"
                        name="passwordConfirm"
                        id="passwordConfirm"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div>
                <div className="formElement">
                    <Button
                        text="Sign up"
                        onClick={handleSubmit}
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
                {formError && (
                    <div className="formErrorContainer">
                        <ul className="formErrorList">
                            {formError.map((error, index) => (
                                <li key={index} className="formError">
                                    {error.msg}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>

            <p>
                Already have an account?{" "}
                <Link to="../login" className="formLink">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default Signup;
