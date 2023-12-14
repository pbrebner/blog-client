import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./styles/FormPages.css";

// TODO: Add action to form (url of API)
function CreatePost() {
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            title: e.target.title.value,
            content: e.target.content.value,
        });

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            "https://blog-api-test.fly.dev/api/posts",
            {
                method: "post",
                body: formData,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        console.log(response);

        const result = await response.json();
        console.log("Results:");
        console.log(result);

        if (response.ok) {
            navigate("/");
        }
    }

    return (
        <div className="main formPage">
            <h2>Create Post Page</h2>

            <form onSubmit={handleSubmit}>
                <div className="formElement">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" id="title" required />
                </div>
                <div className="formElement">
                    <label htmlFor="content">Content: </label>
                    <textarea
                        name="content"
                        id="content"
                        cols="30"
                        rows="30"
                        required
                    ></textarea>
                </div>
                <div className="formElement">
                    <button type="submit" className="submitBtn">
                        Publish
                    </button>
                </div>
            </form>
            <p>
                Back to <Link to="/">Home</Link>
            </p>
        </div>
    );
}

export default CreatePost;
