import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import "./styles/PostCard.css";
import { formatDate } from "../utils/dates.js";

function PostCard({ post, numPosts, setNumPosts, usersProfile, drafts }) {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    async function handleDeletePostSubmit(postId) {
        setShowLoader(true);

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postId}`,
            {
                method: "delete",
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
            let val = numPosts - 1;
            setNumPosts(val);
            setShowLoader(false);
        }
    }

    function togglePostDelete() {
        confirmDeleteOpen === true
            ? setConfirmDeleteOpen(false)
            : setConfirmDeleteOpen(true);
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
                            to={`/account/${post.user._id}`}
                            className="userLink"
                        >
                            {post.user.name}
                        </Link>
                    )}
                    <p>{formatDate(post.timeStamp)}</p>
                </div>
                <div className="postCardMain">
                    <Link to={`/posts/${post._id}`} className="postCardLink">
                        <div className="postCardContent">
                            <h4 className="postCardTitle">{post.title}</h4>
                            <p>{post.content}</p>
                        </div>
                    </Link>
                    {post.image && (
                        <Link
                            to={`/posts/${post._id}`}
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
                            <Link
                                to={`/posts/${post._id}/edit`}
                                className="editPostLink"
                                disabled={showLoader}
                            >
                                Edit
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default PostCard;
