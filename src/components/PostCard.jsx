import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import Button from "../components/Button";
import "./styles/PostCard.css";
import { formatDate } from "../utils/dates.js";

function PostCard({ post, numPosts, setNumPosts, usersProfile, drafts }) {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useOutletContext();
    const navigate = useNavigate();

    async function handleDeletePostSubmit(postId) {
        setShowLoader(true);
        setError("");

        try {
            const response = await fetch(
                `https://blog-api-test.fly.dev/api/posts/${postId}`,
                {
                    method: "delete",
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

            if (response.status == 401) {
                setLoggedIn(false);
                localStorage.clear();
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
                let val = numPosts - 1;
                setNumPosts(val);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    function togglePostDelete() {
        setError("");
        confirmDeleteOpen === true
            ? setConfirmDeleteOpen(false)
            : setConfirmDeleteOpen(true);
    }

    function handlePostEditBtn(postId) {
        navigate(`/blog-client/posts/${postId}/edit`);
    }

    return (
        <>
            <div className="postCard">
                <div className="postCardHeader">
                    {post.user.avatar && (
                        <div className="circularImage">
                            <img
                                src={post.user.avatar}
                                alt="avatar"
                                className="avatar"
                            />
                        </div>
                    )}
                    {post.user.name && (
                        <Link
                            to={`/blog-client/account/${post.user._id}`}
                            className="userLink"
                        >
                            {post.user.name}
                        </Link>
                    )}
                    <p>{formatDate(post.timeStamp)}</p>
                </div>
                <div className="postCardMain">
                    <Link
                        to={`/blog-client/posts/${post._id}`}
                        className="postCardLink"
                    >
                        <div className="postCardContent">
                            <h4 className="postCardTitle">{post.title}</h4>
                            <p>{post.content}</p>
                        </div>
                    </Link>
                    {post.image && (
                        <Link
                            to={`/blog-client/posts/${post._id}`}
                            className="postCardLink"
                        >
                            <div className="postCardImageContainer">
                                <img
                                    src={post.image}
                                    alt="Post Image"
                                    className="postCardImage"
                                />
                            </div>
                        </Link>
                    )}
                </div>
                {usersProfile && (
                    <div className="postBtns">
                        <button
                            onClick={togglePostDelete}
                            className={`postDeleteBtn postBtn ${
                                confirmDeleteOpen ? "" : "display"
                            }`}
                        >
                            Delete
                        </button>
                        <div
                            className={`postDeleteConfirm ${
                                confirmDeleteOpen ? "display" : ""
                            }`}
                        >
                            <Button
                                styleRef="postDeleteConfirmBtn postBtn"
                                text="Confirm"
                                onClick={() => handleDeletePostSubmit(post._id)}
                                loading={showLoader}
                                disabled={showLoader}
                            />
                            <button
                                className="postDeleteCancelBtn postBtn"
                                onClick={togglePostDelete}
                                disabled={showLoader}
                            >
                                Cancel
                            </button>
                        </div>
                        {drafts && (
                            <button
                                className="postEditBtn postBtn"
                                onClick={() => handlePostEditBtn(post._id)}
                                disabled={showLoader}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                )}
                {error && (
                    <div className="postCardError">
                        There was a problem handling your request. Please try
                        again later.
                    </div>
                )}
            </div>
        </>
    );
}

export default PostCard;
