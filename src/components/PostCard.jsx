import { Link } from "react-router-dom";
import "./styles/PostCard.css";

import { formatDate } from "../utils/dates.js";

function PostCard({ post }) {
    return (
        <Link to={`/posts/${post._id}`} className="postCard">
            <div className="postCardHeader">
                {post.user.name && (
                    <Link to={`/account/${post.user._id}`} className="userLink">
                        {post.user.name}
                    </Link>
                )}
                <p>{formatDate(post.timeStamp)}</p>
            </div>
            <div className="postCardContent">
                <h4 className="postCardTitle">{post.title}</h4>
                <div>{post.content}</div>
            </div>
        </Link>
    );
}

export default PostCard;
