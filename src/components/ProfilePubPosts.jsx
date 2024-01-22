import PostCard from "./PostCard";

function ProfilePubPosts({
    publishedPosts,
    usersProfile,
    numPosts,
    setNumPosts,
}) {
    return (
        <>
            {publishedPosts.length > 0 ? (
                <div className="publishedPosts">
                    {publishedPosts.map((post) => (
                        <div key={post._id} className="postCardOuterContainer">
                            <PostCard
                                post={post}
                                numPosts={numPosts}
                                setNumPosts={setNumPosts}
                                usersProfile={usersProfile}
                                drafts={false}
                            />
                            <div className="hl"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You haven't published any posts yet.</p>
            )}
        </>
    );
}

export default ProfilePubPosts;
