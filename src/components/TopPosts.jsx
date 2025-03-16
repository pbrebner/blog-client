import { Link } from "react-router-dom";

import { formatDate } from "../utils/dates.js";

function TopPosts({ topPosts }) {
    return (
        <div className="topPostsContainer">
            {topPosts.map((post) => {
                <div key={post._id} className="topPostCardContainer">
                    <div className="topPostCard">
                        <div className="topPostCardHeader">
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
                                    to={`/blog-client/account/${post.user._id}`}
                                    className="userLink"
                                >
                                    {post.user.name}
                                </Link>
                            )}
                            <p>{formatDate(post.timeStamp)}</p>
                        </div>
                        <div className="topPostCardMain">
                            <Link
                                to={`/blog-client/posts/${post._id}`}
                                className="postCardLink"
                            >
                                <div className="topPostCardContent">
                                    <h4 className="topPostCardTitle">
                                        {post.title}
                                    </h4>
                                    <p>{post.content}</p>
                                </div>
                            </Link>
                            {post.image && (
                                <Link
                                    to={`/blog-client/posts/${post._id}`}
                                    className="postCardLink"
                                >
                                    <div className="topPostCardImageContainer">
                                        <img
                                            src={post.image}
                                            alt="Post Image"
                                            className="topPostCardImage"
                                        />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>;
            })}
        </div>
    );
}

export default TopPosts;
