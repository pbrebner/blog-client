import { useState, useEffect } from "react";
import {
    useParams,
    useNavigate,
    Link,
    useOutletContext,
} from "react-router-dom";

import Comment from "../components/Comment";
import Button from "../components/Button";
import Clap from "../components/Clap";
import PageLoader from "../components/PageLoader";
import { formatDate } from "../utils/dates";
import "./styles/Post.css";

function Post() {
    const [post, setPost] = useState(null);
    const [postLikes, setPostLikes] = useState(null);

    const [comments, setComments] = useState(null);
    const [numComments, setNumComments] = useState(0);
    const [newComment, setNewComment] = useState("");

    const [showLoader, setShowLoader] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [shake, setShake] = useState(false);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    const [loggedIn, setLoggedIn] = useOutletContext();
    const { postId } = useParams();
    const navigate = useNavigate();

    const user = localStorage.getItem("userId");

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
                    setPost(data);
                    setPostLikes(data.likes);
                    setError("");
                }
            } catch (err) {
                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                setError(err.message);
                setPost(null);
            }
        }
        getPost();
    }, [postLikes]);

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

                const data = await response.json();
                //console.log(data);

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
                    setComments(data);
                    setNumComments(data.length);
                    setError("");
                }
            } catch (err) {
                setError(err.message);
                setComments(null);
            }
        }
        getComments();
    }, [numComments]);

    async function handlePostLike(e) {
        let likes = postLikes + 1;
        setShake(true);
        setPostLikes(likes);

        setTimeout(() => {
            setShake(false);
        }, "800");

        const bodyData = JSON.stringify({
            likes: likes,
        });

        // Make request to update post likes
        try {
            const response = await fetch(
                `https://blog-api-test.fly.dev/api/posts/${post._id}`,
                {
                    method: "put",
                    body: bodyData,
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

            // Handle any errors
            if (response.status == 401) {
                setLoggedIn(false);
                navigate("/blog-client/account/login", {
                    state: {
                        message: "Please sign-in to perform this action.",
                    },
                });
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                setError("");
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleCommentSubmit(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        const formData = JSON.stringify({
            content: newComment,
        });

        // Make request to create new comment
        try {
            const response = await fetch(
                `https://blog-api-test.fly.dev/api/posts/${post._id}/comments`,
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
                setNewComment("");
                let val = numComments + 1;
                setNumComments(val);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    return (
        <div className="main postPage">
            {pageLoading && <PageLoader />}
            {error && (
                <div className="errorContainer">
                    There was problem handling your request. Please try again
                    later.
                </div>
            )}
            {post && (
                <div className="postMain">
                    <div className="postContainer">
                        <p className="title">{post.title}</p>
                        <div className="postDetails">
                            <div className="circularImage">
                                <img
                                    src={post.user.avatar}
                                    alt="avatar"
                                    className="avatar"
                                />
                            </div>
                            <div>
                                <Link
                                    to={`/blog-client/account/${post.user._id}`}
                                    className="author"
                                >
                                    {post.user.name}
                                </Link>
                                <p className="date">
                                    {formatDate(post.timeStamp)}
                                </p>
                            </div>
                        </div>
                        <div className="hl"></div>
                        {post.user._id == user ? (
                            <div className="postLikes">
                                <Clap shake={shake} /> ({postLikes})
                            </div>
                        ) : (
                            <button
                                className="postLikeBtn"
                                onClick={handlePostLike}
                            >
                                <Clap shake={shake} /> ({postLikes})
                            </button>
                        )}
                        <div className="hl"></div>
                        {post.image && (
                            <div className="postImageContainer">
                                <img
                                    src={post.image}
                                    alt="Post Image"
                                    className="postImage"
                                />
                            </div>
                        )}
                        <p className="content">{post.content}</p>
                    </div>
                    <div className="hl"></div>
                    <div className="commentsContainer">
                        <h3>Comments: ({numComments})</h3>
                        {comments && (
                            <div className="comments">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="commentOuterContainer"
                                        >
                                            <Comment
                                                postId={post._id}
                                                comment={comment}
                                                numComments={numComments}
                                                setNumComments={setNumComments}
                                                user={user}
                                                setLoggedIn={setLoggedIn}
                                            />
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
                        <form className="commentForm">
                            <div className="formElement">
                                <textarea
                                    name="content"
                                    id="content"
                                    cols="10"
                                    rows="5"
                                    placeholder="What are your thoughts?"
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    required
                                ></textarea>
                            </div>
                            <div className="formElement">
                                <Button
                                    text="Respond"
                                    onClick={handleCommentSubmit}
                                    loading={showLoader}
                                    disabled={showLoader}
                                />
                            </div>
                        </form>
                        {formError && (
                            <div className="formErrorContainer commentError">
                                <ul className="formErrorList">
                                    {formError.map((error, index) => (
                                        <li key={index} className="formError">
                                            {error.msg}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
