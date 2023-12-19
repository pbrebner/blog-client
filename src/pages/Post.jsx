import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Comment from "../components/Comment";
import { formatDate } from "../utils/dates";
import "./styles/Post.css";

function Post() {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);
    const [numComments, setNumComments] = useState(0);
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

                if (response.status == "403") {
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
                console.log(data);
                setPost(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setPost(null);
            }
        }
        getPost();
    }, []);

    // Fetch the comments and display contents
    useEffect(() => {
        async function getComments() {
            try {
                const response = await fetch(
                    `https://blog-api-test.fly.dev/api/posts/${postId}/comments`,
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

                setComments(data);
                setNumComments(data.length);
                setError(null);
            } catch (err) {
                setError(err.message);
                setComments(null);
            }
        }
        getComments();
    }, [numComments]);

    async function handleCommentSubmit(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            content: e.target.content.value,
        });

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${post._id}/comments`,
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
        console.log(result);

        if (response.ok) {
            e.target.content.value = "";
            let val = numComments + 1;
            setNumComments(val);
        }
    }

    return (
        <div className="main postPage">
            {error && (
                <div className="errorContainer">
                    There was problem fetching the data from the server. Please
                    try again later
                </div>
            )}
            {post && (
                <div className="postMain">
                    <div className="postContainer">
                        <p className="title">{post.title}</p>
                        <div className="postDetails">
                            <Link
                                to={`/account/${post.user._id}`}
                                className="author"
                            >
                                {post.user.name}
                            </Link>
                            <p className="date">{formatDate(post.timeStamp)}</p>
                        </div>
                        <div className="hl"></div>
                        <p className="content">{post.content}</p>
                    </div>
                    <div className="hl"></div>
                    <div className="commentsContainer">
                        <h3>Comments:</h3>
                        {comments && (
                            <div className="comments">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="commentOuterContainer"
                                        >
                                            <Comment comment={comment} />
                                            <div className="hl"></div>
                                        </div>
                                    ))
                                ) : (
                                    <p>
                                        There are no comments on this post yet.
                                    </p>
                                )}
                            </div>
                        )}
                        <form
                            onSubmit={handleCommentSubmit}
                            className="commentForm"
                        >
                            <div className="formElement">
                                <textarea
                                    name="content"
                                    id="content"
                                    cols="10"
                                    rows="5"
                                    placeholder="What are your thoughts?"
                                    required
                                ></textarea>
                            </div>
                            <div className="formElement">
                                <button type="submit" className="submitBtn">
                                    Respond
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
