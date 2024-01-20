import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./styles/FormPages.css";

function EditPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [image, setImage] = useState("");

    const [error, setError] = useState(null);

    const { postId } = useParams();

    const navigate = useNavigate();

    // Fetch the post and display contents
    useEffect(() => {
        async function getPost() {
            try {
                const response = await fetch(
                    `https://blog-api-test.fly.dev/api/posts/${postId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setTitle(data.title);
                setContent(data.content);
                setCurrentImage(data.image);

                setError(null);
            } catch (err) {
                setError(err.message);
                setTitle("");
                setContent("");
            }
        }
        getPost();
    }, []);

    async function getFormData() {
        if (image) {
            const file = image;

            // Get secure url from our server
            const accessUrlRequest = await fetch(
                "https://blog-api-test.fly.dev/api/s3Url",
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const accessUrl = await accessUrlRequest.json();
            console.log(accessUrl.url);

            // post the image directly to the s3 bucket
            await fetch(accessUrl.url, {
                method: "put",
                body: file,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = accessUrl.url.split("?")[0];
            console.log(imageUrl);

            // Set form data for request to server
            let formData = {
                title: title,
                content: content,
                image: imageUrl,
            };
            return formData;
        } else {
            let formData = {
                title: title,
                content: content,
            };
            return formData;
        }
    }

    async function handlePublish(e) {
        e.preventDefault();

        let formData = await getFormData();
        formData.published = true;

        formData = JSON.stringify(formData);

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postId}`,
            {
                method: "put",
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

        let formData = await getFormData();
        formData.published = false;

        formData = JSON.stringify(formData);

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postId}`,
            {
                method: "put",
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
            <h2>Edit Post Page</h2>

            <form>
                <div className="formElement">
                    <label htmlFor="image">Post Image: </label>
                    <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        file={image}
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
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
        </div>
    );
}

export default EditPost;
