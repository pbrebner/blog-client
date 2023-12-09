import { Link } from "react-router-dom";

import "./styles/FormPages.css";

// TODO: Add action to form (url of API)
function Signup() {
    return (
        <div className="main formPage">
            <h2>Sign-up Page</h2>

            <form action="https://blog-api-test.fly.dev/users" method="post">
                <div className="formElement">
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" id="name" required />
                </div>
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
                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                    />
                </div>
                <div className="formElement">
                    <button type="submit" className="submitBtn">
                        Sign up
                    </button>
                </div>
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
