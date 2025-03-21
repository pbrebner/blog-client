import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import Button from "../components/Button";
import PageLoader from "../components/PageLoader";
import "./styles/FormPages.css";

function EditPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [currentImage, setCurrentImage] = useState("");
    const [image, setImage] = useState("");

    const [showLoader, setShowLoader] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formError, setFormError] = useState("");
    const [loggedIn, setLoggedIn, setError] = useOutletContext();

    const { postId } = useParams();
    const userId = localStorage.getItem("userId");
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

                const data = await response.json();
                //console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                if (response.status == 401) {
                    setLoggedIn(false);
                    localStorage.clear();
                    navigate("/blog-client/account/login", {
                        state: {
                            message: "Please sign-in to access this content.",
                        },
                    });
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setTitle(data.post.title);
                    setContent(data.post.content);
                    setCurrentImage(data.post.image);
                    setError("");
                }
            } catch (err) {
                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                setError(err.message);
                setTitle("");
                setContent("");
            }
        }
        getPost();
    }, []);

    async function handlePublish(e) {
        e.preventDefault();

        let formData = {
            title: title,
            content: content,
            published: true,
        };

        handlePost(formData);
    }

    async function handleSave(e) {
        e.preventDefault();

        let formData = {
            title: title,
            content: content,
            published: false,
        };

        handlePost(formData);
    }

    async function addImage(formData) {
        // Get secure url from our server
        const accessUrlRequest = await fetch(
            "https://blog-api-test.fly.dev/api/s3Url",
            {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        const accessUrl = await accessUrlRequest.json();

        // post the image directly to the s3 bucket
        await fetch(accessUrl.url, {
            method: "put",
            body: image,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const imageUrl = accessUrl.url.split("?")[0];
        formData.image = imageUrl;

        return formData;
    }

    async function handlePost(formData) {
        setShowLoader(true);

        setFormError("");
        setError("");

        // Make request to save post
        try {
            if (image) {
                formData = await addImage(formData);
            }
            formData = JSON.stringify(formData);

            const response = await fetch(
                `https://blog-api-test.fly.dev/api/posts/${postId}`,
                {
                    method: "put",
                    body: formData,
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            //console.log(result);

            setShowLoader(false);

            // Handle any errors
            if (response.status == 401) {
                setLoggedIn(false);
                localStorage.clear();
                navigate("/blog-client/account/login", {
                    state: {
                        message: "Please sign-in to perform this action.",
                    },
                });
            } else if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                navigate(`/blog-client/account/${userId}`);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    return (
        <div className="main formPage">
            {pageLoading && <PageLoader />}
            <h2>Edit Post</h2>
            <form className="pageForm">
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
                    <Button
                        text="Publish"
                        onClick={handlePublish}
                        loading={showLoader}
                        disabled={showLoader}
                    />
                </div>
                <div className="formElement">
                    <Button
                        text="Save Draft"
                        onClick={handleSave}
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
        </div>
    );
}

export default EditPost;
