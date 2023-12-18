import { Link } from "react-router-dom";
import { formatDate } from "../utils/dates";
import "./styles/Comment.css";

function Comment({ comment }) {
    return (
        <div className="comment">
            <div className="commentHeader">
                <Link to={`/account/${comment.user._id}`} className="userLink">
                    {comment.user.name}
                </Link>
                <p>{formatDate(comment.timeStamp)}</p>
            </div>
            <div className="commentContent">{comment.content}</div>
        </div>
    );
}

export default Comment;
