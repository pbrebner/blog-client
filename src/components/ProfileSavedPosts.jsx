import PostCard from "./PostCard";

function ProfileSavedPosts({
    savedPosts,
    usersProfile,
    numPosts,
    setNumPosts,
}) {
    return (
        <>
            {savedPosts.length > 0 ? (
                <div className="savedPosts">
                    {savedPosts.map((post) => (
                        <div key={post._id} className="postCardOuterContainer">
                            <PostCard
                                post={post}
                                numPosts={numPosts}
                                setNumPosts={setNumPosts}
                                usersProfile={usersProfile}
                                drafts={true}
                            />
                            <div className="hl"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You don't have any drafts.</p>
            )}
        </>
    );
}

export default ProfileSavedPosts;
