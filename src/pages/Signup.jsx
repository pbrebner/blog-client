import { useState, useEffect } from "react";

// TODO: Add action to form (url of API)

function Signup() {
    return (
        <div className="main">
            <h2>Login Page</h2>

            <form action="" method="post">
                <div className="formElement">
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" id="username" required />
                </div>
                <div className="formElement">
                    <label htmlFor="password">Password: </label>
                    <input type="text" name="password" id="password" required />
                </div>
                <div className="formElement">
                    <button type="submit">Log in</button>
                </div>
            </form>
            <p>
                Don't have and account yet? <a href="../signup">Sign up now</a>
            </p>
        </div>
    );
}

export default Signup;
