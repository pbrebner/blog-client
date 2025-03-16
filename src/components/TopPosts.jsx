import { Link } from "react-router-dom";

import "./styles/topPosts.css";

function TopPosts({ topPosts }) {
    return (
        <div className="topPostsContainer">
            {topPosts.map((post) => {
                <div key={post._id} className="topPostCardContainer">
                    <div className="topPostCard"></div>
                </div>;
            })}
        </div>
    );
}

export default TopPosts;
