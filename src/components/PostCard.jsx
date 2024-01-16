import { Link } from "react-router-dom";
import "./styles/PostCard.css";

import { formatDate } from "../utils/dates.js";

function PostCard({ post }) {
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
                    <p>{post.content}</p>
                </Link>
            </div>
        </>
    );
}

export default PostCard;
