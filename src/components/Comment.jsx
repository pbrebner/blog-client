import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import Button from "./Button";
import Clap from "./Clap";
import { formatDate } from "../utils/dates";
import "./styles/Comment.css";

function Comment({ postId, comment, numComments, setNumComments, user }) {
    const [commentLikes, setCommentLikes] = useState(comment.likes);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);
    const [shake, setShake] = useState(false);

    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useOutletContext();

    async function handleCommentLike(e) {
        let likes = commentLikes + 1;
        setShake(true);
        setCommentLikes(likes);

        setTimeout(() => {
            setShake(false);
        }, "800");

        setError("");

        const bodyData = JSON.stringify({
            likes: likes,
        });

        // Make request to update comment likes
        try {
            const response = await fetch(
                `https://blog-api-test.fly.dev/api/posts/${postId}/comments/${comment._id}`,
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
            }
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleCommentDelete(e) {
        e.preventDefault();
        setShowLoader(true);

        setError("");

        // Make request to delete comment
        try {
            const response = await fetch(
                `https://blog-api-test.fly.dev/api/posts/${postId}/comments/${comment._id}`,
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
                let val = numComments - 1;
                setNumComments(val);
            }
        } catch (err) {
            setError(err.message);
            setShowLoader(false);
        }
    }

    function toggleCommentDelete() {
        setError("");
        confirmDeleteOpen === true
            ? setConfirmDeleteOpen(false)
            : setConfirmDeleteOpen(true);
    }

    return (
        <div className="comment">
            <div className="commentHeader">
                <div className="circularImage">
                    <img
                        src={comment.user.avatar}
                        alt="avatar"
                        className="avatar"
                    />
                </div>
                <div>
                    <Link
                        to={`/blog-client/account/${comment.user._id}`}
                        className="userLink"
                    >
                        {comment.user.name}
                    </Link>
                    <p>{formatDate(comment.timeStamp)}</p>
                </div>
            </div>
            <div className="commentContent">{comment.content}</div>
            <div className="commentBtns">
                {comment.user._id == user ? (
                    <div className="commentLikes">
                        <Clap shake={shake} /> ({commentLikes})
                    </div>
                ) : (
                    <button
                        className="commentLikeBtn"
                        onClick={handleCommentLike}
                    >
                        <Clap shake={shake} /> ({commentLikes})
                    </button>
                )}
                {user == comment.user._id && (
                    <div>
                        <button
                            className={`commentDeleteBtn commentBtn ${
                                confirmDeleteOpen ? "" : "display"
                            }`}
                            onClick={toggleCommentDelete}
                        >
                            Delete
                        </button>
                        <div
                            className={`commentDeleteConfirm ${
                                confirmDeleteOpen ? "display" : ""
                            }`}
                        >
                            <Button
                                styleRef="commentDeleteConfirmBtn commentBtn"
                                text="Confirm"
                                onClick={handleCommentDelete}
                                loading={showLoader}
                                disabled={showLoader}
                            />
                            <button
                                className="commentDeleteCancelBtn commentBtn"
                                onClick={toggleCommentDelete}
                                disabled={showLoader}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {error && (
                <div className="commentError">
                    There was a problem handling your request. Please try again
                    later.
                </div>
            )}
        </div>
    );
}

export default Comment;
