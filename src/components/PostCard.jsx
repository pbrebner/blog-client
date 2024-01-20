import { Link } from "react-router-dom";
import "./styles/PostCard.css";

import { formatDate } from "../utils/dates.js";

function PostCard({ post }) {
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
            </div>
        </>
    );
}

export default PostCard;
