import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/dates";
import "./styles/Comment.css";

function Comment({ postId, comment, numComments, setNumComments, user }) {
    const [commentLikes, setCommentLikes] = useState(comment.likes);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    async function handleCommentLike(e) {
        const bodyData = JSON.stringify({
            likes: commentLikes + 1,
        });

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postId}/comments/${comment._id}`,
            {
                method: "put",
                body: bodyData,
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
            let val = commentLikes + 1;
            setCommentLikes(val);
        }
    }

    async function handleCommentDelete(e) {
        e.preventDefault();

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postId}/comments/${comment._id}`,
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
            let val = numComments - 1;
            setNumComments(val);
        }
    }

    function toggleCommentDelete() {
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
                        to={`/account/${comment.user._id}`}
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
                    <div className="commentLikes">Likes ({commentLikes})</div>
                ) : (
                    <button
                        className="commentLikeBtn"
                        onClick={handleCommentLike}
                    >
                        Like ({commentLikes})
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
                            <button
                                className="commentDeleteConfirmBtn commentBtn"
                                onClick={handleCommentDelete}
                            >
                                Confirm
                            </button>
                            <button
                                className="commentDeleteCancelBtn commentBtn"
                                onClick={toggleCommentDelete}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;
