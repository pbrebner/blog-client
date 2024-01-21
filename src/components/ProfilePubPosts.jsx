import PostCard from "./PostCard";

function ProfilePubPosts({
    publishedPosts,
    usersProfile,
    deletePostOpen,
    setDeletePostOpen,
    numPosts,
    setNumPosts,
}) {
    async function handleDeletePostSubmit(postId) {
        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postId}`,
            {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        console.log(response);

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            //setDeletePostOpen(false);
            let val = numPosts - 1;
            setNumPosts(val);
        }
    }

    /*
    function closeModal() {
        setDeletePostOpen(false);
    }

    function toggleDeletePostOpen() {
        deletePostOpen === false
            ? setDeletePostOpen(true)
            : setDeletePostOpen(false);
    }

    {usersProfile && (
                <div
                    className={`deletePostModal ${
                        deletePostOpen ? "display" : ""
                    }`}
                >
                    <button onClick={closeModal} className="closeModalBtn">
                        &#10005;
                    </button>
                    <div className="postModalContent">
                        <h2 className="postModalHeader">Delete Post</h2>
                        <p>
                            Deletion is not reversible, and the post will be
                            completely deleted.
                        </p>
                        <button
                            onClick={handleDeletePostSubmit}
                            className="deletePostConfirm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
    */

    return (
        <>
            {publishedPosts.length > 0 ? (
                <div className="publishedPosts">
                    {publishedPosts.map((post) => (
                        <div key={post._id} className="postCardOuterContainer">
                            <PostCard post={post} />
                            {usersProfile && (
                                <div className="postBtns">
                                    <button
                                        onClick={() =>
                                            handleDeletePostSubmit(post._id)
                                        }
                                        className="deletePostBtn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
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
