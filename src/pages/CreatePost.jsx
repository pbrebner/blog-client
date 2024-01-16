import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./styles/FormPages.css";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    async function handlePublish(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            title: title,
            content: content,
            published: true,
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

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            navigate("/");
        }
    }

    async function handleSave(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            title: title,
            content: content,
            published: false,
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

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            navigate("/");
        }
    }

    return (
        <div className="main formPage">
            <h2>Create Post Page</h2>

            <form>
                <div className="formElement">
                    <label htmlFor="title">Title: </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="formElement">
                    <label htmlFor="content">Content: </label>
                    <textarea
                        name="content"
                        id="content"
                        cols="30"
                        rows="30"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="formElement">
                    <button className="submitBtn" onClick={handlePublish}>
                        Publish
                    </button>
                </div>
                <div className="formElement">
                    <button className="submitBtn" onClick={handleSave}>
                        Save
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
