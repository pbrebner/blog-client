import { Link } from "react-router-dom";
import "./styles/PostCard.css";

function PostCard({ post }) {
    return (
        <Link to={`/posts/${post._id}`} className="postCard">
            <div className="postCardHeader">
                {post.user.name && <p>{post.user.name}</p>}
                <p>{post.timeStamp}</p>
            </div>
            <div className="postCardContent">
                <h4 className="postCardTitle">{post.title}</h4>
                <div>{post.content}</div>
            </div>
        </Link>
    );
}

export default PostCard;
