import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/dates";
import "./styles/Comment.css";

function Comment({ postID, comment, numComments, setNumComments, user }) {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    async function handleCommentDelete(e) {
        e.preventDefault();

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postID}/comments/${comment._id}`,
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
                <Link to={`/account/${comment.user._id}`} className="userLink">
                    {comment.user.name}
                </Link>
                <p>{formatDate(comment.timeStamp)}</p>
            </div>
            <div className="commentContent">{comment.content}</div>
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
    );
}

export default Comment;
