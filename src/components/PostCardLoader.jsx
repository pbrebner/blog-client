import "./styles/PostCardLoader.css";

function PostCardLoader({ pageLoading }) {
    return (
        <div className={`postCardLoader ${pageLoading ? "pageLoading" : ""}`}>
            <div className="postCardLoaderText">
                <div className="postCardLoaderHeader"></div>
                <div className="postCardLoaderTitle"></div>
                <div className="postCardLoaderContent"></div>
            </div>
            <div className="postCardLoaderImage"></div>
        </div>
    );
}

export default PostCardLoader;
