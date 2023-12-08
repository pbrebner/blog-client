import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// TODO: Add action to form (url of API)
function Signup() {
    return (
        <div className="main">
            <h2>Sign-up Page</h2>

            <form action="" method="post">
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
                    <input type="text" name="password" id="password" required />
                </div>
                <div className="formElement">
                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input
                        type="text"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                    />
                </div>
                <div className="formElement">
                    <button type="submit">Sign up</button>
                </div>
            </form>
            <p>
                Already have an account? <Link to="../login">Login</Link>
            </p>
        </div>
    );
}

export default Signup;
