import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./styles/Post.css";

function Post() {
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    const { postId } = useParams();
    const navigate = useNavigate();

    // Fetch the post and display contents
    useEffect(() => {
        async function getPost() {
            try {
                const response = await fetch(
                    `https://blog-api-test.fly.dev/api/posts/${postId}`
                );

                if (response.status == "401") {
                    navigate("/account/login", {
                        state: {
                            message: "Please signin to access blog posts",
                        },
                    });
                }

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                setPost(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setPost(null);
            }
        }
        getPost();
    }, []);

    return (
        <div className="main postPage">
            {error && (
                <div className="errorContainer">
                    There was problem fetching the data from the server. Please
                    try again later
                </div>
            )}
            {post && (
                <div className="postContainer">
                    <p className="title">{post.title}</p>
                    <p className="content">{post.content}</p>
                </div>
            )}
        </div>
    );
}

export default Post;
