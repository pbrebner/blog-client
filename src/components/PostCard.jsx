import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/PostCard.css";

import { formatDate } from "../utils/dates.js";

function PostCard({ post, usersProfile, deletePostOpen, setDeletePostOpen }) {
    //const [deletePostOpen, setDeletePostOpen] = useState(false);

    async function handleDeletePostSubmit(e) {
        e.preventDefault();

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${post._id}`,
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
            setDeletePostOpen(false);
        }
    }

    function closeModal() {
        setDeletePostOpen(false);
    }

    function toggleDeletePostOpen() {
        deletePostOpen === false
            ? setDeletePostOpen(true)
            : setDeletePostOpen(false);
    }

    return (
        <>
            <div className="postCard">
                <div className="postCardHeader">
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
                <Link to={`/posts/${post._id}`} className="postCardContent">
                    <h4 className="postCardTitle">{post.title}</h4>
                    <div>{post.content}</div>
                </Link>
                {usersProfile && (
                    <button
                        onClick={toggleDeletePostOpen}
                        className="deletePostBtn"
                    >
                        Delete
                    </button>
                )}
            </div>
            {usersProfile && (
                <div
                    className={`deletePostModal ${
                        deletePostOpen ? "display" : ""
                    }`}
                >
                    <button onClick={closeModal} className="closeModalBtn">
                        &#10005;
                    </button>
                    <div className="postModalContent">
                        <h2 className="postModalHeader">Delete Post</h2>
                        <p>
                            Deletion is not reversible, and the post will be
                            completely deleted.
                        </p>
                        <button
                            onClick={handleDeletePostSubmit}
                            className="deletePostConfirm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default PostCard;
