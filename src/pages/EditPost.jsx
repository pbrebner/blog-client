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
    const [error, setError] = useState("");

    const [loggedIn, setLoggedIn] = useOutletContext();
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

                const data = await response.json();
                //console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                if (response.status == 401) {
                    setLoggedIn(false);
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
                    setTitle(data.title);
                    setContent(data.content);
                    setCurrentImage(data.image);
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

            // post the image directly to the s3 bucket
            await fetch(accessUrl.url, {
                method: "put",
                body: file,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = accessUrl.url.split("?")[0];

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
        setShowLoader(true);

        setFormError("");
        setError("");

        let formData = await getFormData();
        formData.published = true;

        formData = JSON.stringify(formData);

        // Make request to Publish post
        try {
            const response = await fetch(
                "https://blog-api-test.fly.dev/api/posts",
                {
                    method: "post",
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
                navigate("/blog-client");
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        let formData = await getFormData();
        formData.published = false;

        formData = JSON.stringify(formData);

        // Make request to save post
        try {
            const response = await fetch(
                "https://blog-api-test.fly.dev/api/posts",
                {
                    method: "post",
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
                navigate("/blog-client");
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    return (
        <div className="main formPage">
            {pageLoading && <PageLoader />}
            {error && (
                <div className="errorContainer">
                    There was problem handling your request. Please try again
                    later.
                </div>
            )}
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
