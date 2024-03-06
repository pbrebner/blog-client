import "./styles/PostCardLoader.css";

function PostCardLoader() {
    const postLoadingElements = [];
    for (let i = 0; i < 10; i++) {
        postLoadingElements.push(
            <div key={i} className="postCardLoader">
                <div className="postCardLoaderHeader"></div>
                <div className="postCardLoaderContent">
                    <div className="postCardLoaderText">
                        <div className="postCardLoaderTitle"></div>
                        <div className="postCardLoaderPara"></div>
                    </div>
                    <div className="postCardLoaderImage"></div>
                </div>
            </div>
        );
    }
    return <div className="postsLoading">{postLoadingElements}</div>;
}

export default PostCardLoader;
