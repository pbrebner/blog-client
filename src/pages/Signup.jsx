import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./styles/FormPages.css";

// TODO: Add action to form (url of API)
function Signup() {
    // Could setState for all form inputs and update on form change

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            name: e.target.name.value,
            username: e.target.username.value,
            password: e.target.password.value,
            passwordConfirm: e.target.passwordConfirm.value,
        });

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            "https://blog-api-test.fly.dev/api/users",
            {
                method: "post",
                body: formData,
                headers: { "content-Type": "application/json" },
            }
        );

        console.log(response);

        const result = await response.json();
        console.log("Results:");
        console.log(result);

        if (response.ok) {
            navigate("/accounts/login");
        }
    }

    return (
        <div className="main formPage">
            <h2>Sign-up Page</h2>

            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="passwordConfirm">Confirm Password: </label>
                    <input
                        type="password"
                        name="passwordConfirm"
                        id="passwordConfirm"
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
