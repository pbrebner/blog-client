import { Link } from "react-router-dom";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";

import "./styles/FormPages.css";

// TODO: Add action to form (url of API)

function Login() {
    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
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
            navigate("/");
        }
    }

    return (
        <div className="main formPage">
            <h2>Login Page</h2>
            {location.state && <div>{location.state.message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="formElement">
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" id="username" required />
                </div>
                <div className="formElement">
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                    />
                </div>
                <div className="formElement">
                    <button type="submit" className="submitBtn">
                        Log in
                    </button>
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
