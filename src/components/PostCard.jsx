import { Link } from "react-router-dom";
import "./styles/PostCard.css";

function PostCard({ post }) {
    return (
        <Link to={`/posts/${post._id}`} className="postCard">
            <h4>{post.title}</h4>
            <div>{post.content}</div>
        </Link>
    );
}

export default PostCard;
